const http = require("http");
const fs = require("fs");
const path = require("path");
const root = __dirname;
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p === "/") p = "/index.html";
  const f = path.join(root, p);
  fs.readFile(f, (e, d) => {
    if (e) { res.writeHead(404); res.end("404"); return; }
    const ext = path.extname(f);
    const mime = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml" }[ext] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": mime + "; charset=utf-8" });
    res.end(d);
  });
}).listen(8137, () => console.log("Math World dev server: http://localhost:8137"));
