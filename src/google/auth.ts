import { google, Auth } from 'googleapis';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';
import { createLoopbackRedirect } from './loopback.js';

const execAsync = promisify(exec);

const SCOPES = ['https://www.googleapis.com/auth/documents'];
const TOKEN_PATH = join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = join(process.cwd(), 'credentials.json');

interface ClientCredentials {
  clientId: string;
  clientSecret: string;
}

export async function authenticate(): Promise<Auth.OAuth2Client> {
  const { clientId, clientSecret } = readClientCredentials();
  const saved = new google.auth.OAuth2(clientId, clientSecret);

  if (existsSync(TOKEN_PATH)) {
    const token = JSON.parse(readFileSync(TOKEN_PATH, 'utf-8'));
    saved.setCredentials(token);
    try {
      await saved.getAccessToken();
      return saved;
    } catch {
      console.log('Saved token could not be refreshed. Starting sign-in.');
    }
  }

  return signIn(clientId, clientSecret);
}

function readClientCredentials(): ClientCredentials {
  if (!existsSync(CREDENTIALS_PATH)) {
    throw new Error(
      `Credentials file not found at ${CREDENTIALS_PATH}. ` +
      'In Google Cloud Console, enable the Google Docs API, create an OAuth client of type Desktop app, ' +
      'and save the downloaded JSON as credentials.json in the project root. See docs/USAGE.md.'
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(CREDENTIALS_PATH, 'utf-8'));
  } catch {
    throw new Error(`Credentials file at ${CREDENTIALS_PATH} is not valid JSON.`);
  }

  const record = parsed as { installed?: ClientJson; web?: ClientJson };
  const source = record.installed || record.web;
  if (!source?.client_id || !source?.client_secret) {
    throw new Error(
      'Invalid credentials file. Expected client_id and client_secret under installed or web. ' +
      'Download a Desktop app OAuth client JSON from Google Cloud Console.'
    );
  }

  return { clientId: source.client_id, clientSecret: source.client_secret };
}

interface ClientJson {
  client_id?: string;
  client_secret?: string;
}

async function signIn(clientId: string, clientSecret: string): Promise<Auth.OAuth2Client> {
  const loopback = await createLoopbackRedirect();
  const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, loopback.redirectUri);
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  console.log('Open this URL in your browser to authorize react-gdoc:');
  console.log(authUrl);
  await openBrowser(authUrl);

  try {
    const code = await loopback.waitForCode();
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
    console.log('Token stored to', TOKEN_PATH);
    return oAuth2Client;
  } catch (error) {
    if (error instanceof Error && (
      error.message.startsWith('Timed out waiting') ||
      error.message.startsWith('Google authorization was denied')
    )) {
      throw error;
    }
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(
      `${message} Use an OAuth client of type Desktop app. Web clients with a fixed redirect URL are not supported by this CLI.`
    );
  } finally {
    await loopback.close();
  }
}

async function openBrowser(url: string): Promise<void> {
  const platform = process.platform;
  let openCommand: string;
  if (platform === 'win32') {
    openCommand = `start "" "${url}"`;
  } else if (platform === 'darwin') {
    openCommand = `open "${url}"`;
  } else {
    openCommand = `xdg-open "${url}"`;
  }

  try {
    await execAsync(openCommand);
  } catch {
    console.log('Could not open a browser automatically. Open the URL above.');
  }
}
