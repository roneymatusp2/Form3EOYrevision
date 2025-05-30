import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import topics, { Subtopic, Topic } from '../data/topics';
import videos from '../data/videos';
import pdfs from '../data/pdfs';
import { motion } from 'framer-motion';
import { 
  curriculumResources, 
  officialResources, 
  ExternalResource as ExternalResourceType 
} from '../data/externalResources-new';

// Define proper typing for videos data structure
interface VideoResource {
  id: string;
  title: string;
  url: string;
}

// Define proper typing for PDF resources
interface PdfResource {
  id: string;
  title: string;
  url: string;
  type: 'questions' | 'answers' | 'reference' | 'papers';
}

// Define type for the videos data structure
type VideoResourceMap = {
  [topicId: string]: {
    [subtopicSlug: string]: VideoResource[];
  };
};

// Define type for the PDFs data structure
type PdfResourceMap = {
  [topicId: string]: {
    [subtopicSlug: string]: PdfResource[];
  };
};

// Type assertion for our existing data
const typedVideos = videos as VideoResourceMap;
const typedPdfs = pdfs as PdfResourceMap;

// Define color scheme interface for better type safety
interface ColorScheme {
  primary: string;
  light: string;
  hover: string;
  text: string;
  border: string;
  activeTab: string;
  inactiveTab: string;
}

const SubtopicPage: React.FC = () => {
  const { subtopicId } = useParams<{ subtopicId: string }>();
  const [activeTab, setActiveTab] = useState<'videos' | 'exercises' | 'answers' | 'external'>('videos');
  const [subtopic, setSubtopic] = useState<Subtopic | null>(null);
  const [parentTopic, setParentTopic] = useState<Topic | null>(null);
  const [subtopicVideos, setSubtopicVideos] = useState<VideoResource[]>([]);
  const [exercisePdfs, setExercisePdfs] = useState<PdfResource[]>([]);
  const [answerPdfs, setAnswerPdfs] = useState<PdfResource[]>([]);
  const [externalResources, setExternalResources] = useState<ExternalResourceType[]>([]);
  
  useEffect(() => {
    if (!subtopicId) return;

    // Find the subtopic and its parent topic
    let foundSubtopic: Subtopic | null = null;
    let foundTopic: Topic | null = null;

    for (const topic of topics) {
      const matchedSubtopic = topic.subtopics?.find(sub => sub.$id === subtopicId) || null;
      if (matchedSubtopic) {
        foundSubtopic = matchedSubtopic;
        foundTopic = topic;
        break;
      }
    }

    if (foundSubtopic && foundTopic) {
      setSubtopic(foundSubtopic);
      setParentTopic(foundTopic);

      // Load videos for this subtopic
      if (typedVideos[foundTopic.$id] && typedVideos[foundTopic.$id][foundSubtopic.slug]) {
        setSubtopicVideos(typedVideos[foundTopic.$id][foundSubtopic.slug]);
      } else {
        setSubtopicVideos([]);
      }

      // Load PDFs for this subtopic
      if (typedPdfs[foundTopic.$id] && typedPdfs[foundTopic.$id][foundSubtopic.slug]) {
        const allPdfs = typedPdfs[foundTopic.$id][foundSubtopic.slug];
        setExercisePdfs(allPdfs.filter(pdf => pdf.type === 'questions' || pdf.type === 'reference'));
        setAnswerPdfs(allPdfs.filter(pdf => pdf.type === 'answers'));
      } else {
        setExercisePdfs([]);
        setAnswerPdfs([]);
      }
      
      // Load external resources for this subtopic
      const topicResources = curriculumResources[foundTopic.$id];
      if (topicResources && topicResources[foundSubtopic.slug]) {
        setExternalResources(topicResources[foundSubtopic.slug]);
      } else {
        setExternalResources([]);
      }
    }
  }, [subtopicId]);

  // Get color scheme based on parent topic ID
  const getColorScheme = (): ColorScheme => {
    if (!parentTopic) {
      return {
        primary: 'bg-gray-500',
        light: 'bg-gray-100',
        hover: 'hover:bg-gray-600',
        text: 'text-gray-700',
        border: 'border-gray-500',
        activeTab: 'bg-gray-500 text-white',
        inactiveTab: 'text-gray-700 hover:bg-gray-100'
      };
    }

    switch(parentTopic.$id) {
      case 'unit-1': return {
        primary: 'bg-blue-500',
        light: 'bg-blue-100',
        hover: 'hover:bg-blue-600',
        text: 'text-blue-700',
        border: 'border-blue-500',
        activeTab: 'bg-blue-500 text-white',
        inactiveTab: 'text-blue-700 hover:bg-blue-100'
      };
      case 'unit-2': return {
        primary: 'bg-green-500',
        light: 'bg-green-100',
        hover: 'hover:bg-green-600',
        text: 'text-green-700',
        border: 'border-green-500',
        activeTab: 'bg-green-500 text-white',
        inactiveTab: 'text-green-700 hover:bg-green-100'
      };
      case 'unit-3': return {
        primary: 'bg-green-500',
        light: 'bg-green-100',
        hover: 'hover:bg-green-600',
        text: 'text-green-700',
        border: 'border-green-500',
        activeTab: 'bg-green-500 text-white',
        inactiveTab: 'text-green-700 hover:bg-green-100'
      };
      case 'unit-4': return {
        primary: 'bg-blue-500',
        light: 'bg-blue-100',
        hover: 'hover:bg-blue-600',
        text: 'text-blue-700',
        border: 'border-blue-500',
        activeTab: 'bg-blue-500 text-white',
        inactiveTab: 'text-blue-700 hover:bg-blue-100'
      };
      case 'unit-5': return {
        primary: 'bg-orange-500',
        light: 'bg-orange-100',
        hover: 'hover:bg-orange-600',
        text: 'text-orange-700',
        border: 'border-orange-500',
        activeTab: 'bg-orange-500 text-white',
        inactiveTab: 'text-orange-700 hover:bg-orange-100'
      };
      case 'unit-8': return {
        primary: 'bg-purple-500',
        light: 'bg-purple-100',
        hover: 'hover:bg-purple-600',
        text: 'text-purple-700',
        border: 'border-purple-500',
        activeTab: 'bg-purple-500 text-white',
        inactiveTab: 'text-purple-700 hover:bg-purple-100'
      };
      default: return {
        primary: 'bg-gray-500',
        light: 'bg-gray-100',
        hover: 'hover:bg-gray-600',
        text: 'text-gray-700',
        border: 'border-gray-500',
        activeTab: 'bg-gray-500 text-white',
        inactiveTab: 'text-gray-700 hover:bg-gray-100'
      };
    }
  };

  const colors = getColorScheme();

  if (!subtopic || !parentTopic) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-red-600">Subtopic not found</h1>
        <p className="mt-4">
          The subtopic you're looking for doesn't exist. Please return to the{' '}
          <Link to="/" className="text-blue-600 hover:underline">
            homepage
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link to={`/topic/${parentTopic.$id}`} className="text-blue-600 hover:underline inline-flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to {parentTopic.name}
        </Link>
      </div>

      {/* Header with unit color */}
      <div className={`${colors.primary} rounded-t-lg p-6 text-white mb-6`}>
        <h1 className="text-3xl font-bold">{subtopic.name}</h1>
        <p className="mt-2 text-white text-opacity-90">
          From {parentTopic.name}
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap border-b mb-6">
        <button 
          onClick={() => setActiveTab('videos')}
          className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${activeTab === 'videos' ? colors.activeTab : colors.inactiveTab}`}
        >
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Videos
          </div>
        </button>
        <button 
          onClick={() => setActiveTab('exercises')}
          className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${activeTab === 'exercises' ? colors.activeTab : colors.inactiveTab}`}
        >
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exercises & References
          </div>
        </button>
        <button 
          onClick={() => setActiveTab('answers')}
          className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${activeTab === 'answers' ? colors.activeTab : colors.inactiveTab}`}
        >
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Answers
          </div>
        </button>
        <button 
          onClick={() => setActiveTab('external')}
          className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${activeTab === 'external' ? colors.activeTab : colors.inactiveTab}`}
        >
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            External Resources
          </div>
        </button>
      </div>

      {/* Content based on active tab */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'videos' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Video Tutorials</h2>
            {subtopicVideos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {subtopicVideos.map((video, index) => (
                  <div key={video.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="aspect-w-16 aspect-h-9">
                      <iframe
                        src={video.url}
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-64"
                      ></iframe>
                    </div>
                    <div className={`p-4 border-t ${colors.border} border-opacity-30`}>
                      <h3 className={`text-lg font-semibold ${colors.text}`}>{video.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      No video tutorials available for this subtopic yet. Check back soon as we continue to add more resources.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'exercises' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Exercises & References</h2>
            {exercisePdfs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {exercisePdfs.map((pdf, index) => (
                  <a 
                    key={pdf.id} 
                    href={pdf.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`flex items-start p-4 rounded-lg border ${colors.border} transition-all hover:shadow-md hover:bg-gray-50`}
                  >
                    <div className={`p-3 rounded-lg ${colors.light} mr-4`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${colors.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className={`text-lg font-semibold ${colors.text}`}>{pdf.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {pdf.type === 'questions' ? 'Practice exercises' : 'Reference material'}
                      </p>
                      <div className={`mt-2 inline-flex items-center text-xs px-2 py-1 rounded-full ${colors.light} ${colors.text}`}>
                        PDF Document
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      No exercise worksheets or reference materials available for this subtopic yet. Please check other subtopics or come back later.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'answers' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Answers & Solutions</h2>
            {answerPdfs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {answerPdfs.map((pdf, index) => (
                  <a 
                    key={pdf.id} 
                    href={pdf.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`flex items-start p-4 rounded-lg border ${colors.border} transition-all hover:shadow-md hover:bg-gray-50`}
                  >
                    <div className={`p-3 rounded-lg ${colors.light} mr-4`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${colors.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className={`text-lg font-semibold ${colors.text}`}>{pdf.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">Answer key & solutions</p>
                      <div className={`mt-2 inline-flex items-center text-xs px-2 py-1 rounded-full ${colors.light} ${colors.text}`}>
                        PDF Document
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      No answer sheets available for this subtopic yet. Try checking the exercise materials first, or visit other subtopics.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'external' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">External Resources</h2>
            {externalResources.length > 0 ? (
              <div className="space-y-4">
                {externalResources.map((resource, index) => (
                  <a 
                    key={index} 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`flex items-start p-4 rounded-lg border ${colors.border} transition-all hover:shadow-md hover:bg-gray-50 block`}
                  >
                    <div className={`p-3 rounded-lg ${colors.light} mr-4`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${colors.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    <div>
                      <h3 className={`text-lg font-semibold ${colors.text}`}>{resource.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">Source: {resource.source}</p>
                      <div className={`mt-2 inline-flex items-center text-xs px-2 py-1 rounded-full ${colors.light} ${colors.text}`}>
                        External Link
                      </div>
                    </div>
                  </a>
                ))}
                
                {/* Display Cambridge official resources for every subtopic */}
                <h3 className="text-xl font-semibold mt-8 mb-4">Cambridge Official Resources</h3>
                <div className="space-y-4">
                  {officialResources.map((resource, index) => (
                    <a 
                      key={`official-${index}`} 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`flex items-start p-4 rounded-lg border ${colors.border} transition-all hover:shadow-md hover:bg-gray-50 block`}
                    >
                      <div className={`p-3 rounded-lg ${colors.light} mr-4`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${colors.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className={`text-lg font-semibold ${colors.text}`}>{resource.title}</h3>
                        <p className="text-gray-600 text-sm mt-1">Source: {resource.source}</p>
                        <div className={`mt-2 inline-flex items-center text-xs px-2 py-1 rounded-full ${colors.light} ${colors.text}`}>
                          Official Cambridge Resource
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        No specific external resources available for this subtopic yet. Please check the Cambridge official resources below.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Display Cambridge official resources for every subtopic */}
                <h3 className="text-xl font-semibold mt-8 mb-4">Cambridge Official Resources</h3>
                <div className="space-y-4">
                  {officialResources.map((resource, index) => (
                    <a 
                      key={`official-${index}`} 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`flex items-start p-4 rounded-lg border ${colors.border} transition-all hover:shadow-md hover:bg-gray-50 block`}
                    >
                      <div className={`p-3 rounded-lg ${colors.light} mr-4`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${colors.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className={`text-lg font-semibold ${colors.text}`}>{resource.title}</h3>
                        <p className="text-gray-600 text-sm mt-1">Source: {resource.source}</p>
                        <div className={`mt-2 inline-flex items-center text-xs px-2 py-1 rounded-full ${colors.light} ${colors.text}`}>
                          Official Cambridge Resource
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default SubtopicPage;