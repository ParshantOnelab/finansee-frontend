import React from 'react';

interface StatusMessageProps {
    type: 'loading' | 'error' | 'empty';
    message: string;
    onRetry?: () => void;
}

const icons = {
    loading: (
        <svg className="animate-spin h-10 w-10 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
    ),
    error: (
        <svg className="h-10 w-10 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" />
        </svg>
    ),
    empty: (
        <svg className="h-10 w-10 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 018 0v2m-4-4a4 4 0 100-8 4 4 0 000 8z" />
        </svg>
    ),
};

const StatusMessage: React.FC<StatusMessageProps> = ({ type, message, onRetry }) => {
    return (
        <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md min-h-[180px]">
            {icons[type]}
            <p className={`text-lg font-semibold mb-2 ${type === 'error' ? 'text-red-500' : type === 'empty' ? 'text-gray-500 dark:text-gray-400' : 'text-blue-500'}`}>{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                >
                    Retry
                </button>
            )}
        </div>
    );
};

export default StatusMessage; 