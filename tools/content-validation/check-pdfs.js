const fs = require('fs');
const axios = require('axios');
const config = require('./config');
const utils = require('./utils');

// System prompt for Mistral API
const SYSTEM_PROMPT = `You are a mathematics education expert specializing in Cambridge IGCSE Mathematics.
Verify that provided PDF resources are accessible and relevant to the specified topic.`;

async function verifyPdfResource(pdf, topicName, subtopicName, log) {
  try {
    await axios.head(pdf.url);
  } catch (err) {
    return { isValid: false, reason: 'URL not accessible' };
  }

  const prompt = `Evaluate if this PDF is relevant to the topic.\nTopic: ${topicName}\nSubtopic: ${subtopicName}\nURL: ${pdf.url}\nRespond in JSON: {"isRelevant": true/false, "reasoning": "text"}`;
  try {
    const response = await utils.callMistralAPI(prompt, SYSTEM_PROMPT, config.MAX_RETRIES, log);
    const match = response.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }
  } catch (err) {
    log(`AI error for ${pdf.url}: ${err.message}`, 'ERROR');
  }
  return { isValid: true, reasoning: 'Could not verify, assumed valid' };
}

async function main() {
  utils.ensureDirectoriesExist();
  const { log } = utils.initLogging('pdf-checker');

  log('Reading PDF and topic data...');
  const pdfContent = fs.readFileSync(config.PDFS_FILE, 'utf8');
  const topicsContent = fs.readFileSync(config.TOPICS_FILE, 'utf8');

  const pdfs = utils.parseTypeScriptFile(pdfContent, 'pdfs');
  const topics = utils.parseTypeScriptFile(topicsContent, 'topics');

  const topicNameMap = {};
  topics.forEach(t => {
    topicNameMap[t.$id] = { name: t.name, subtopics: {} };
    if (t.subtopics) {
      t.subtopics.forEach(st => {
        topicNameMap[t.$id].subtopics[st.slug] = st.name;
      });
    }
  });

  for (const topicId in pdfs) {
    const subtopics = pdfs[topicId];
    for (const slug in subtopics) {
      const list = subtopics[slug];
      const tName = topicNameMap[topicId]?.name || topicId;
      const sName = topicNameMap[topicId]?.subtopics[slug] || slug;
      log(`Checking ${list.length} PDFs for ${tName} - ${sName}`);
      for (const pdf of list) {
        const result = await verifyPdfResource(pdf, tName, sName, log);
        if (!result.isRelevant) {
          log(`Off-topic PDF: ${pdf.url} -> ${result.reasoning}`, 'WARN');
        }
        await new Promise(r => setTimeout(r, config.API_DELAY_MS));
      }
    }
  }
}

if (require.main === module) {
  main().catch(err => {
    console.error(err);
    process.exit(1);
  });
}
