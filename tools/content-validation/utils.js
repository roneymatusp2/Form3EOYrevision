// Utility functions for content validation tools
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const config = require('./config');

// Ensure required directories exist
function ensureDirectoriesExist() {
  const dirs = [
    config.LOGS_DIR,
    config.BACKUPS_DIR,
    config.OUTPUT_DIR,
    path.join(config.OUTPUT_DIR, 'latex'),
    path.join(config.OUTPUT_DIR, 'pdf')
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

// Initialize logging
function initLogging(processName) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const logFilePath = path.join(config.LOGS_DIR, `${processName}-${timestamp}.log`);
  
  // Create a logging function
  const log = (message, level = 'INFO') => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level}] ${message}\n`;
    
    // Log to console
    if (level === 'ERROR') {
      console.error(message);
    } else {
      console.log(message);
    }
    
    // Log to file
    fs.appendFileSync(logFilePath, logMessage);
  };
  
  // Log process start
  log(`Starting ${processName} process`);
  log(`Log file: ${logFilePath}`);
  
  return { log, logFilePath };
}

// Create a backup of a file
function createBackup(filePath, log) {
  try {
    const filename = path.basename(filePath);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(config.BACKUPS_DIR, `${filename}.backup-${timestamp}`);
    
    fs.copyFileSync(filePath, backupPath);
    log(`Created backup of ${filename} at ${backupPath}`);
    
    return backupPath;
  } catch (error) {
    log(`Error creating backup: ${error.message}`, 'ERROR');
    return null;
  }
}

// DeepSeek API call with retry mechanism
async function callDeepSeekAPI(prompt, systemPrompt, maxRetries = config.MAX_RETRIES, log) {
  let retries = 0;
  
  while (retries <= maxRetries) {
    try {
      log(`Calling DeepSeek API (attempt ${retries + 1}/${maxRetries + 1})...`);
      
      const response = await axios.post(
        config.DEEPSEEK_API_URL,
        {
          model: config.DEEPSEEK_MODEL,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt }
          ],
          temperature: 0.2,
          max_tokens: 1000
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${config.DEEPSEEK_API_KEY}`
          }
        }
      );
      
      return response.data.choices[0].message.content;
    } catch (error) {
      log(`API error: ${error.message}`, 'ERROR');
      
      if (error.response) {
        log(`Response data: ${JSON.stringify(error.response.data)}`, 'ERROR');
      }
      
      retries++;
      
      if (retries <= maxRetries) {
        const delay = retries * config.API_DELAY_MS;
        log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw new Error(`Failed to call DeepSeek API after ${maxRetries + 1} attempts`);
      }
    }
  }
}

// Extract YouTube video ID from URL
function extractYouTubeVideoId(url) {
  if (!url) return null;
  
  // Handle various YouTube URL formats
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7] && match[7].length === 11) ? match[7] : null;
}

// Check if a YouTube video is accessible
async function isYouTubeVideoAccessible(videoId) {
  try {
    const videoInfoUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    await axios.get(videoInfoUrl);
    return true;
  } catch (error) {
    return false;
  }
}

// Parse TypeScript objects from files
function parseTypeScriptFile(content, objectName) {
  try {
    // Extract the object declaration
    const pattern = new RegExp(`(?:const|let|var)\\s+${objectName}\\s*=\\s*({[\\s\\S]*?});`, 'i');
    const match = content.match(pattern);
    
    if (!match) {
      throw new Error(`Could not find ${objectName} in the file`);
    }
    
    // Prepare string for evaluation
    const objStr = match[1]
      .replace(/new Date\(\)\.toISOString\(\)/g, '"2023-01-01T00:00:00.000Z"')
      .replace(/\/\/.*/g, ''); // Remove comments
    
    // Use Function constructor for safer evaluation
    const getObject = new Function(`return ${objStr}`);
    return getObject();
  } catch (error) {
    throw new Error(`Error parsing ${objectName}: ${error.message}`);
  }
}

// Process in batches
async function processBatch(items, processFunction, batchSize, log) {
  const results = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    log(`Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(items.length/batchSize)} (${batch.length} items)`);
    
    // Process items in batch
    const batchResults = await Promise.all(batch.map(item => processFunction(item)));
    results.push(...batchResults);
    
    // Add delay between batches
    if (i + batchSize < items.length) {
      log(`Waiting ${config.API_DELAY_MS}ms before next batch...`);
      await new Promise(resolve => setTimeout(resolve, config.API_DELAY_MS));
    }
  }
  
  return results;
}

// Create a progress bar for console output
function createProgressBar(total, current, size = 40) {
  const percent = current / total;
  const filled = Math.round(size * percent);
  const empty = size - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  return `[${bar}] ${current}/${total} (${Math.round(percent * 100)}%)`;
}

module.exports = {
  ensureDirectoriesExist,
  initLogging,
  createBackup,
  callDeepSeekAPI,
  extractYouTubeVideoId,
  isYouTubeVideoAccessible,
  parseTypeScriptFile,
  processBatch,
  createProgressBar
};
