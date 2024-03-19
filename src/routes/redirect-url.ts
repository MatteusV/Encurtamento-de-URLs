import { FastifyRequest, FastifyReply } from "fastify";
import { sql } from "../lib/postgres";
import z from "zod";
import { redis } from "../lib/redis";

export async function redirectUrl(request: FastifyRequest, reply: FastifyReply) {
  const getLinkSchema = z.object({
    code: z.string().min(3)
  })
  const { code } = getLinkSchema.parse(request.params)

  const result = await sql/*sql*/`
    SELECT id, original_url FROM short_links WHERE code = ${code}
  `
  if(result.length === 0) {
    return reply.status(400).send({message: 'Link not found'})
  }

  const link = result[0]

  await redis.zIncrBy('metrics', 1, String(link.id))

  return reply.redirect(301, link.original_url)
 
}