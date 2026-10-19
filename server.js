/**
 * FlashLearn - ElevenLabs Audio Server (Node.js Alternative)
 * Zero external dependencies - uses native Node.js http, https, fs, crypto
 */
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const url = require('url');

const BASE_DIR = __dirname;
const CACHE_DIR = path.join(BASE_DIR, 'audio_cache');
const ENV_FILE = path.join(BASE_DIR, '.env');

if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

function loadEnv() {
  const env = {};
  if (fs.existsSync(ENV_FILE)) {
    const lines = fs.readFileSync(ENV_FILE, 'utf-8').split('\n');
    for (let line of lines) {
      line = line.trim();
      if (!line || line.startsWith('#')) continue;
      const idx = line.indexOf('=');
      if (idx !== -1) {
        const k = line.slice(0, idx).trim();
        const v = line.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
        env[k] = v;
      }
    }
  }
  return env;
}

const env = loadEnv();
const API_KEY = process.env.ELEVENLABS_API_KEY || env.ELEVENLABS_API_KEY || '';
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || env.ELEVENLABS_VOICE_ID || 'Xb7hH8MSUJpSbSDYk0k2';
const MODEL_ID = process.env.ELEVENLABS_MODEL_ID || env.ELEVENLABS_MODEL_ID || 'eleven_flash_v2_5';
const PORT = parseInt(process.env.PORT || env.PORT || '3000', 10);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.mp3': 'audio/mpeg',
  '.ico': 'image/x-icon'
};

function getCacheFilename(text, voiceId, modelId) {
  const clean = text.trim().toLowerCase();
  const slug = clean.replace(/[^a-zA-Z0-9]+/g, '_').slice(0, 20).replace(/^_|_$/g, '') || 'speech';
  const hash = crypto.createHash('md5').update(`${clean}:${voiceId}:${modelId}`).digest('hex').slice(0, 12);
  return `${slug}_${hash}.mp3`;
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  const pathname = parsed.pathname;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Range, Authorization');
  res.setHeader('Access-Control-Expose-Headers', 'X-Cache, Content-Length');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // /api/status
  if (pathname === '/api/status') {
    const files = fs.readdirSync(CACHE_DIR).filter(f => f.endsWith('.mp3'));
    const totalBytes = files.reduce((acc, f) => acc + fs.statSync(path.join(CACHE_DIR, f)).size, 0);
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      status: 'online',
      provider: 'ElevenLabs',
      model_id: MODEL_ID,
      voice_id: VOICE_ID,
      voice_name: 'Alice (Clear, Engaging Educator)',
      api_key_configured: Boolean(API_KEY && !API_KEY.startsWith('your_')),
      cache_count: files.length,
      cache_size_mb: (totalBytes / (1024 * 1024)).toFixed(2)
    }));
    return;
  }

  // /api/tts
  if (pathname === '/api/tts') {
    const text = (parsed.query.text || '').trim();
    const voiceId = (parsed.query.voice_id || VOICE_ID).trim();

    if (!text) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: "Thieu tham so 'text'" }));
      return;
    }

    if (!API_KEY) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: "Chua co ELEVENLABS_API_KEY trong .env" }));
      return;
    }

    const filename = getCacheFilename(text, voiceId, MODEL_ID);
    const filepath = path.join(CACHE_DIR, filename);

    // Cache hit
    if (fs.existsSync(filepath) && fs.statSync(filepath).size > 0) {
      console.log(`[CACHE HIT ⚡] '${text}' -> ${filename}`);
      const stat = fs.statSync(filepath);
      res.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Content-Length': stat.size,
        'X-Cache': 'HIT',
        'Cache-Control': 'public, max-age=31536000, immutable'
      });
      fs.createReadStream(filepath).pipe(res);
      return;
    }

    // Cache miss -> ElevenLabs API
    console.log(`[ELEVENLABS API 🎙️] Requesting audio for '${text}'...`);
    const postData = JSON.stringify({
      text: text,
      model_id: MODEL_ID,
      voice_settings: { stability: 0.5, similarity_boost: 0.8 }
    });

    const apiReq = https.request({
      hostname: 'api.elevenlabs.io',
      path: `/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
      method: 'POST',
      headers: {
        'xi-api-key': API_KEY,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (apiRes) => {
      if (apiRes.statusCode !== 200) {
        let errBody = '';
        apiRes.on('data', chunk => errBody += chunk);
        apiRes.on('end', () => {
          console.error(`[ELEVENLABS ERROR] HTTP ${apiRes.statusCode}: ${errBody}`);
          res.writeHead(apiRes.statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ error: `ElevenLabs Error ${apiRes.statusCode}`, details: errBody }));
        });
        return;
      }

      const chunks = [];
      apiRes.on('data', chunk => chunks.push(chunk));
      apiRes.on('end', () => {
        const buffer = Buffer.concat(chunks);
        fs.writeFileSync(filepath, buffer);
        console.log(`[CACHE SAVED 💾] ${filename} (${buffer.length} bytes)`);

        res.writeHead(200, {
          'Content-Type': 'audio/mpeg',
          'Content-Length': buffer.length,
          'X-Cache': 'MISS',
          'Cache-Control': 'public, max-age=31536000, immutable'
        });
        res.end(buffer);
      });
    });

    apiReq.on('error', (err) => {
      console.error(`[REQUEST ERROR]`, err);
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: err.message }));
    });

    apiReq.write(postData);
    apiReq.end();
    return;
  }

  // Serve static files
  let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') safePath = '/index.html';
  const filePath = path.join(BASE_DIR, safePath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`FlashLearn Server listening on http://localhost:${PORT}`);
});
