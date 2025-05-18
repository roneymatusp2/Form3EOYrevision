// Master script to run all content validation tools
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

const config = require('./config');
const utils = require('./utils');

// Video checker (we'll add other tools later)
const videoChecker = require('./check-videos');

async function main() {
  // Initialize utilities
  utils.ensureDirectoriesExist();
  const { log } = utils.initLogging('validate-all');

  try {
    log('Starting complete content validation process...');

    // 1. Check videos first
    log('\n===== STEP 1: CHECKING VIDEOS =====');
    try {
      log('Running video checker...');
      await execAsync('node tools/content-validation/check-videos.js');
      log('Video checking completed successfully!');
    } catch (error) {
      log(`Error checking videos: ${error.message}`, 'ERROR');
      log('Proceeding to next step despite errors.');
    }

    // 2. Check PDFs
    log('\n===== STEP 2: CHECKING PDFs =====');
    try {
      log('Running PDF checker...');
      await execAsync('node tools/content-validation/check-pdfs.js');
      log('PDF checking completed successfully!');
    } catch (error) {
      log(`Error checking PDFs: ${error.message}`, 'ERROR');
      log('Proceeding to next step despite errors.');
    }
    //
    // 3. Generate missing solutions
    // log('\n===== STEP 3: GENERATING SOLUTIONS =====');
    // try {
    //   log('Generating missing solutions...');
    //   await execAsync('node tools/content-validation/generate-solutions.js');
    //   log('Solution generation completed successfully!');
    // } catch (error) {
    //   log(`Error generating solutions: ${error.message}`, 'ERROR');
    //   log('Proceeding to next step despite errors.');
    // }

    log('\nAll content validation steps have been completed!');
    log('Check the logs directory for detailed information on each step.');

  } catch (error) {
    log(`Fatal error in validation process: ${error.message}`, 'ERROR');
    if (error.stack) {
      log(error.stack, 'ERROR');
    }
    process.exit(1);
  }
}

// Run the main function
if (require.main === module) {
  main().catch(error => {
    console.error(`Fatal error: ${error.message}`);
    process.exit(1);
  });
}
