# Video Checker Tool for Form3EOYrevision

This tool automatically checks all videos in the Form3EOYrevision project, verifies they are working and relevant to their topics, and replaces any broken or irrelevant videos with appropriate alternatives.

## Overview

The tool uses the Mistral Reasoner API to:

1. Go through all videos in each topic and subtopic
2. Check if each video is accessible (not deleted or private)
3. Verify if the video content is relevant to the assigned topic
4. Automatically find and replace videos that are broken or irrelevant
5. Save all changes directly to your project files

## Requirements

- Node.js (v14 or later)
- npm

## Setup

1. The `.env` file has already been set up with the Mistral Reasoner API key.

2. Install the required dependencies:

```bash
npm install axios dotenv
```

## Running the Tool

To run the video verification and replacement process:

```bash
node video-checker.js
```

This will:
- Check all videos in the `src/data/videos.ts` file
- Create backups before making any changes
- Log all activity to the console and a log file
- Update `videos.ts` directly with any needed replacements

## Understanding the Output

The tool will display:
- Details of each video being checked
- Status indicators (✅ for valid, ❌ for issues)
- Replacement information when a video is updated
- A summary of processed, verified, replaced, and failed videos

## Log Files

All activities are logged to:
- The console
- A timestamped log file in the `logs` directory (created automatically)

## Customization

You can adjust the following settings in the `video-checker.js` file:

- Verification criteria
- API parameters
- Delay between API calls (currently 3 seconds)

## Troubleshooting

If you encounter any issues:

1. Check the log files for detailed error messages
2. Verify the API key in the `.env` file
3. Ensure you have internet connectivity
4. Make sure you have write permissions for the project files

## Important Note

The Mistral Reasoner API has rate limits. If you get rate limit errors, increase the delay between API calls or run the tool in smaller batches.
