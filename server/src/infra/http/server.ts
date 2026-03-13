import fastifyCors from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastify from "fastify";
import {
	hasZodFastifySchemaValidationErrors,
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
} from "fastify-type-provider-zod";
import { createUrlRoute } from "./routes/create-url";
import { deleteUrlRoute } from "./routes/delete-url";
import { exportUrlRoute } from "./routes/export-url";
import { getOriginalUrlRoute } from "./routes/get-original-url";
import { listAllUrlsRoute } from "./routes/list-all-urls";

const server = fastify();

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.register(fastifyCors, {
	origin: "*",
	methods: ["GET", "POST", "DELETE"],
});

server.setErrorHandler((error, _request, reply) => {
	if (hasZodFastifySchemaValidationErrors(error)) {
		return reply.status(400).send({
			message: "Validation error",
			issues: error.validation,
		});
	}

	console.error(error);

	return reply.status(500).send({
		message: "Internal server error",
	});
});

server.register(fastifyMultipart);
server.register(fastifySwagger, {
	openapi: {
		info: {
			title: "Brevly",
			version: "1.0.0",
		},
	},
	transform: jsonSchemaTransform,
});

server.register(fastifySwaggerUi, {
	routePrefix: "/docs",
});

server.register(createUrlRoute);
server.register(deleteUrlRoute);
server.register(getOriginalUrlRoute);
server.register(listAllUrlsRoute);
server.register(exportUrlRoute);

server.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
	console.log("HTTP server is running!");
});
