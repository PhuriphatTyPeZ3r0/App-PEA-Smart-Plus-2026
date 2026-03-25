/**
 * Custom HTTPS Dev Server for local network PWA testing
 * Requires: mkcert certificates in the home/ directory
 * Run: node server.mjs
 */
import { createServer } from 'https';
import { readFileSync, existsSync } from 'fs';
import { parse } from 'url';
import next from 'next';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const HOST = '0.0.0.0';
const PORT = 3443;
const isDev = process.env.NODE_ENV !== 'production';

// Certificate file names (created by mkcert)
const CERT_FILE = path.join(__dirname, '172.29.138.86+2.pem');
const KEY_FILE  = path.join(__dirname, '172.29.138.86+2-key.pem');

if (!existsSync(CERT_FILE) || !existsSync(KEY_FILE)) {
  console.error('\x1b[31m[HTTPS Server] Certificate files not found!\x1b[0m');
  console.error('Run the following commands first:');
  console.error('  mkcert -install');
  console.error('  mkcert 172.29.138.86 localhost 127.0.0.1');
  console.error('Then move the .pem files into the home/ directory.');
  process.exit(1);
}

const app = next({ dev: isDev, hostname: HOST, port: PORT });
const handle = app.getRequestHandler();

const httpsOptions = {
  key:  readFileSync(KEY_FILE),
  cert: readFileSync(CERT_FILE),
};

app.prepare().then(() => {
  createServer(httpsOptions, async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error handling request:', err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  }).listen(PORT, HOST, (err) => {
    if (err) throw err;
    console.log('\x1b[32m');
    console.log('✓ HTTPS Dev Server ready!');
    console.log(`  Local:   https://localhost:${PORT}`);
    console.log(`  Network: https://172.29.138.86:${PORT}`);
    console.log('\x1b[0m');
    console.log('Open on mobile: \x1b[36mhttps://172.29.138.86:3443\x1b[0m');
    console.log('Install PWA via browser "Add to Home Screen"');
  });
});
