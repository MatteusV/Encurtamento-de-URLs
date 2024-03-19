import { FastifyReply, FastifyRequest } from "fastify";
import { PostgresError } from "postgres";
import z from "zod";
import { sql } from "../lib/postgres";

export async function createLinkShort(request: FastifyRequest, reply: FastifyReply) {
  const createLinkSchema = z.object({
    code: z.string().min(3),
    url: z.string().url(),
  })

  const { code, url } = createLinkSchema.parse(request.body)


  try {
    const result = await sql/*sql*/`
    INSERT INTO short_links (code, original_url) VALUES (${code}, ${url}) RETURNING id
  `

  const link = result[0]

  return reply.status(201).send({ shortLinkId: link.id })
  } catch (error) {
    if (error instanceof PostgresError) {
      if(error.code === '23505') {
        return reply.status(400).send({message: 'Duplicate code'})
      }
    }
  }
}