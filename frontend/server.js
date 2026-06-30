const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, 'dist');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

http.createServer((req, res) => {
  // Normalize path and remove query parameters
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  let filePath = path.join(DIST_DIR, parsedUrl.pathname);

  // If path is a directory or file doesn't exist, fallback to index.html for SPA routing
  const fileExists = fs.existsSync(filePath);
  const isDirectory = fileExists && fs.statSync(filePath).isDirectory();

  if (!fileExists || isDirectory) {
    filePath = path.join(DIST_DIR, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      console.error(`[Error] Failed to read ${filePath}: ${err.code}`);
      res.writeHead(500);
      res.end('Server Error: ' + err.code);
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': ext === '.html' ? 'no-store, no-cache, must-revalidate' : 'public, max-age=31536000'
      });
      res.end(content, 'utf-8');
    }
  });
}).listen(PORT, () => {
  console.log(`Frontend production server running on port ${PORT}`);
  console.log(`Serving files from: ${DIST_DIR}`);
});
