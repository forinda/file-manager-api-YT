import express from 'express'
import http from 'http'
import expressSetup from '@/setup'
import { envConfig } from '@/config'

const server = http.createServer(expressSetup({ app: express() }))

server.listen(envConfig.port, () => {
    console.log(`Server running on http://localhost:${envConfig.port}`);
})