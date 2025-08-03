import React, { memo } from 'react';

/**
 * Favorites Error State
 * Single Responsibility: Error display with retry functionality
 * Pure Component: Only renders based on props
 */
const FavoritesErrorState = memo(({ error, onRetry }) => {
  return (
    <div className="bg-red-900/50 border border-red-700 rounded-xl p-6 mb-8">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-6 w-6 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-300">
            Bir hata oluştu
          </h3>
          <div className="mt-2 text-sm text-red-400">
            {error}
          </div>
          {onRetry && (
            <div className="mt-4">
              <button
                onClick={onRetry}
                className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Tekrar Dene
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

FavoritesErrorState.displayName = 'FavoritesErrorState';

export default FavoritesErrorState;
