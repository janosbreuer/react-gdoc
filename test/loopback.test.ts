import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createLoopbackRedirect } from '../src/google/loopback.js';

test('returns the authorization code from the loopback redirect', async () => {
  const loopback = await createLoopbackRedirect(2_000);
  try {
    const response = await fetch(`${loopback.redirectUri}/?code=test-code`);
    assert.equal(response.status, 200);
    assert.equal(await loopback.waitForCode(), 'test-code');
  } finally {
    await loopback.close();
  }
});

test('rejects when Google redirects with an error', async () => {
  const loopback = await createLoopbackRedirect(2_000);
  const pending = assert.rejects(loopback.waitForCode(), /denied/);
  await fetch(`${loopback.redirectUri}/?error=access_denied`);
  await pending;
  await loopback.close();
});

test('times out when no code arrives', async () => {
  const loopback = await createLoopbackRedirect(30);
  await assert.rejects(loopback.waitForCode(), /Timed out/);
  await loopback.close();
});
