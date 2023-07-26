import express, { Application } from 'express'
import logger from 'morgan'
import cors from 'cors'
import appRoutes from '@/routes'
import { appErrorHandler, endpointNotFound } from './route-helpers'
import { pathConfig } from '@/config'
/**
 * App bundler
 */
export default function expressSetup({ app }: { app: Application }) {
    app.use(express.json({ limit: "100mb" }))
    app.use(express.urlencoded({ extended: true }))
    app.use(logger('dev'))
    app.use(cors({ origin: "*" }))
    // static file/ media files
    app.use(express.static(pathConfig.uploadDir))
    // routes
    app.use('/api/v1', appRoutes())
    // not found routes
    app.all('*', endpointNotFound)
    // error handler
    app.use(appErrorHandler)

    return app
}