import { Models } from 'appwrite';

export interface Topic extends Models.Document {
    name: string;
    slug: string;
    subtopics?: Subtopic[];
}

export interface Subtopic extends Models.Document {
    $collectionId: string;
    $databaseId: string;
    $createdAt: string;
    $updatedAt: string;
    $permissions: string[];
    name: string;
    slug: string;
    topicId: string;
}

const topics: Topic[] = [
    {
        $id: 'unit-1',
        name: 'Unit 1: Number Systems',
        slug: 'number-systems',
        $collectionId: 'topics',
        $databaseId: 'database',
        $createdAt: new Date().toISOString(),
        $updatedAt: new Date().toISOString(),
        $permissions: [],
        subtopics: [
            {
                $id: 'ns-1',
                name: 'Natural Numbers & Types',
                slug: 'natural-numbers',
                topicId: 'unit-1',
                $collectionId: 'subtopics',
                $databaseId: 'database',
                $createdAt: new Date().toISOString(),
                $updatedAt: new Date().toISOString(),
                $permissions: []
            },
            {
                $id: 'ns-2',
                name: 'Standard Form',
                slug: 'standard-form',
                topicId: 'unit-1',
                $collectionId: 'subtopics',
                $databaseId: 'database',
                $createdAt: new Date().toISOString(),
                $updatedAt: new Date().toISOString(),
                $permissions: []
            },
            {
                $id: 'ns-3',
                name: 'Common Factors & Multiples',
                slug: 'common-factors',
                topicId: 'unit-1',
                $collectionId: 'subtopics',
                $databaseId: 'database',
                $createdAt: new Date().toISOString(),
                $updatedAt: new Date().toISOString(),
                $permissions: []
            },
            {
                $id: 'ns-4',
                name: 'Operations & Brackets',
                slug: 'four-operations',
                topicId: 'unit-1',
                $collectionId: 'subtopics',
                $databaseId: 'database',
                $createdAt: new Date().toISOString(),
                $updatedAt: new Date().toISOString(),
                $permissions: []
            },
            {
                $id: 'ns-5',
                name: 'Surds',
                slug: 'surds',
                topicId: 'unit-1',
                $collectionId: 'subtopics',
                $databaseId: 'database',
                $createdAt: new Date().toISOString(),
                $updatedAt: new Date().toISOString(),
                $permissions: []
            },
            {
                $id: 'ns-6',
                name: 'Decimals, Fractions & Percentages',
                slug: 'decimals-fractions',
                topicId: 'unit-1',
                $collectionId: 'subtopics',
                $databaseId: 'database',
                $createdAt: new Date().toISOString(),
                $updatedAt: new Date().toISOString(),
                $permissions: []
            },
            {
                $id: 'ns-7',
                name: 'Set Theory and Venn Diagrams',
                slug: 'set-theory-venn',
                topicId: 'unit-1',
                $collectionId: 'subtopics',
                $databaseId: 'database',
                $createdAt: new Date().toISOString(),
                $updatedAt: new Date().toISOString(),
                $permissions: []
            },
            {
                $id: 'ns-8',
                name: 'Probability and Statistics',
                slug: 'probability-statistics',
                topicId: 'unit-1',
                $collectionId: 'subtopics',
                $databaseId: 'database',
                $createdAt: new Date().toISOString(),
                $updatedAt: new Date().toISOString(),
                $permissions: []
            }
        ]
    },
    {
        $id: 'unit-2',
        name: 'Unit 2: Algebraic Manipulation',
        slug: 'algebraic-manipulation',
        $collectionId: 'topics',
        $databaseId: 'database',
        $createdAt: new Date().toISOString(),
        $updatedAt: new Date().toISOString(),
        $permissions: [],
        subtopics: [
            {
                $id: 'am-1',
                name: 'Rules for exponents/indices (including negative and fractional powers)',
                slug: 'exponents-indices',
                topicId: 'unit-2',
                $collectionId: 'subtopics',
                $databaseId: 'database',
                $createdAt: new Date().toISOString(),
                $updatedAt: new Date().toISOString(),
                $permissions: []
            },
            {
                $id: 'am-2',
                name: 'Expansion of brackets (including square of binomial)',
                slug: 'expansion-brackets',
                topicId: 'unit-2',
                $collectionId: 'subtopics',
                $databaseId: 'database',
                $createdAt: new Date().toISOString(),
                $updatedAt: new Date().toISOString(),
                $permissions: []
            },
            {
                $id: 'am-3',
                name: 'Factorisation: common factor, grouping, difference of squares, trinomials',
                slug: 'factorisation',
                topicId: 'unit-2',
                $collectionId: 'subtopics',
                $databaseId: 'database',
                $createdAt: new Date().toISOString(),
                $updatedAt: new Date().toISOString(),
                $permissions: []
            }
        ]
    },
    {
        $id: 'unit-3',
        name: 'Unit 3: Mensuration',
        slug: 'mensuration',
        $collectionId: 'topics',
        $databaseId: 'database',
        $createdAt: new Date().toISOString(),
        $updatedAt: new Date().toISOString(),
        $permissions: [],
        subtopics: [
            {
                $id: 'mns-1',
                name: 'Units of Measurement',
                slug: 'units-measurement',
                topicId: 'unit-3',
                $collectionId: 'subtopics',
                $databaseId: 'database',
                $createdAt: new Date().toISOString(),
                $updatedAt: new Date().toISOString(),
                $permissions: []
            },
            {
                $id: 'mns-2',
                name: 'Perimeter & Area',
                slug: 'perimeter-area',
                topicId: 'unit-3',
                $collectionId: 'subtopics',
                $databaseId: 'database',
                $createdAt: new Date().toISOString(),
                $updatedAt: new Date().toISOString(),
                $permissions: []
            },
            {
                $id: 'mns-3',
                name: 'Circle Properties',
                slug: 'circle-vocabulary',
                topicId: 'unit-3',
                $collectionId: 'subtopics',
                $databaseId: 'database',
                $createdAt: new Date().toISOString(),
                $updatedAt: new Date().toISOString(),
                $permissions: []
            },
            {
                $id: 'mns-4',
                name: 'Composite Shapes Involving Circles',
                slug: 'circle-calculations',
                topicId: 'unit-3',
                $collectionId: 'subtopics',
                $databaseId: 'database',
                $createdAt: new Date().toISOString(),
                $updatedAt: new Date().toISOString(),
                $permissions: []
            },
            {
                $id: 'mns-5',
                name: 'Scale Drawings and Maps',
                slug: 'arc-sector',
                topicId: 'unit-3',
                $collectionId: 'subtopics',
                $databaseId: 'database',
                $createdAt: new Date().toISOString(),
                $updatedAt: new Date().toISOString(),
                $permissions: []
            },
            {
                $id: 'mns-6',
                name: 'Regular Polygons',
                slug: 'regular-polygons',
                topicId: 'unit-3',
                $collectionId: 'subtopics',
                $databaseId: 'database',
                $createdAt: new Date().toISOString(),
                $updatedAt: new Date().toISOString(),
                $permissions: []
            }
        ]
    },
    {
        $id: 'unit-4',
        name: 'Unit 4: Linear Patterns, Models, and Representations',
        slug: 'linear-patterns',
        $collectionId: 'topics',
        $databaseId: 'database',
        $createdAt: new Date().toISOString(),
        $updatedAt: new Date().toISOString(),
        $permissions: [],
        subtopics: [
            {
                $id: 'lpm-1',
                name: 'Linear Equations',
                slug: 'linear-equations',
                topicId: 'unit-4',
                $collectionId: 'subtopics',
                $databaseId: 'database',
                $createdAt: new Date().toISOString(),
                $updatedAt: new Date().toISOString(),
                $permissions: []
            },
            {
                $id: 'lpm-2',
                name: 'Inequalities',
                slug: 'inequalities',
                topicId: 'unit-4',
                $collectionId: 'subtopics',
                $databaseId: 'database',
                $createdAt: new Date().toISOString(),
                $updatedAt: new Date().toISOString(),
                $permissions: []
            },
            {
                $id: 'lpm-3',
                name: 'Linear Functions',
                slug: 'linear-functions',
                topicId: 'unit-4',
                $collectionId: 'subtopics',
                $databaseId: 'database',
                $createdAt: new Date().toISOString(),
                $updatedAt: new Date().toISOString(),
                $permissions: []
            },
            {
                $id: 'lpm-4',
                name: 'Simultaneous Equations',
                slug: 'simultaneous-equations',
                topicId: 'unit-4',
                $collectionId: 'subtopics',
                $databaseId: 'database',
                $createdAt: new Date().toISOString(),
                $updatedAt: new Date().toISOString(),
                $permissions: []
            },
            {
                $id: 'lpm-5',
                name: 'Coordinate Geometry',
                slug: 'coordinate-geometry',
                topicId: 'unit-4',
                $collectionId: 'subtopics',
                $databaseId: 'database',
                $createdAt: new Date().toISOString(),
                $updatedAt: new Date().toISOString(),
                $permissions: []
            },
            {
                $id: 'lpm-6',
                name: 'Distance Formula',
                slug: 'distance-formula',
                topicId: 'unit-4',
                $collectionId: 'subtopics',
                $databaseId: 'database',
                $createdAt: new Date().toISOString(),
                $updatedAt: new Date().toISOString(),
                $permissions: []
            },
            {
                $id: 'lpm-7',
                name: 'Midpoint Formula',
                slug: 'midpoint-formula',
                topicId: 'unit-4',
                $collectionId: 'subtopics',
                $databaseId: 'database',
                $createdAt: new Date().toISOString(),
                $updatedAt: new Date().toISOString(),
                $permissions: []
            }
        ]
    },
    {
        $id: 'unit-5',
        name: 'Unit 5: Angles',
        slug: 'angles',
        $collectionId: 'topics',
        $databaseId: 'database',
        $createdAt: new Date().toISOString(),
        $updatedAt: new Date().toISOString(),
        $permissions: [],
        subtopics: [
            {
                $id: 'ang-1',
                name: 'Geometric Terms',
                slug: 'geometric-terms',
                topicId: 'unit-5',
                $collectionId: 'subtopics',
                $databaseId: 'database',
                $createdAt: new Date().toISOString(),
                $updatedAt: new Date().toISOString(),
                $permissions: []
            },
            {
                $id: 'ang-2',
                name: 'Measuring Angles',
                slug: 'measuring-angles',
                topicId: 'unit-5',
                $collectionId: 'subtopics',
                $databaseId: 'database',
                $createdAt: new Date().toISOString(),
                $updatedAt: new Date().toISOString(),
                $permissions: []
            },
            {
                $id: 'ang-3',
                name: 'Angle Relationships',
                slug: 'angle-relationships',
                topicId: 'unit-5',
                $collectionId: 'subtopics',
                $databaseId: 'database',
                $createdAt: new Date().toISOString(),
                $updatedAt: new Date().toISOString(),
                $permissions: []
            },
            {
                $id: 'ang-4',
                name: 'Pythagoras Theorem',
                slug: 'pythagoras-theorem',
                topicId: 'unit-5',
                $collectionId: 'subtopics',
                $databaseId: 'database',
                $createdAt: new Date().toISOString(),
                $updatedAt: new Date().toISOString(),
                $permissions: []
            },
            {
                $id: 'ang-5',
                name: 'Bearings Problems (Extended)',
                slug: 'bearings',
                topicId: 'unit-5',
                $collectionId: 'subtopics',
                $databaseId: 'database',
                $createdAt: new Date().toISOString(),
                $updatedAt: new Date().toISOString(),
                $permissions: []
            },
            {
                $id: 'ang-6',
                name: 'Reflection',
                slug: 'reflection',
                topicId: 'unit-5',
                $collectionId: 'subtopics',
                $databaseId: 'database',
                $createdAt: new Date().toISOString(),
                $updatedAt: new Date().toISOString(),
                $permissions: []
            },
            {
                $id: 'ang-7',
                name: 'Rotation',
                slug: 'rotation',
                topicId: 'unit-5',
                $collectionId: 'subtopics',
                $databaseId: 'database',
                $createdAt: new Date().toISOString(),
                $updatedAt: new Date().toISOString(),
                $permissions: []
            },
            {
                $id: 'ang-8',
                name: 'Translation',
                slug: 'translation',
                topicId: 'unit-5',
                $collectionId: 'subtopics',
                $databaseId: 'database',
                $createdAt: new Date().toISOString(),
                $updatedAt: new Date().toISOString(),
                $permissions: []
            }
        ]
    },
    {
        $id: 'unit-8',
        name: 'Unit 8: Trigonometry',
        slug: 'trigonometry',
        $collectionId: 'topics',
        $databaseId: 'database',
        $createdAt: new Date().toISOString(),
        $updatedAt: new Date().toISOString(),
        $permissions: [],
        subtopics: [
            {
                $id: 'trig-1',
                name: 'Right-angled triangle trigonometry (SOHCAHTOA)',
                slug: 'right-angled-trigonometry',
                topicId: 'unit-8',
                $collectionId: 'subtopics',
                $databaseId: 'database',
                $createdAt: new Date().toISOString(),
                $updatedAt: new Date().toISOString(),
                $permissions: []
            },
            {
                $id: 'trig-2',
                name: 'Periodic Functions',
                slug: 'periodic-functions',
                topicId: 'unit-8',
                $collectionId: 'subtopics',
                $databaseId: 'database',
                $createdAt: new Date().toISOString(),
                $updatedAt: new Date().toISOString(),
                $permissions: []
            },
            {
                $id: 'trig-3',
                name: 'Angles of elevation and depression',
                slug: 'angles-elevation-depression',
                topicId: 'unit-8',
                $collectionId: 'subtopics',
                $databaseId: 'database',
                $createdAt: new Date().toISOString(),
                $updatedAt: new Date().toISOString(),
                $permissions: []
            },
            {
                $id: 'trig-4',
                name: 'Perpendicular distance from a point to a line',
                slug: 'perpendicular-distance',
                topicId: 'unit-8',
                $collectionId: 'subtopics',
                $databaseId: 'database',
                $createdAt: new Date().toISOString(),
                $updatedAt: new Date().toISOString(),
                $permissions: []
            }
        ]
    }
];

export default topics;