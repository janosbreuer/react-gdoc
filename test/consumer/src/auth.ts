import { exec } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import http from 'node:http';
import type { AddressInfo } from 'node:net';
import { basename, dirname, join } from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { google } from 'googleapis';

const execAsync = promisify(exec);
const SCOPES = ['https://www.googleapis.com/auth/documents'];

export function consumerRoot(): string {
  const here = dirname(fileURLToPath(import.meta.url));
  const folder = basename(here);
  if (folder === 'dist' || folder === 'src') return dirname(here);
  return here;
}

function credentialsPath(): string {
  return join(consumerRoot(), 'credentials.json');
}

function tokenPath(): string {
  return join(consumerRoot(), 'token.json');
}

function readClient(): { clientId: string; clientSecret: string } {
  const path = credentialsPath();
  if (!existsSync(path)) {
    throw new Error(
      `Credentials file not found at ${path}. Create a Google Cloud Desktop OAuth client, enable the Google Docs API, and save the JSON there. This consumer does not read credentials from the react-gdoc repository root.`
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    throw new Error(`Credentials file at ${path} is not valid JSON.`);
  }

  const record = parsed as { installed?: ClientJson; web?: ClientJson };
  const source = record.installed || record.web;
  if (!source?.client_id || !source?.client_secret) {
    throw new Error(
      'Invalid credentials file. Expected client_id and client_secret under installed or web. Use an OAuth client of type Desktop app.'
    );
  }
  return { clientId: source.client_id, clientSecret: source.client_secret };
}

interface ClientJson {
  client_id?: string;
  client_secret?: string;
}

export async function authorize() {
  const { clientId, clientSecret } = readClient();
  const saved = new google.auth.OAuth2(clientId, clientSecret);
  const tokenFile = tokenPath();

  if (existsSync(tokenFile)) {
    saved.setCredentials(JSON.parse(readFileSync(tokenFile, 'utf8')));
    try {
      await saved.getAccessToken();
      return saved;
    } catch {
      console.log('Saved token could not be refreshed. Starting sign-in.');
    }
  }

  const loopback = await listenForCode();
  const oauth = new google.auth.OAuth2(clientId, clientSecret, loopback.redirectUri);
  const url = oauth.generateAuthUrl({ access_type: 'offline', scope: SCOPES });
  console.log('Open this URL to authorize the consumer:');
  console.log(url);
  await openBrowser(url);

  try {
    const code = await loopback.waitForCode();
    const { tokens } = await oauth.getToken(code);
    oauth.setCredentials(tokens);
    writeFileSync(tokenFile, JSON.stringify(tokens, null, 2));
    console.log('Token stored to', tokenFile);
    return oauth;
  } finally {
    await loopback.close();
  }
}

function listenForCode(timeoutMs = 180_000): Promise<{
  redirectUri: string;
  waitForCode: () => Promise<string>;
  close: () => Promise<void>;
}> {
  return new Promise((resolve, reject) => {
    let settled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let finishCode: (code: string) => void = () => {};
    let failCode: (error: Error) => void = () => {};
    const codePromise = new Promise<string>((resolveCode, rejectCode) => {
      finishCode = resolveCode;
      failCode = rejectCode;
    });

    const finish = (code: string) => {
      if (settled) return;
      settled = true;
      if (timer) clearTimeout(timer);
      finishCode(code);
      server.close();
    };

    const fail = (error: Error) => {
      if (settled) return;
      settled = true;
      if (timer) clearTimeout(timer);
      failCode(error);
      server.close();
    };

    const server = http.createServer((request, response) => {
      const url = new URL(request.url ?? '/', 'http://127.0.0.1');
      const error = url.searchParams.get('error');
      const code = url.searchParams.get('code');
      response.setHeader('Content-Type', 'text/html; charset=utf-8');
      if (error) {
        response.statusCode = 400;
        response.end('<p>Authorization was not completed. You can close this window.</p>');
        fail(new Error(`Google authorization was denied (${error}).`));
        return;
      }
      if (!code) {
        response.statusCode = 404;
        response.end('<p>Waiting for Google to return an authorization code.</p>');
        return;
      }
      response.end('<p>Authorization complete. You can close this window.</p>');
      finish(code);
    });

    timer = setTimeout(() => {
      fail(new Error('Timed out waiting for Google authorization.'));
    }, timeoutMs);

    server.on('error', (error) => {
      if (!settled) {
        settled = true;
        if (timer) clearTimeout(timer);
        reject(error);
      }
    });

    server.listen(0, '127.0.0.1', () => {
      const address = server.address() as AddressInfo;
      resolve({
        redirectUri: `http://127.0.0.1:${address.port}`,
        waitForCode: () => codePromise,
        close: () => new Promise((closeResolve) => {
          server.close(() => closeResolve());
        }),
      });
    });
  });
}

async function openBrowser(url: string): Promise<void> {
  const command = process.platform === 'win32'
    ? `start "" "${url}"`
    : process.platform === 'darwin'
      ? `open "${url}"`
      : `xdg-open "${url}"`;
  try {
    await execAsync(command);
  } catch {
    console.log('Could not open a browser automatically. Open the URL above.');
  }
}
