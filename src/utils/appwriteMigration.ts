import { AppwriteService } from '../services/appwriteService';
import topicsData from '../data/topics';

interface MigrationTopic {
    $id?: string;
    name: string;
    slug: string;
    subtopics: MigrationSubtopic[];
}

interface MigrationSubtopic {
    $id?: string;
    name: string;
    slug: string;
    resources: MigrationResource[];
}

interface MigrationResource {
    title: string;
    fileId: string;
    resourceType: 'question' | 'answer' | 'reference' | 'video';
}

export interface MigrationResult {
    success: boolean;
    message: string;
    stats: {
        topics: number;
        subtopics: number;
        resources: number;
        failed: number;
    };
}

export async function migrateTopics(): Promise<MigrationResult> {
    const stats = {
        topics: 0,
        subtopics: 0,
        resources: 0,
        failed: 0
    };

    try {
        // Migrate topics and their subtopics
        for (const topic of topicsData as unknown as MigrationTopic[]) {
            try {
                // Create topic and capture its ID for the subtopics
                const topicDoc = await AppwriteService.createTopic({
                    name: topic.name,
                    slug: topic.slug
                });
                stats.topics++;

                // Create subtopics for this topic
                if (topic.subtopics) {
                    for (const subtopic of topic.subtopics) {
                        try {
                            await AppwriteService.createSubtopic({
                                name: subtopic.name,
                                slug: subtopic.slug,
                                topicId: topicDoc.$id
                            });
                            stats.subtopics++;
                        } catch (error) {
                            console.error(`Failed to create subtopic ${subtopic.name}:`, error);
                            stats.failed++;
                        }
                    }
                }
            } catch (error) {
                console.error(`Failed to create topic ${topic.name}:`, error);
                stats.failed++;
            }
        }

        return {
            success: true,
            message: 'Migration completed successfully',
            stats
        };
    } catch (error) {
        console.error('Migration failed:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Migration failed',
            stats
        };
    }
}

export const migrateContent = async (): Promise<MigrationResult> => {
    const migratedCount = {
        topics: 0,
        subtopics: 0,
        resources: 0
    };

    try {
        // Use the topics imported from the data directory
        const topicsToMigrate: MigrationTopic[] = topicsData as unknown as MigrationTopic[];

        for (const topic of topicsToMigrate) {
            try {
                const topicDoc = await AppwriteService.createTopic({
                    name: topic.name,
                    slug: topic.slug
                });

                migratedCount.topics++;

                for (const subtopic of topic.subtopics) {
                    try {
                        const subtopicDoc = await AppwriteService.createSubtopic({
                            name: subtopic.name,
                            slug: subtopic.slug,
                            topicId: topicDoc.$id
                        });

                        migratedCount.subtopics++;

                        for (const resource of subtopic.resources) {
                            try {
                                await AppwriteService.createResource({
                                    title: resource.title,
                                    fileId: resource.fileId,
                                    subtopicId: subtopicDoc.$id,
                                    resourceType: resource.resourceType
                                });

                                migratedCount.resources++;
                            } catch (error) {
                                console.error(`Failed to migrate resource ${resource.title}:`, error);
                            }
                        }
                    } catch (error) {
                        console.error(`Failed to migrate subtopic ${subtopic.name}:`, error);
                    }
                }
            } catch (error) {
                console.error(`Failed to migrate topic ${topic.name}:`, error);
            }
        }

        return {
            success: true,
            message: `Migration completed successfully. Migrated ${migratedCount.topics} topics, ${migratedCount.subtopics} subtopics, and ${migratedCount.resources} resources.`,
            stats: {
                topics: migratedCount.topics,
                subtopics: migratedCount.subtopics,
                resources: migratedCount.resources,
                failed: 0
            }
        };
    } catch (error) {
        return {
            success: false,
            message: `Migration failed: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
            stats: {
                topics: 0,
                subtopics: 0,
                resources: 0,
                failed: 1
            }
        };
    }
}; 