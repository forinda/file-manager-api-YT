import path from 'node:path'
import dotenv from 'dotenv'

dotenv.config()

const BASE_DIR = path.resolve(process.cwd()) // Get current working directory

const config = {
    env: {
        port: process.env.PORT || 8000,
        mode: process.env.NODE_ENV || 'development'
    },
    db: {
        mongoUri: process.env.MONGO_URI || ''
    },
    paths: {
        baseDir: BASE_DIR,
        uploadDir: path.join(BASE_DIR, 'uploads')
    }
}

export default config
