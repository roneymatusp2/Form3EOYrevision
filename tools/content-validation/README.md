# Content Validation Tools for Form3EOYrevision

This directory contains tools to automatically validate and improve the content in the Form3EOYrevision project, using the DeepSeek Reasoner API to intelligently identify and fix issues.

## Overview

These tools help ensure that all educational content is:
- Accessible (videos are not broken or private)
- Relevant (content matches the assigned topic)
- Complete (exercises have solution files)
- High-quality (using the best available resources)

## Features

### Video Validation
- Scans all videos across topics and subtopics
- Checks if videos are accessible
- Verifies if video content matches the assigned topic
- Automatically finds and replaces broken or irrelevant videos
- Generates detailed reports of all changes

### PDF Validation
- Checks that every PDF link is reachable
- Extracts a text sample from each PDF
- Uses DeepSeek Reasoner to confirm the PDF is relevant to its topic
- Generates a report with any issues found

### Future Features
- Automatic generation of missing exercise solutions
- Content quality assessment
- Math notation validation

## Dependencies

These tools require:
- Node.js v14 or higher
- DeepSeek API key (stored in `.env` file)
- Additional NPM packages (listed in project's package.json)

## Directory Structure

```
tools/content-validation/
├── config.js            # Configuration settings
├── utils.js             # Shared utility functions
├── check-videos.js      # Video verification tool
├── check-pdfs.js        # PDF verification tool
├── validate-all.js      # Master script to run all tools
└── README.md            # This documentation file
```

## Usage

### Setup

1. Make sure the DeepSeek API key is set in the project's `.env` file:
   ```
   DEEPSEEK_API_KEY=sk-756f72b30f0c4fa48b01a5f2959bc118
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Tools

You can run individual tools or use the master script to run everything:

#### Check Videos Only

```bash
npm run check-videos
```

#### Check PDFs Only

```bash
npm run check-pdfs
```

#### Run All Validation Tools

```bash
npm run validate-all
```

## How It Works

### Video Verification Process

1. The tool reads the `videos.ts` and `topics.ts` files to understand the project structure
2. For each video:
   - It checks if the YouTube video is accessible
   - It uses DeepSeek Reasoner to analyze if the video is relevant to its topic
   - If issues are found, it finds a replacement video
   - It updates the `videos.ts` file directly with the new URL
3. All operations are logged and detailed reports are generated

### PDF Verification Process

1. The tool reads the `pdfs.ts` and `topics.ts` files
2. Each PDF link is fetched to ensure it responds successfully
3. A text sample is extracted from the file and analysed with DeepSeek Reasoner
4. Results are stored in a JSON report for review

### Batch Processing

To avoid API rate limits and memory issues, videos are processed in batches with appropriate delays between API calls.

## Logs and Reports

All operations create detailed logs in the `logs` directory:
- Timestamped log files for each run
- Backup files created before making changes
- JSON reports with detailed results for further analysis

## Configuration

You can customize the behavior by editing `config.js`:
- API settings (delay, retries)
- Relevance threshold for videos
- Batch size for processing
- File paths and output locations

## Advanced Usage

### Running Individual Functions

You can import and use specific functions in your own scripts:

```javascript
const { verifyVideoRelevance } = require('./tools/content-validation/check-videos');

// Use the function directly
const result = await verifyVideoRelevance(videoUrl, topicName, subtopicName);
```

### Continuous Integration

These tools can be integrated into your CI/CD pipeline to automatically validate content changes.

## Troubleshooting

If you encounter issues:

1. Check the log files for detailed error messages
2. Verify the API key in the `.env` file
3. Try reducing the batch size if you hit rate limits
4. Make sure you have the latest version of all dependencies

## Getting Help

If you need assistance, please check:
- The detailed logs in the `logs` directory
- The DeepSeek API documentation for API-related issues
- Open an issue in the project repository for bugs or feature requests
