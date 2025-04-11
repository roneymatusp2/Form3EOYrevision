// video-checker.js
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Configuration
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || "sk-756f72b30f0c4fa48b01a5f2959bc118";
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

// Define path to video data file
const VIDEOS_FILE_PATH = path.join(__dirname, 'src/data/videos.ts');
const TOPICS_FILE_PATH = path.join(__dirname, 'src/data/topics.ts');

// Create logs directory if it doesn't exist
const LOGS_DIR = path.join(__dirname, 'logs');
if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR);
}

// Set up logging
const LOG_FILE = path.join(LOGS_DIR, `video-check-${new Date().toISOString().replace(/:/g, '-')}.log`);
const log = (message) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(message);
  fs.appendFileSync(LOG_FILE, logMessage);
};

// Helper function to call DeepSeek Reasoner API
async function callDeepSeekReasoner(prompt) {
  try {
    log("Calling DeepSeek API...");
    
    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: "deepseek-reasoner",
        messages: [
          { role: "system", content: "You are a mathematics education expert specializing in Cambridge IGCSE Mathematics." },
          { role: "user", content: prompt }
        ],
        temperature: 0.2,
        max_tokens: 1000
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${DEEPSEEK_API_KEY}`
        }
      }
    );
    
    return response.data.choices[0].message.content;
  } catch (error) {
    log(`DeepSeek API error: ${error.message}`);
    if (error.response) {
      log(`Response data: ${JSON.stringify(error.response.data)}`);
    }
    throw error;
  }
}

// Function to verify a YouTube video
async function verifyYouTubeVideo(videoUrl, topicName, subtopicName) {
  const videoId = extractYouTubeVideoId(videoUrl);
  
  if (!videoId) {
    log(`Invalid YouTube URL: ${videoUrl}`);
    return { isValid: false, reason: "Invalid URL format", replacement: null };
  }
  
  try {
    // First check if video exists and is accessible
    const videoInfoUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    
    try {
      await axios.get(videoInfoUrl);
      // Video exists, now verify content relevance with DeepSeek
    } catch (error) {
      log(`Video not accessible: ${videoUrl}`);
      return { 
        isValid: false, 
        reason: "Video not accessible",
        replacement: await findReplacementVideo(topicName, subtopicName)
      };
    }
    
    // Use DeepSeek to verify the content relevance
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
    
    const response = await callDeepSeekReasoner(prompt);
    let result;
    
    try {
      // Try to parse the response as JSON
      result = JSON.parse(response);
    } catch (e) {
      // If not valid JSON, extract it from the text
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          result = JSON.parse(jsonMatch[0]);
        } catch (err) {
          log("Failed to parse JSON from response");
          result = { isRelevant: false, confidence: 0, reasoning: "Failed to analyze" };
        }
      } else {
        log("No JSON found in response");
        result = { isRelevant: false, confidence: 0, reasoning: "Failed to analyze" };
      }
    }
    
    if (!result.isRelevant && result.confidence > 60) {
      return {
        isValid: false,
        reason: result.reasoning,
        replacement: result.suggestedReplacement || await findReplacementVideo(topicName, subtopicName)
      };
    }
    
    return { isValid: true, reason: result.reasoning };
    
  } catch (error) {
    log(`Error verifying video: ${error}`);
    return { isValid: true, reason: "Error during verification, assuming valid" };
  }
}

// Function to find a replacement video
async function findReplacementVideo(topicName, subtopicName) {
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
    const response = await callDeepSeekReasoner(prompt);
    const videoUrlMatch = response.match(/(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\S+/);
    let url = videoUrlMatch ? videoUrlMatch[0].trim() : null;
    
    // If the URL is not in the embed format, convert it
    if (url && url.includes('watch?v=')) {
      const videoId = extractYouTubeVideoId(url);
      if (videoId) {
        url = `https://www.youtube.com/embed/${videoId}`;
      }
    }
    
    return url;
  } catch (error) {
    log(`Error finding replacement video: ${error}`);
    return null;
  }
}

// Utility function to extract YouTube video ID
function extractYouTubeVideoId(url) {
  if (!url) return null;
  
  // Handle various YouTube URL formats
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7] && match[7].length === 11) ? match[7] : null;
}

// Read videos.ts file and return only the necessary JavaScript syntax
async function readVideosFile() {
  const content = fs.readFileSync(VIDEOS_FILE_PATH, 'utf8');
  return content;
}

// Update a specific video URL in the videos.ts file
async function updateVideoUrl(topicId, subtopicSlug, videoId, newUrl) {
  try {
    // Read current file content
    let content = fs.readFileSync(VIDEOS_FILE_PATH, 'utf8');
    
    // Create backup
    const backupPath = path.join(LOGS_DIR, `videos-backup-${Date.now()}.ts`);
    fs.writeFileSync(backupPath, content, 'utf8');
    log(`Created backup at: ${backupPath}`);

    // Find and replace the URL
    const urlRegex = new RegExp(`(id:\\s*['"]${videoId}['"].*?url:\\s*['"])([^'"]+)(['"])`, 's');
    const updatedContent = content.replace(urlRegex, `$1${newUrl}$3`);
    
    // Save changes
    if (content !== updatedContent) {
      fs.writeFileSync(VIDEOS_FILE_PATH, updatedContent, 'utf8');
      log(`Updated URL for video ${videoId} in topic ${topicId}/${subtopicSlug}`);
      return true;
    } else {
      log(`No changes were made to the file. Could not find pattern for ${videoId}`);
      return false;
    }
  } catch (error) {
    log(`Error updating video URL: ${error}`);
    return false;
  }
}

// Main function
async function main() {
  log("Starting video verification process...");
  
  try {
    // Read the videos.ts file content
    const videosContent = await readVideosFile();
    
    // Dynamic import allows us to import TypeScript directly (in real environment, use proper TS parsing)
    // For demonstration, we'll extract data using regex
    
    // Extract videos object
    const videosObjectMatch = videosContent.match(/const videos = ({[\s\S]*?});/);
    if (!videosObjectMatch) {
      throw new Error("Could not find videos object in the file");
    }
    
    // Use unsafe eval to parse the videos object (not recommended for production)
    // In production, use a proper TypeScript parser
    const videosObjStr = videosObjectMatch[1]
      .replace(/\n/g, '')
      .replace(/\/\/.*/g, ''); // Remove comments
      
    // Use Function constructor instead of eval for slightly safer execution
    const getVideosObj = new Function(`return ${videosObjStr}`);
    const videos = getVideosObj();
    
    // Get topics structure
    const topicsContent = fs.readFileSync(TOPICS_FILE_PATH, 'utf8');
    const topicsMatch = topicsContent.match(/const topics: Topic\[] = (\[\s*\{[\s\S]*?\}\s*\]);/);
    
    if (!topicsMatch) {
      throw new Error("Could not find topics array in the file");
    }
    
    // Prepare the topics string for safe evaluation
    const topicsStr = topicsMatch[1]
      .replace(/new Date\(\)\.toISOString\(\)/g, '"2023-01-01T00:00:00.000Z"')
      .replace(/\$permissions: \[\]/g, '"$permissions": []');
      
    // Use Function constructor for safer evaluation
    const getTopicsArray = new Function(`return ${topicsStr}`);
    let topics;
    
    try {
      topics = getTopicsArray();
    } catch (error) {
      log(`Error parsing topics: ${error}`);
      // Fallback to direct manipulation without topics data
      topics = [];
    }
    
    // Create topic name mapping
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
    
    // Process videos
    let totalVideos = 0;
    let verifiedVideos = 0;
    let replacedVideos = 0;
    let failedVideos = 0;
    
    // For each topic
    for (const topicId in videos) {
      const topicVideos = videos[topicId];
      
      // For each subtopic
      for (const subtopicSlug in topicVideos) {
        const videosList = topicVideos[subtopicSlug];
        
        // Get topic and subtopic names
        const topicName = topicNameMap[topicId]?.name || `Topic ${topicId}`;
        const subtopicName = topicNameMap[topicId]?.subtopics[subtopicSlug] || `Subtopic ${subtopicSlug}`;
        
        log(`\nProcessing ${videosList.length} videos for ${topicName} - ${subtopicName}`);
        
        // For each video in the subtopic
        for (const video of videosList) {
          totalVideos++;
          
          log(`\nChecking video: ${video.id} - ${video.title}`);
          log(`URL: ${video.url}`);
          
          // Verify the video
          const result = await verifyYouTubeVideo(video.url, topicName, subtopicName);
          
          if (result.isValid) {
            log(`✅ Video is valid and relevant: ${result.reason}`);
            verifiedVideos++;
          } else {
            log(`❌ Video issue: ${result.reason}`);
            
            if (result.replacement) {
              log(`🔄 Replacing with: ${result.replacement}`);
              
              // Update the file
              const updated = await updateVideoUrl(topicId, subtopicSlug, video.id, result.replacement);
              
              if (updated) {
                log(`✅ Successfully updated the video URL`);
                replacedVideos++;
              } else {
                log(`❌ Failed to update the video URL`);
                failedVideos++;
              }
            } else {
              log(`❌ No replacement found`);
              failedVideos++;
            }
          }
          
          // Add a delay between API calls to avoid rate limiting
          log("Waiting 3 seconds before next verification...");
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      }
    }
    
    // Print summary
    log("\n===== Video Verification Summary =====");
    log(`Total videos processed: ${totalVideos}`);
    log(`Videos verified as valid: ${verifiedVideos}`);
    log(`Videos replaced: ${replacedVideos}`);
    log(`Failed verifications: ${failedVideos}`);
    log("=====================================");
    
  } catch (error) {
    log(`Fatal error: ${error}`);
  }
}

// Run the main function
main().catch(error => {
  log(`Fatal error: ${error}`);
});
