// Simple HTTP server for portfolio frontend
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.wasm': 'application/wasm',
  '.webmanifest': 'application/manifest+json',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);

  // Remove query string
  let filePath = req.url.split('?')[0];

  // Default to index.html
  if (filePath === '/') {
    filePath = '/index.html';
  }

  let fullPath = path.join(__dirname, filePath);

  // Check if path is a directory
  fs.stat(fullPath, (err, stats) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 - File Not Found</h1>', 'utf-8');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
      return;
    }

    // If it's a directory, serve index.html
    if (stats.isDirectory()) {
      fullPath = path.join(fullPath, 'index.html');
    }

    const ext = path.extname(fullPath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    fs.readFile(fullPath, (err, content) => {
      if (err) {
        if (err.code === 'ENOENT') {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end('<h1>404 - File Not Found</h1>', 'utf-8');
        } else {
          res.writeHead(500);
          res.end(`Server Error: ${err.code}`);
        }
      } else {
        res.writeHead(200, {
          'Content-Type': contentType,
          'Cache-Control': 'no-cache'
        });
        // Pour les fichiers texte (HTML, CSS, JS, SVG), spécifier UTF-8
        // Pour les images binaires, envoyer le buffer brut
        if (contentType.startsWith('text/') || contentType.includes('javascript') || contentType.includes('json') || contentType.includes('svg')) {
          res.end(content, 'utf-8');
        } else {
          res.end(content);
        }
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`
============================================
  🚀 PORTFOLIO ALICE SINDAYIGAYA
  Design Tech Futuriste Professionnel
============================================

✅ Serveur démarré avec succès!

📍 URL:     http://localhost:${PORT}
📂 Dossier: ${__dirname}

📌 Pour arrêter: Ctrl+C
============================================
  `);
});
