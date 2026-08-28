const API_URL =
    process.env.API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    'http://localhost:8080';

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

// The backend only searches content records (companies, jobs, media, events...),
// not the site's own static sections. Without this, a query like "careers" finds
// nothing even though a "Careers" page obviously exists — index the nav here instead.
interface StaticPage {
    title: string;
    description: string;
    url: string;
    keywords: string[];
}

const SEARCHABLE_PAGES: StaticPage[] = [
    { title: 'Home', description: 'Back to the homepage', url: '/', keywords: ['home', 'homepage'] },
    { title: 'Corporate Profile', description: 'Our company profile and overview', url: '/corporate/profile', keywords: ['corporate', 'profile', 'about', 'about us'] },
    { title: 'Leadership', description: 'Meet our corporate leadership team', url: '/corporate/leadership', keywords: ['leadership', 'management', 'team', 'executives'] },
    { title: 'Companies', description: 'Explore our group of companies', url: '/companies', keywords: ['companies', 'subsidiaries', 'portfolio', 'group'] },
    { title: 'Blogs', description: 'Read our latest blog posts', url: '/news/blogs', keywords: ['blog', 'blogs'] },
    { title: 'News & Articles', description: 'Our latest news and articles', url: '/news/articles', keywords: ['news', 'articles', 'press'] },
    { title: 'Media', description: 'Photos and videos gallery', url: '/news/media', keywords: ['media', 'gallery', 'photos', 'videos'] },
    { title: 'Life at OCH — Culture', description: 'Our workplace culture', url: '/careers/culture', keywords: ['culture', 'life at och', 'workplace'] },
    { title: 'Careers & Opportunities', description: 'Explore open job opportunities', url: '/careers/opportunities', keywords: ['careers', 'career', 'jobs', 'job', 'opportunities', 'hiring', 'vacancies', 'onboard', 'life at och'] },
    { title: 'Talent Pool', description: 'Join our talent pool', url: '/careers/talent-pool', keywords: ['talent pool', 'talent', 'resume', 'cv'] },
    { title: 'Contact Us', description: 'Get in touch with us', url: '/contact', keywords: ['contact', 'reach us', 'email', 'phone', 'address'] },
];

const searchStaticPages = (query: string): SearchResultItem[] => {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    return SEARCHABLE_PAGES.filter(
        (page) =>
            page.title.toLowerCase().includes(q) ||
            page.description.toLowerCase().includes(q) ||
            page.keywords.some((keyword) => keyword.includes(q) || q.includes(keyword))
    ).map((page) => ({
        type: 'page',
        id: page.url,
        title: page.title,
        description: page.description,
        url: page.url,
    }));
};

export const searchGlobal = async (query: string): Promise<SearchResponse> => {
    const trimmed = query.trim();
    const pageResults = searchStaticPages(trimmed);

    let backendResults: SearchResponse = { query: trimmed, results: {}, totalResults: 0 };
    try {
        const response = await fetch(`${API_URL}/api/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: trimmed })
        });

        if (!response.ok) {
            throw new Error(`Search failed: ${response.statusText}`);
        }

        backendResults = await response.json();
    } catch (error) {
        // Degrade gracefully: still surface static page matches even if the
        // backend is unreachable, instead of leaving the modal stuck loading.
        console.error('Search error:', error);
    }

    const results: SearchResponse['results'] = {};
    if (pageResults.length > 0) {
        results.pages = pageResults;
    }
    Object.assign(results, backendResults.results);

    return {
        query: trimmed,
        results,
        totalResults: pageResults.length + (backendResults.totalResults || 0)
    };
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
