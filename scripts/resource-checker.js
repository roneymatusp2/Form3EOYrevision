#!/usr/bin/env node
/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';
import pLimit from 'p-limit';           // para limitar concorrência
import chalk from 'chalk';

dotenv.config();

const DATA_DIR = path.resolve('src', 'data');
const FILES = ['videos.ts', 'pdfs.ts', 'externalResources.ts'];
const URL_REGEX = /https?:\/\/[^\s'")]+/g;
const BROKEN = [];
const limit = pLimit(10);               // máx. 10 requests simultâneas

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY ?? '';
const callMistral = async (url) => {
  if (!MISTRAL_API_KEY) return '';
  try {
    const resp = await axios.post(
      'https://api.mistral.ai/v1/chat/completions',
      {
        model: 'mistral-small',
        messages: [
          { role: 'user',
            content: `Verify that the following resource link is relevant to a mathematics topic and safe for students: ${url}` }
        ],
        temperature: 0.1,
      },
      { headers: { Authorization: `Bearer ${MISTRAL_API_KEY}` } },
    );
    return resp.data.choices[0]?.message?.content ?? '';
  } catch (err) {
    return `⚠️ Mistral API error: ${err.response?.status ?? err.message}`;
  }
};

const checkUrl = async (url) => {
  try {
    const res = await axios.head(url, { timeout: 10000, maxRedirects: 3 });
    return res.status >= 200 && res.status < 400;
  } catch {
    // Alguns servidores bloqueiam HEAD; tenta GET com Range mínimo
    try {
      const res = await axios.get(url, {
        timeout: 10000,
        maxRedirects: 3,
        headers: { Range: 'bytes=0-0' },
      });
      return res.status >= 200 && res.status < 400;
    } catch {
      return false;
    }
  }
};

(async () => {
  const tasks = [];

  for (const file of FILES) {
    const fp = path.join(DATA_DIR, file);
    if (!fs.existsSync(fp)) continue;

    const urls = (fs.readFileSync(fp, 'utf8').match(URL_REGEX) || [])
      .filter((u, i, arr) => arr.indexOf(u) === i);        // remove duplicatas

    for (const url of urls) {
      tasks.push(limit(async () => {
        const alive = await checkUrl(url);
        if (!alive) {
          BROKEN.push(`${file}: ${url}`);
          console.log(chalk.red('✗'), `${url}  (${file})`);
          return;
        }

        const note = await callMistral(url);
        console.log(chalk.green('✓'), url, note ? `→ ${note}` : '');
      }));
    }
  }

  await Promise.all(tasks);

  if (BROKEN.length) {
    fs.writeFileSync('broken-links.txt', BROKEN.join('\n'));
    console.error('\nBroken links detected:\n', BROKEN.join('\n'));
    process.exit(1);                                       // força falha do job
  } else {
    console.log(chalk.blue('\nAll links healthy!'));
  }
})();
