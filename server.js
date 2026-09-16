const fs = require("fs");
const http = require("http");
const path = require("path");
const { URL } = require("url");

const PORT = Number(process.env.PORT || 4173);
const ROOT = __dirname;
const SAFE_ROOT = path.resolve(ROOT);
const MAX_BODY_BYTES = 1024 * 1024;
const rateBuckets = new Map();

loadEnv();

const apiRoutes = {
  "/api/ai-recommend": () => require("./api/ai-recommend"),
  "/api/create-checkout-session": () => require("./api/create-checkout-session"),
  "/api/generate-prompt": () => require("./api/generate-prompt"),
  "/api/health": () => require("./api/health"),
  "/api/stripe-webhook": () => require("./api/stripe-webhook"),
  "/api/support-request": () => require("./api/support-request"),
};

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
};

function loadEnv() {
  const envPath = path.join(ROOT, ".env");
  if (!fs.existsSync(envPath)) return;

  fs.readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) return;
      const index = trimmed.indexOf("=");
      const key = trimmed.slice(0, index).trim();
      const value = trimmed.slice(index + 1).trim().replace(/^['"]|['"]$/g, "");
      if (key && process.env[key] === undefined) process.env[key] = value;
    });
}

function send(res, statusCode, body, headers = {}) {
  res.writeHead(statusCode, {
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    ...headers,
  });
  res.end(body);
}

function decorateResponse(res) {
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data) => {
    send(res, res.statusCode || 200, JSON.stringify(data), {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    });
  };
  res.send = (data) => {
    send(res, res.statusCode || 200, Buffer.isBuffer(data) ? data : String(data), {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    });
  };
  return res;
}

function checkRateLimit(req, res) {
  const key = req.socket.remoteAddress || "local";
  const now = Date.now();
  const bucket = rateBuckets.get(key) || { count: 0, resetAt: now + 60_000 };

  if (now > bucket.resetAt) {
    bucket.count = 0;
    bucket.resetAt = now + 60_000;
  }

  bucket.count += 1;
  rateBuckets.set(key, bucket);

  if (bucket.count > 120) {
    decorateResponse(res).status(429).json({ error: "Too many requests. Please retry in a minute." });
    return false;
  }

  return true;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;

    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(new Error("Request body too large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });

    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

async function handleApi(req, res, pathname) {
  if (!checkRateLimit(req, res)) return;

  const route = apiRoutes[pathname];
  if (!route) {
    decorateResponse(res).status(404).json({ error: "API route not found" });
    return;
  }

  try {
    const rawBody = await readBody(req);
    req.rawBody = rawBody;

    if (rawBody.length && pathname !== "/api/stripe-webhook") {
      try {
        req.body = JSON.parse(rawBody.toString("utf8"));
      } catch {
        decorateResponse(res).status(400).json({ error: "Invalid JSON body" });
        return;
      }
    } else {
      req.body = rawBody.length ? rawBody : {};
    }

    await route()(req, decorateResponse(res));
  } catch (error) {
    if (!res.headersSent) {
      decorateResponse(res).status(error.message === "Request body too large" ? 413 : 500).json({
        error: error.message === "Request body too large" ? error.message : "Server error",
      });
    }
  }
}

function handleStatic(req, res, pathname) {
  let requestedPath;
  try {
    requestedPath = decodeURIComponent(pathname);
  } catch {
    send(res, 400, "Bad request", { "Content-Type": "text/plain; charset=utf-8" });
    return;
  }

  const cleanPath = requestedPath === "/" ? "/index.html" : requestedPath;
  const filePath = path.resolve(ROOT, `.${cleanPath}`);

  if (filePath !== SAFE_ROOT && !filePath.startsWith(`${SAFE_ROOT}${path.sep}`)) {
    send(res, 403, "Forbidden", { "Content-Type": "text/plain; charset=utf-8" });
    return;
  }

  fs.stat(filePath, (statError, stat) => {
    if (statError || !stat.isFile()) {
      send(res, 404, "Not found", { "Content-Type": "text/plain; charset=utf-8" });
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    send(res, 200, fs.readFileSync(filePath), {
      "Content-Type": mimeTypes[extension] || "application/octet-stream",
      "Cache-Control": extension === ".html" ? "no-store" : "public, max-age=3600",
    });
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  if (url.pathname.startsWith("/api/")) {
    await handleApi(req, res, url.pathname);
    return;
  }

  if (req.method !== "GET" && req.method !== "HEAD") {
    send(res, 405, "Method not allowed", { "Content-Type": "text/plain; charset=utf-8" });
    return;
  }

  handleStatic(req, res, url.pathname);
});

server.listen(PORT, () => {
  console.log(`PromptlyPro running at http://localhost:${PORT}`);
});
