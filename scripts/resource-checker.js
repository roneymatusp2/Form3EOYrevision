#!/usr/bin/env node
/* eslint-disable no-console */
// ----------------------------------------------------------------------------
// scripts/resource-checker.js
// -----------------------------------------------------------------------------
//  ◼️  Uses: axios, dotenv, p-limit, chalk  (npm install --save axios dotenv p-limit chalk)
//  ◼️  Purpose: scan src/data/{videos,pdfs,externalResources}.ts, extract all URLs,
//              verify availability, optionally query Mistral AI for relevancy,
//              and write a broken-links report. Exits with non-zero status when
//              at least one dead link is found so that CI can fail meaningfully.
// ----------------------------------------------------------------------------

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const dotenv = require('dotenv');
const pLimit = require('p-limit');
const chalk = require('chalk');

dotenv.config();

// ----------------------------- Config ---------------------------------------
const DATA_DIR = path.resolve('src', 'data');
const FILES = ['videos.ts', 'pdfs.ts', 'externalResources.ts'];
const URL_REGEX = /https?:\/\/[^\s'"\)]+/g;
const CONCURRENCY = 10; // simultaneous HTTP requests

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY || '';
const MISTRAL_URL = 'https://api.mistral.ai/v1/chat/completions';

// --------------------------- Helpers ----------------------------------------
async function callMistral(url) {
  if (!MISTRAL_API_KEY) return '';
  try {
    const body = {
      model: 'mistral-small',
      messages: [{
        role: 'user',
        content: `Verify that the following resource link is relevant to a mathematics topic and safe for students: ${url}`,
      }],
      temperature: 0.1,
    };

    const res = await axios.post(MISTRAL_URL, body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${MISTRAL_API_KEY}`,
      },
      timeout: 15_000,
    });

    return res.data.choices?.[0]?.message?.content?.trim() || '';
  } catch (err) {
    return `⚠️  Mistral error: ${err.response?.status ?? err.message}`;
  }
}

async function checkUrlAlive(url) {
  try {
    const res = await axios.head(url, { timeout: 10_000, maxRedirects: 3 });
    return res.status >= 200 && res.status < 400;
  } catch (_) {
    // Some servers disallow HEAD; try minimal GET with ranged bytes.
    try {
      const res = await axios.get(url, {
        headers: { Range: 'bytes=0-0' },
        timeout: 10_000,
        maxRedirects: 3,
      });
      return res.status >= 200 && res.status < 400;
    } catch (err) {
      return false;
    }
  }
}

// ----------------------------- Main -----------------------------------------
(async () => {
  const limit = pLimit(CONCURRENCY);
  const broken = [];
  const seen = new Set();

  for (const file of FILES) {
    const filePath = path.join(DATA_DIR, file);
    if (!fs.existsSync(filePath)) continue;

    const content = fs.readFileSync(filePath, 'utf8');
    const urls = (content.match(URL_REGEX) || [])
      .map(u => u.replace(/[',"\)]$/, '')) // strip trailing punctuation
      .filter(u => {
        if (seen.has(u)) return false;
        seen.add(u);
        return true;
      });

    await Promise.all(urls.map(url => limit(async () => {
      const alive = await checkUrlAlive(url);
      if (!alive) {
        broken.push(`${file}: ${url}`);
        console.log(chalk.red('✗'), url, chalk.gray(`(${file})`));
        return;
      }

      const note = await callMistral(url);
      console.log(chalk.green('✓'), url, note ? chalk.cyan(`→ ${note}`) : '');
    })));
  }

  if (broken.length) {
    fs.writeFileSync('broken-links.txt', broken.join('\n'));
    console.error(chalk.red(`\n${broken.length} broken link(s) found.`));
    process.exit(1);
  } else {
    console.log(chalk.blue('\nAll links are healthy \u2714\uFE0F'));
  }
})();
