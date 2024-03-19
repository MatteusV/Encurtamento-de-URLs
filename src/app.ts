import fastify from "fastify";
import { router } from "./routes/routes";

export const app = fastify()

app.register(router)