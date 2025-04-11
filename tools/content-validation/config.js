// Configuration for content validation tools
require('dotenv').config();
const path = require('path');

// Project paths
const ROOT_DIR = path.resolve(__dirname, '../..');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const DATA_DIR = path.join(SRC_DIR, 'data');
const VIDEOS_FILE = path.join(DATA_DIR, 'videos.ts');
const TOPICS_FILE = path.join(DATA_DIR, 'topics.ts');
const PDFS_FILE = path.join(DATA_DIR, 'pdfs.ts');

// Logs configuration
const LOGS_DIR = path.join(ROOT_DIR, 'logs');
const BACKUPS_DIR = path.join(LOGS_DIR, 'backups');

// DeepSeek API configuration
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || "sk-756f72b30f0c4fa48b01a5f2959bc118";
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";
const DEEPSEEK_MODEL = "deepseek-reasoner";

// Rate limiting and performance settings
const API_DELAY_MS = 3000; // Delay between API calls to avoid rate limiting
const BATCH_SIZE = 5; // Process videos in batches to avoid memory issues
const MAX_RETRIES = 3; // Number of retry attempts for API calls

// Video verification thresholds
const RELEVANCE_THRESHOLD = 60; // Minimum confidence score (0-100) for video relevance

// PDF verification settings
const PDF_CONTENT_SAMPLE_SIZE = 1000; // Number of characters to extract from PDF for analysis

// Solution generation settings
const LATEX_TEMPLATE_FILE = path.join(__dirname, 'templates', 'solution-template.tex');
const OUTPUT_DIR = path.join(ROOT_DIR, 'generated-solutions');

// Export configuration
module.exports = {
  // Paths
  ROOT_DIR,
  SRC_DIR,
  DATA_DIR,
  VIDEOS_FILE,
  TOPICS_FILE,
  PDFS_FILE,
  LOGS_DIR,
  BACKUPS_DIR,
  OUTPUT_DIR,
  LATEX_TEMPLATE_FILE,
  
  // API Configuration
  DEEPSEEK_API_KEY,
  DEEPSEEK_API_URL,
  DEEPSEEK_MODEL,
  
  // Processing settings
  API_DELAY_MS,
  BATCH_SIZE,
  MAX_RETRIES,
  RELEVANCE_THRESHOLD,
  PDF_CONTENT_SAMPLE_SIZE
};
