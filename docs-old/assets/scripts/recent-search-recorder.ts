
interface RecentSearchResult {
    parent: string;
    page: string;
    title: string;
    url: string;
    timestamp: number;
}

const RECENT_SEARCHES_KEY = '__vendure_io_recent_searches__';

export class RecentSearchRecorder {
    private recentSearches: RecentSearchResult[] = [];
    private readonly maxAgeMs = 5 * 24 * 60 * 60 * 1000; // 5 days
    private readonly maxSize = 5;

    get list() {
        return this.recentSearches.slice().reverse();
    }

    init() {
        try {
            const data = window.localStorage.getItem(RECENT_SEARCHES_KEY) ?? '[]';
            const parsed: RecentSearchResult[] = JSON.parse(data);
            const now = Date.now();
            this.recentSearches = parsed.filter(x => now - x.timestamp < this.maxAgeMs);
        } catch (e) {
            // ...
        }
    }

    record(details: Omit<RecentSearchResult, 'timestamp'>) {
        if (this.recentSearches.find(x => x.url === details.url)) {
            return;
        }
        this.recentSearches.push({
            ...details, timestamp: Date.now(),
        });
        if (this.maxSize < this.recentSearches.length) {
            this.recentSearches.shift();
        }
        window.localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(this.recentSearches));
    }
}
