import { FastifyInstance } from "fastify";
import { redirectUrl } from "./redirect-url";
import { fetchLinks } from "./fetch-links";
import { createLinkShort } from "./create-link-short";
import { getMetrics } from "./get-metrics";

export async function router(app: FastifyInstance) {
  app.get('/:code', redirectUrl)
  app.get('/api/links', fetchLinks)
  app.get('/api/metrics', getMetrics)

  app.post('/api/links', createLinkShort)
}