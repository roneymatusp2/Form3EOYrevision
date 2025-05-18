import { Client, Databases, Storage, ID } from 'appwrite';

// Static configuration values
const REQUIRED_ENV_VARS = {
    ENDPOINT: 'https://cloud.appwrite.io/v1',
    PROJECT_ID: '67eff58c0026f452ff3d'
} as const;

// Type definitions
export type DatabaseId = typeof DATABASE_IDS[keyof typeof DATABASE_IDS];
export type BucketId = typeof BUCKET_IDS[keyof typeof BUCKET_IDS];
export type CollectionId = typeof COLLECTION_IDS[keyof typeof COLLECTION_IDS];

// Database IDs with descriptions
export const DATABASE_IDS = {
    MATH_REVISION: '67f158d4000cb981963', // Main database for math content
    ALGEBRATICA: 'algebraticamentede-db'   // Legacy database
} as const;

// Bucket IDs with descriptions
export const BUCKET_IDS = {
    MATH_PDFS: '67f03c12001381e227aa',    // Storage for PDF files
    MATH_VIDEOS: '67f03c7600242f02fd1a',   // Storage for video content
    MATH_EXTERNAL: '67f03d6f0021c674bd8d'  // Storage for external resources
} as const;

// Collection IDs with descriptions
export const COLLECTION_IDS = {
    TOPICS: '67f158f50030e9e503ea',        // Main topics collection
    SUBTOPICS: '67f159150030e9e503eb',     // Subtopics collection
    RESOURCES: '67f159550030e9e503e9',      // Resources collection
    PDFS: '67f159550030e9e503e9'           // Alias for resources collection
} as const;

// Configuration interface
interface AppwriteConfig {
    readonly endpoint: string;
    readonly projectId: string;
    readonly databaseId: DatabaseId;
    readonly bucketId: BucketId;
    readonly topicsCollectionId: CollectionId;
    readonly subtopicsCollectionId: CollectionId;
    readonly resourcesCollectionId: CollectionId;
}

// Main configuration object
const config: AppwriteConfig = {
    endpoint: REQUIRED_ENV_VARS.ENDPOINT,
    projectId: REQUIRED_ENV_VARS.PROJECT_ID,
    databaseId: DATABASE_IDS.MATH_REVISION,
    bucketId: BUCKET_IDS.MATH_PDFS,
    topicsCollectionId: COLLECTION_IDS.TOPICS,
    subtopicsCollectionId: COLLECTION_IDS.SUBTOPICS,
    resourcesCollectionId: COLLECTION_IDS.RESOURCES
} as const;

// Initialize Appwrite client
const client = new Client()
    .setEndpoint(config.endpoint)
    .setProject(config.projectId);

// Export initialized services
export const databases = new Databases(client);
export const storage = new Storage(client);

// Helper functions
export const getFilePreviewUrl = (fileId: string): string => {
    return storage.getFilePreview(config.bucketId, fileId).toString();
};

export const getFileViewUrl = (fileId: string): string => {
    return storage.getFileView(config.bucketId, fileId).toString();
};

export const generateUniqueId = (): string => {
    return ID.unique();
};

export default config; 