require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const DATA_DIR = path.join(__dirname, '..', 'src', 'data');
const FILES = ['videos.ts', 'pdfs.ts', 'externalResources.ts'];
const URL_REGEX = /https?:\/\/[^'"\s)]+/g;

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';

async function callMistral(url) {
  if (!MISTRAL_API_KEY) return null;
  try {
    const prompt = `Verify that the following resource link is relevant to a mathematics topic and safe for students: ${url}`;
    const resp = await axios.post(
      MISTRAL_API_URL,
      { model: 'mistral-small', messages: [{ role: 'user', content: prompt }] },
      { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${MISTRAL_API_KEY}` } }
    );
    return resp.data.choices[0].message.content;
  } catch (err) {
    console.error('Mistral API error', err.message);
    return null;
  }
}

async function checkUrl(url) {
  try {
    const res = await axios.head(url, { timeout: 10000 });
    return res.status >= 200 && res.status < 400;
  } catch {
    return false;
  }
}

(async () => {
  for (const file of FILES) {
    const fp = path.join(DATA_DIR, file);
    if (!fs.existsSync(fp)) continue;
    const content = fs.readFileSync(fp, 'utf8');
    const urls = content.match(URL_REGEX) || [];
    for (const url of urls) {
      const ok = await checkUrl(url);
      if (!ok) {
        console.error(`Broken link detected in ${file}: ${url}`);
      } else {
        const note = await callMistral(url);
        console.log(`Checked ${url}: ${note || 'no response'}`);
      }
    }
  }
})();
