import { google, Auth } from 'googleapis';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';

const execAsync = promisify(exec);

const SCOPES = ['https://www.googleapis.com/auth/documents', 'https://www.googleapis.com/auth/drive.file'];
const TOKEN_PATH = join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = join(process.cwd(), 'credentials.json');

export async function authenticate(): Promise<Auth.OAuth2Client> {
  if (!existsSync(CREDENTIALS_PATH)) {
    throw new Error(`Credentials file not found at ${CREDENTIALS_PATH}. Please download it from Google Cloud Console.`);
  }

  const credentials = JSON.parse(readFileSync(CREDENTIALS_PATH, 'utf-8'));
  const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web || {};
  
  if (!client_id || !client_secret) {
    throw new Error('Invalid credentials file. Missing client_id or client_secret.');
  }

  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    'urn:ietf:wg:oauth:2.0:oob'
  );

  if (existsSync(TOKEN_PATH)) {
    const token = JSON.parse(readFileSync(TOKEN_PATH, 'utf-8'));
    oAuth2Client.setCredentials(token);
    
    try {
      await oAuth2Client.getAccessToken();
      return oAuth2Client;
    } catch (error) {
      console.log('Token expired or invalid, refreshing...');
    }
  }

  return getNewToken(oAuth2Client);
}

async function getNewToken(oAuth2Client: Auth.OAuth2Client): Promise<Auth.OAuth2Client> {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  console.log('Authorize this app by visiting this url:', authUrl);
  
  const platform = process.platform;
  let openCommand: string;
  
  if (platform === 'win32') {
    openCommand = `start "" "${authUrl}"`;
  } else if (platform === 'darwin') {
    openCommand = `open "${authUrl}"`;
  } else {
    openCommand = `xdg-open "${authUrl}"`;
  }

  try {
    await execAsync(openCommand);
  } catch (error) {
    console.log('Could not open browser automatically. Please visit:', authUrl);
  }

  console.log('Enter the code from that page here: ');
  
  const readline = await import('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve, reject) => {
    rl.question('Code: ', async (code) => {
      rl.close();
      try {
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);
        writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
        console.log('Token stored to', TOKEN_PATH);
        resolve(oAuth2Client);
      } catch (error) {
        reject(error);
      }
    });
  });
}

