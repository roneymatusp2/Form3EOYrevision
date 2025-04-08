import React from 'react';

export const LoadingSpinner: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <span className="sr-only">Loading...</span>
        </div>
    );
}; 