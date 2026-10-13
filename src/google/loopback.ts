import http from 'http';
import type { AddressInfo } from 'net';

export interface LoopbackRedirect {
  redirectUri: string;
  waitForCode: () => Promise<string>;
  close: () => Promise<void>;
}

export function createLoopbackRedirect(timeoutMs = 180_000): Promise<LoopbackRedirect> {
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
      response.end('<p>Authorization complete. You can close this window and return to the terminal.</p>');
      finish(code);
    });

    timer = setTimeout(() => {
      fail(new Error('Timed out waiting for Google authorization. No code arrived at the local redirect.'));
    }, timeoutMs);

    server.on('error', (error) => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
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
