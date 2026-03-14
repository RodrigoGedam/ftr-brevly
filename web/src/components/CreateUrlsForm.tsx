/* eslint-disable @typescript-eslint/no-unused-vars */

import { zodResolver } from "@hookform/resolvers/zod";
import { WarningIcon } from "@phosphor-icons/react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { createUrl } from "@/http/create-url";
import type { ShortenedUrl } from "@/types";

interface CreateUrlsFormProps {
	onUrlCreated: (data: ShortenedUrl) => void;
}

const CreateShortenedUrlSchema = z.object({
	originalUrl: z
		.string()
		.transform(val => {
			if (!/^https?:\/\//i.test(val)) {
				return `https://${val}`;
			}
			return val;
		})
		.pipe(z.string().check(z.url({ error: "Informe uma URL válida." }))),
	shortenedUrl: z
		.string()
		.min(3, "A url encurtada deve ter pelo menos 3 caracteres")
		.max(15, "A url encurtada deve ter no máximo 15 caracteres")
		.regex(/^[a-z0-9-]+$/, {
			error: "A url encurtada deve conter apenas letras, números, hífens e underscores",
		}),
});

type CreateShortenedUrlData = z.infer<typeof CreateShortenedUrlSchema>;

export const CreateUrlsForm = ({ onUrlCreated }: CreateUrlsFormProps) => {
	const {
		register,
		handleSubmit,
		formState: { errors, dirtyFields },
	} = useForm<CreateShortenedUrlData>({
		resolver: zodResolver(CreateShortenedUrlSchema),
		defaultValues: {
			originalUrl: "",
			shortenedUrl: "",
		},
	});

	const createUrlHandler: SubmitHandler<
		CreateShortenedUrlData
	> = async data => {
		try {
			const response = await createUrl(data);

			if (response !== undefined) {
				const {
					id,
					originalUrl,
					shortenedUrl,
					accessCount,
					createdAt,
				} = response;

				onUrlCreated({
					id,
					originalUrl,
					shortenedUrl,
					accessCount,
					createdAt,
				});
			}
		} catch (_error) {
			toast.error("Erro no cadastro", {
				description: "Essa url encurtada já existe.",
			});
		}
	};

	return (
		<div className="bg-gray-100 flex justify-center lg:w-96 flex-col max-h-80 p-6 rounded-lg w-full">
			<h2 className="text-lg text-gray-600">Novo link</h2>
			<form
				className="flex flex-col gap-4 py-5"
				onSubmit={handleSubmit(createUrlHandler)}
			>
				<label
					className="focus-within:text-blue-base focus-within:font-bold text-gray-500 text-xs data-[error=true]:text-danger data-[error=true]:font-bold"
					htmlFor="original-url"
					data-error={Boolean(errors.originalUrl)}
				>
					<span className="block pb-2">Link Original</span>
					<input
						className="border border-gray-300 focus:caret-blue-base focus:outline-blue-base focus:outline-[1.5px] font-normal h-12 placeholder:font-normal placeholder:text-gray-400 placeholder:text-md px-4 rounded-lg text-md text-gray-600 w-full data-[error=true]:border-danger data-[error=true]:border-2 data-[error=true]:outline-danger data-[error=true]:outline-[1.5px]"
						id="original-url"
						placeholder="www.exemplo.com.br"
						{...register("originalUrl")}
						data-error={Boolean(errors.originalUrl)}
					/>
					{errors.originalUrl && (
						<p className="flex gap-2 normal-case text-sm text-gray-500 pt-1.5">
							<WarningIcon className="text-danger" size={16} />{" "}
							{errors.originalUrl.message}
						</p>
					)}
				</label>
				<label
					className="flex flex-col gap-2 focus-within:text-blue-base focus-within:font-bold text-gray-500 text-xs data-[error=true]:text-danger data-[error=true]:font-bold"
					htmlFor="shortened-url"
					data-error={Boolean(errors.shortenedUrl)}
				>
					Link Encurtado
					<div
						className="border border-gray-300  focus-within:border-blue-base flex items-center h-12 px-4 rounded-lg text-gray-600 w-full data-[error=true]:border-danger data-[error=true]:border-2 data-[error=true]:outline-danger data-[error=true]:outline-[1.5px]"
						data-error={Boolean(errors.shortenedUrl)}
					>
						<span className="font-normal normal-case text-gray-400 text-md">
							brev.ly/
						</span>

						<input
							className="focus:caret-blue-base text-md text-gray-600 w-full outline-none font-normal"
							id="shortened-url"
							{...register("shortenedUrl")}
						/>
					</div>
					{errors.shortenedUrl && (
						<p className="flex gap-2 normal-case text-sm text-gray-500">
							<WarningIcon className="text-danger" size={16} />{" "}
							{errors.shortenedUrl.message}
						</p>
					)}
				</label>
				<input
					className="bg-blue-base not-disabled:cursor-pointer disabled:bg-blue-base/50 hover:bg-blue-dark h-12 rounded-lg text-md text-white"
					disabled={
						!(dirtyFields.originalUrl && dirtyFields.shortenedUrl)
					}
					type="submit"
					value="Salvar link"
				/>
			</form>
		</div>
	);
};
