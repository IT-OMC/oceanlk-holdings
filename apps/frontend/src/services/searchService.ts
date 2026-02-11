const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export interface SearchResultItem {
    type: string;
    id: string;
    title: string;
    description: string;
    url: string;
    imageUrl?: string;
    category?: string;
}

export interface SearchResponse {
    query: string;
    results: {
        [category: string]: SearchResultItem[];
    };
    totalResults: number;
}

export const searchGlobal = async (query: string): Promise<SearchResponse> => {
    try {
        const response = await fetch(`${API_URL}/api/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: query.trim() })
        });

        if (!response.ok) {
            throw new Error(`Search failed: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Search error:', error);
        throw error;
    }
};

// Debounced search function
let searchTimeout: NodeJS.Timeout | null = null;

export const debouncedSearch = (
    query: string,
    callback: (results: SearchResponse) => void,
    delay: number = 300
): void => {
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }

    searchTimeout = setTimeout(async () => {
        if (query.trim().length > 0) {
            try {
                const results = await searchGlobal(query);
                callback(results);
            } catch (error) {
                console.error('Debounced search error:', error);
            }
        } else {
            callback({ query: '', results: {}, totalResults: 0 });
        }
    }, delay);
};
