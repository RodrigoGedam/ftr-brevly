export type ShortenedUrl = {
	id: string;
	originalUrl: string;
	shortenedUrl: string;
	accessCount: number;
	createdAt: Date;
};

export type CreateShortenedUrlRequest = {
	originalUrl: string;
	shortenedUrl: string;
};

export type CreateShortenedUrlResponse = ShortenedUrl;
