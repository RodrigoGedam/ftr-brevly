import { CopyIcon, TrashIcon } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { deleteShortenedUrl } from "@/http/delete-url";

interface ShortenedUrlItemProps {
	originalUrl: string;
	shortenedUrl: string;
	accessCount: number;
	deleteUrl: (shortenedUrl: string) => void;
}

export const ShortenedUrlItem = ({
	originalUrl,
	shortenedUrl,
	accessCount,
	deleteUrl,
}: ShortenedUrlItemProps) => {
	const deleteShortenedUrlHandler = async (
		shortenedUrl: string
	): Promise<void> => {
		if (confirm("Você deseja deletar a URL encurtada?")) {
			await deleteShortenedUrl(shortenedUrl);
			deleteUrl(shortenedUrl);
		}
	};

	const copyUrlLinkHandler = async (shortenedUrl: string): Promise<void> => {
		navigator.clipboard.writeText(
			`${import.meta.env.VITE_FRONTEND_URL}/${shortenedUrl}`
		);
		toast.message("Link copiado com sucesso", {
			description: `O link ${shortenedUrl} foi copiado para a área de transferência.`,
		});
	};

	return (
		<div className="flex gap-5 items-center py-4 w-full" key={shortenedUrl}>
			<div className="flex flex-col gap-1 flex-1">
				<Link target="_blank" to={`/${shortenedUrl}`}>
					<span className="font-bold text-md hover:text-blue-dark text-blue-base">{`brev.ly/${shortenedUrl}`}</span>
				</Link>
				<span className="text-sm text-gray-500 not-sm:max-w-36 truncate">
					{originalUrl}
				</span>
			</div>

			<span className="text-sm text-gray-500">{`${accessCount} acessos`}</span>

			<div className="flex gap-1">
				<button
					className="bg-gray-200 hover:border-blue-base border border-gray-200 rounded-sm p-2.5 cursor-pointer"
					type="button"
					onClick={() => copyUrlLinkHandler(shortenedUrl)}
				>
					<CopyIcon className="shrink-0 size-5" />
				</button>
				<button
					className="bg-gray-200 border border-gray-200 hover:border-blue-base rounded-sm p-2.5 cursor-pointer"
					type="button"
					onClick={() => deleteShortenedUrlHandler(shortenedUrl)}
				>
					<TrashIcon className="shrink-0 size-5" />
				</button>
			</div>
		</div>
	);
};
