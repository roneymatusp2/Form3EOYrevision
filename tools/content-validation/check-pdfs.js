// PDF content verification tool
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const pdfParse = require('pdf-parse');
const config = require('./config');
const utils = require('./utils');

const SYSTEM_PROMPT = `You are a mathematics education expert specializing in Cambridge IGCSE Mathematics.
Your task is to analyse short text excerpts from PDF resources and determine if they are relevant to the specified topic.`;

async function main() {
  utils.ensureDirectoriesExist();
  const { log } = utils.initLogging('pdf-checker');

  try {
    log('Reading PDFs and topics data...');
    const pdfContent = fs.readFileSync(config.PDFS_FILE, 'utf8');
    const topicsContent = fs.readFileSync(config.TOPICS_FILE, 'utf8');

    const pdfs = utils.parseTypeScriptFile(pdfContent, 'pdfs');
    const topics = utils.parseTypeScriptFile(topicsContent, 'topics');

    const topicNameMap = {};
    topics.forEach(topic => {
      topicNameMap[topic.$id] = { name: topic.name, subtopics: {} };
      if (topic.subtopics) {
        topic.subtopics.forEach(sub => {
          topicNameMap[topic.$id].subtopics[sub.slug] = sub.name;
        });
      }
    });

    const stats = {
      totalPdfs: 0,
      reachable: 0,
      unreachable: 0,
      relevant: 0,
      irrelevant: 0,
      failed: 0
    };

    const allPdfs = [];
    for (const topicId in pdfs) {
      for (const subSlug in pdfs[topicId]) {
        const list = pdfs[topicId][subSlug];
        list.forEach(pdf => {
          allPdfs.push({
            topicId,
            subSlug,
            topicName: topicNameMap[topicId]?.name || topicId,
            subName: topicNameMap[topicId]?.subtopics[subSlug] || subSlug,
            id: pdf.id,
            title: pdf.title,
            url: pdf.url
          });
        });
      }
    }

    stats.totalPdfs = allPdfs.length;
    log(`Found ${stats.totalPdfs} PDFs to verify`);

    const processPdf = async info => {
      const { topicId, subSlug, topicName, subName, id, title, url } = info;
      log(`\nChecking PDF: ${title}`);
      log(`Topic: ${topicName} / ${subName}`);
      log(`URL: ${url}`);

      try {
        const head = await axios.head(url, { validateStatus: s => s < 400 });
        if (head.status >= 400) throw new Error(`Status ${head.status}`);
        stats.reachable++;
      } catch (err) {
        log(`❌ PDF unreachable: ${err.message}`, 'ERROR');
        stats.unreachable++;
        return { ...info, status: 'unreachable' };
      }

      try {
        const res = await axios.get(url, { responseType: 'arraybuffer' });
        const data = await pdfParse(res.data);
        const sample = data.text.slice(0, config.PDF_CONTENT_SAMPLE_SIZE);
        const relevance = await verifyPdfRelevance(sample, topicName, subName, log);
        if (relevance.isRelevant) {
          stats.relevant++;
          return { ...info, status: 'relevant' };
        } else {
          stats.irrelevant++;
          return { ...info, status: 'irrelevant', reason: relevance.reasoning };
        }
      } catch (err) {
        log(`❌ Error processing PDF: ${err.message}`, 'ERROR');
        stats.failed++;
        return { ...info, status: 'failed' };
      }
    };

    const results = await utils.processBatch(allPdfs, processPdf, config.BATCH_SIZE, log);

    log('\n===== PDF Verification Summary =====');
    log(`Total PDFs: ${stats.totalPdfs}`);
    log(`Reachable: ${stats.reachable}`);
    log(`Unreachable: ${stats.unreachable}`);
    log(`Relevant: ${stats.relevant}`);
    log(`Irrelevant: ${stats.irrelevant}`);
    log(`Failed: ${stats.failed}`);

    const resultsPath = path.join(config.LOGS_DIR, `pdf-check-results-${new Date().toISOString().replace(/[:.]/g,'-')}.json`);
    fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
    log(`Detailed results saved to ${resultsPath}`);
  } catch (error) {
    log(`Fatal error: ${error.message}`, 'ERROR');
    process.exit(1);
  }
}

async function verifyPdfRelevance(text, topicName, subName, log) {
  const prompt = `Determine if the following PDF excerpt relates to the specified mathematics topic.\n\nTopic: ${topicName}\nSubtopic: ${subName}\n\nExcerpt:\n"""\n${text}\n"""\n\nReturn JSON in the form {"isRelevant": true/false, "reasoning": "short reason"}.`;
  try {
    const response = await utils.callDeepSeekAPI(prompt, SYSTEM_PROMPT, config.MAX_RETRIES, log);
    let result;
    try {
      result = JSON.parse(response);
    } catch (_) {
      const match = response.match(/\{[\s\S]*\}/);
      result = match ? JSON.parse(match[0]) : { isRelevant: true, reasoning: 'Unable to parse' };
    }
    return {
      isRelevant: !!result.isRelevant,
      reasoning: result.reasoning || ''
    };
  } catch (error) {
    log(`Error verifying relevance: ${error.message}`, 'ERROR');
    return { isRelevant: true, reasoning: 'API error' };
  }
}

if (require.main === module) {
  main();
}

module.exports = { verifyPdfRelevance };
