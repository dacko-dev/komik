import { config } from 'dotenv'

export function setupEnv() {
    const node_env = process.env.NODE_ENV || 'development'
    config({ path: ['.env', `.env.${node_env}`, `.env.${node_env}.local`] })
}
