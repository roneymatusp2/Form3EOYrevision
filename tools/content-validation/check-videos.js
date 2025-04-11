// Video content verification and replacement tool
const fs = require('fs');
const path = require('path');
const config = require('./config');
const utils = require('./utils');

// System prompt for DeepSeek API
const SYSTEM_PROMPT = `You are a mathematics education expert specializing in Cambridge IGCSE Mathematics. 
Your task is to analyze and verify educational videos, ensuring they are appropriate, accurate, and relevant 
for students studying specific mathematical topics.`;

// Main function
async function main() {
  // Initialize utilities
  utils.ensureDirectoriesExist();
  const { log } = utils.initLogging('video-checker');
  
  try {
    log('Reading videos and topics data...');
    
    // Read files
    const videosContent = fs.readFileSync(config.VIDEOS_FILE, 'utf8');
    const topicsContent = fs.readFileSync(config.TOPICS_FILE, 'utf8');
    
    // Create backups
    utils.createBackup(config.VIDEOS_FILE, log);
    
    // Parse videos and topics
    log('Parsing videos data...');
    const videos = utils.parseTypeScriptFile(videosContent, 'videos');
    
    log('Parsing topics data...');
    const topics = utils.parseTypeScriptFile(topicsContent, 'topics');
    
    // Create a map of topic/subtopic names for context
    const topicNameMap = {};
    topics.forEach(topic => {
      topicNameMap[topic.$id] = {
        name: topic.name,
        subtopics: {}
      };
      
      if (topic.subtopics) {
        topic.subtopics.forEach(subtopic => {
          topicNameMap[topic.$id].subtopics[subtopic.slug] = subtopic.name;
        });
      }
    });
    
    // Initialize statistics
    const stats = {
      totalVideos: 0,
      verifiedVideos: 0,
      inaccessibleVideos: 0,
      irrelevantVideos: 0,
      replacedVideos: 0,
      failedVideos: 0
    };
    
    // Create a flat list of all videos with their context
    const allVideos = [];
    
    for (const topicId in videos) {
      for (const subtopicSlug in videos[topicId]) {
        const videoList = videos[topicId][subtopicSlug];
        
        // Get topic and subtopic names
        const topicName = topicNameMap[topicId]?.name || `Topic ${topicId}`;
        const subtopicName = topicNameMap[topicId]?.subtopics[subtopicSlug] || `Subtopic ${subtopicSlug}`;
        
        videoList.forEach(video => {
          allVideos.push({
            topicId,
            subtopicSlug,
            topicName,
            subtopicName,
            videoId: video.id,
            videoTitle: video.title,
            videoUrl: video.url
          });
        });
      }
    }
    
    stats.totalVideos = allVideos.length;
    log(`Found ${stats.totalVideos} videos across ${Object.keys(videos).length} topics`);
    
    // Process videos in batches
    const processVideo = async (videoInfo) => {
      const { topicId, subtopicSlug, topicName, subtopicName, videoId, videoTitle, videoUrl } = videoInfo;
      
      log(`\nVerifying video: ${videoTitle} (ID: ${videoId})`);
      log(`Topic: ${topicName}, Subtopic: ${subtopicName}`);
      log(`URL: ${videoUrl}`);
      
      // Check if video URL is valid
      const ytVideoId = utils.extractYouTubeVideoId(videoUrl);
      if (!ytVideoId) {
        log(`❌ Invalid YouTube URL: ${videoUrl}`, 'ERROR');
        stats.failedVideos++;
        return { ...videoInfo, status: 'failed', reason: 'Invalid URL format', replacement: null };
      }
      
      // Check if video is accessible
      const isAccessible = await utils.isYouTubeVideoAccessible(ytVideoId);
      if (!isAccessible) {
        log(`❌ Video not accessible: ${videoUrl}`, 'ERROR');
        stats.inaccessibleVideos++;
        
        // Find replacement for inaccessible video
        const replacement = await findReplacementVideo(topicName, subtopicName, log);
        
        if (replacement) {
          log(`🔄 Found replacement for inaccessible video: ${replacement}`);
          const updated = await updateVideoUrl(topicId, subtopicSlug, videoId, replacement, log);
          
          if (updated) {
            stats.replacedVideos++;
            return { ...videoInfo, status: 'replaced', reason: 'Video not accessible', replacement };
          } else {
            stats.failedVideos++;
            return { ...videoInfo, status: 'failed', reason: 'Video not accessible, failed to update', replacement };
          }
        } else {
          stats.failedVideos++;
          return { ...videoInfo, status: 'failed', reason: 'Video not accessible, no replacement found', replacement: null };
        }
      }
      
      // Verify video relevance
      const relevanceResult = await verifyVideoRelevance(videoUrl, topicName, subtopicName, log);
      
      if (relevanceResult.isRelevant) {
        log(`✅ Video is valid and relevant: ${relevanceResult.reasoning}`);
        stats.verifiedVideos++;
        return { ...videoInfo, status: 'verified', reason: relevanceResult.reasoning, replacement: null };
      } else {
        log(`❌ Video not relevant: ${relevanceResult.reasoning}`, 'ERROR');
        stats.irrelevantVideos++;
        
        // Use suggested replacement or find a new one
        const replacement = relevanceResult.suggestedReplacement || 
                           await findReplacementVideo(topicName, subtopicName, log);
        
        if (replacement) {
          log(`🔄 Found replacement for irrelevant video: ${replacement}`);
          const updated = await updateVideoUrl(topicId, subtopicSlug, videoId, replacement, log);
          
          if (updated) {
            stats.replacedVideos++;
            return { ...videoInfo, status: 'replaced', reason: 'Video not relevant', replacement };
          } else {
            stats.failedVideos++;
            return { ...videoInfo, status: 'failed', reason: 'Video not relevant, failed to update', replacement };
          }
        } else {
          stats.failedVideos++;
          return { ...videoInfo, status: 'failed', reason: 'Video not relevant, no replacement found', replacement: null };
        }
      }
    };
    
    // Process in batches to avoid memory issues and rate limits
    log(`Processing ${allVideos.length} videos in batches of ${config.BATCH_SIZE}...`);
    const results = await utils.processBatch(allVideos, processVideo, config.BATCH_SIZE, log);
    
    // Generate summary
    log("\n===== Video Verification Summary =====");
    log(`Total videos processed: ${stats.totalVideos}`);
    log(`Videos verified as valid: ${stats.verifiedVideos}`);
    log(`Inaccessible videos found: ${stats.inaccessibleVideos}`);
    log(`Irrelevant videos found: ${stats.irrelevantVideos}`);
    log(`Videos successfully replaced: ${stats.replacedVideos}`);
    log(`Failed verifications: ${stats.failedVideos}`);
    log("=====================================");
    
    // Save detailed results to a JSON file
    const resultsPath = path.join(config.LOGS_DIR, `video-check-results-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
    fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
    log(`Detailed results saved to: ${resultsPath}`);
    
    log("Video verification process completed!");
    
  } catch (error) {
    log(`Fatal error: ${error.message}`, 'ERROR');
    if (error.stack) {
      log(error.stack, 'ERROR');
    }
    process.exit(1);
  }
}

// Verify if a video is relevant to the topic
async function verifyVideoRelevance(videoUrl, topicName, subtopicName, log) {
  const prompt = `
  I need to verify if a YouTube video is relevant to a specific mathematics topic.

  Topic: ${topicName}
  Subtopic: ${subtopicName}
  Video URL: ${videoUrl}

  Please:
  1. Analyze the title, description, and other available metadata of this video
  2. Determine if the video is specifically about this mathematics topic/subtopic
  3. Return a structured response in this JSON format:
  {
    "isRelevant": true/false,
    "confidence": 0-100,
    "reasoning": "brief explanation",
    "suggestedReplacement": "YouTube URL" (only if not relevant)
  }

  If the video is not accessible or not relevant to the topic, please suggest a better YouTube video that specifically addresses this mathematics topic/subtopic.
  `;
  
  try {
    const response = await utils.callDeepSeekAPI(prompt, SYSTEM_PROMPT, config.MAX_RETRIES, log);
    let result;
    
    try {
      // Try to parse as JSON
      result = JSON.parse(response);
    } catch (e) {
      // Extract JSON from text if needed
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          result = JSON.parse(jsonMatch[0]);
        } catch (err) {
          log("Failed to parse JSON from response", 'ERROR');
          return { 
            isRelevant: true, // Assume relevant if can't parse
            confidence: 0,
            reasoning: "Failed to analyze video"
          };
        }
      } else {
        log("No JSON found in response", 'ERROR');
        return { 
          isRelevant: true, // Assume relevant if can't parse
          confidence: 0,
          reasoning: "Failed to analyze video"
        };
      }
    }
    
    // Return result with standardized structure
    return {
      isRelevant: result.isRelevant && result.confidence >= config.RELEVANCE_THRESHOLD,
      confidence: result.confidence || 0,
      reasoning: result.reasoning || "No reasoning provided",
      suggestedReplacement: result.suggestedReplacement || null
    };
  } catch (error) {
    log(`Error verifying video relevance: ${error.message}`, 'ERROR');
    return { 
      isRelevant: true, // Assume relevant if error occurs
      confidence: 0,
      reasoning: "Error during verification"
    };
  }
}

// Find a replacement video
async function findReplacementVideo(topicName, subtopicName, log) {
  const prompt = `
  I need a YouTube video recommendation for teaching the following mathematics topic:
  
  Topic: ${topicName}
  Subtopic: ${subtopicName}
  
  Please:
  1. Find a high-quality educational YouTube video that explains this topic clearly
  2. The video should be from a reputable mathematics education channel
  3. It should be suitable for Cambridge IGCSE Mathematics students
  4. Return only the full YouTube URL in this format: https://www.youtube.com/embed/VIDEO_ID
  
  Provide ONLY the URL, nothing else.
  `;
  
  try {
    const response = await utils.callDeepSeekAPI(prompt, SYSTEM_PROMPT, config.MAX_RETRIES, log);
    const videoUrlMatch = response.match(/(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\S+/);
    let url = videoUrlMatch ? videoUrlMatch[0].trim() : null;
    
    // If the URL is not in the embed format, convert it
    if (url && url.includes('watch?v=')) {
      const videoId = utils.extractYouTubeVideoId(url);
      if (videoId) {
        url = `https://www.youtube.com/embed/${videoId}`;
      }
    }
    
    return url;
  } catch (error) {
    log(`Error finding replacement video: ${error.message}`, 'ERROR');
    return null;
  }
}

// Update a video URL in the videos.ts file
async function updateVideoUrl(topicId, subtopicSlug, videoId, newUrl, log) {
  try {
    // Read current file content
    let content = fs.readFileSync(config.VIDEOS_FILE, 'utf8');
    
    // Find and replace the URL
    const urlRegex = new RegExp(`(id:\\s*['"]${videoId}['"].*?url:\\s*['"])([^'"]+)(['"])`, 's');
    const updatedContent = content.replace(urlRegex, `$1${newUrl}$3`);
    
    // Save changes
    if (content !== updatedContent) {
      fs.writeFileSync(config.VIDEOS_FILE, updatedContent, 'utf8');
      log(`Updated URL for video ${videoId} in topic ${topicId}/${subtopicSlug}`);
      return true;
    } else {
      log(`No changes were made to the file. Could not find pattern for ${videoId}`, 'ERROR');
      return false;
    }
  } catch (error) {
    log(`Error updating video URL: ${error.message}`, 'ERROR');
    return false;
  }
}

// Run the main function
if (require.main === module) {
  main().catch(error => {
    console.error(`Fatal error: ${error.message}`);
    process.exit(1);
  });
}

// Export functions for testing or importing in other modules
module.exports = {
  verifyVideoRelevance,
  findReplacementVideo,
  updateVideoUrl
};
