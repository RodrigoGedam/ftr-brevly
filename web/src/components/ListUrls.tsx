import type { ShortenedUrl } from "@/types";

interface ListUrlsProps {
	urls?: ShortenedUrl[];
	isLoading?: boolean;
	onDeleteUrl?: (shortenedUrl: string) => void;
}

export const ListUrls = ({
	urls = [],
	isLoading = false,
	onDeleteUrl,
}: ListUrlsProps) => {
	return (
		<div>
			<h1>List Urls</h1>
		</div>
	);
};
