CREATE TABLE "urlExport" (
	"id" text PRIMARY KEY NOT NULL,
	"file_name" text NOT NULL,
	"remote_key" text NOT NULL,
	"remote_url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "urlExport_remote_key_unique" UNIQUE("remote_key")
);
