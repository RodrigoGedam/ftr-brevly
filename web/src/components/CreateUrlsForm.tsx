import type { ShortenedUrl } from "@/types";

interface CreateUrlsFormProps {
	onUrlCreated?: (data: ShortenedUrl) => void;
}

export const CreateUrlsForm = ({ onUrlCreated }: CreateUrlsFormProps) => {
	return (
		<div>
			<h1>Create Url Form</h1>
		</div>
	);
};
