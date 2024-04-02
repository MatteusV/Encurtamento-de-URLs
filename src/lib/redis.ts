import {createClient} from 'redis'
import { env } from '../env'

export const redis = createClient({
  url: env.DATABASE_URL_REDIS,
  database: 0,
})

redis.connect()