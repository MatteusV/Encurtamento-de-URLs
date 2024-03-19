import { FastifyReply, FastifyRequest } from "fastify";
import { sql } from "../lib/postgres";

export async function fetchLinks(_: FastifyRequest, reply: FastifyReply) {
  const links = await sql/*sql*/`
  SELECT * FROM short_links ORDER BY created_at DESC
`
  return reply.status(200).send({ links })
}