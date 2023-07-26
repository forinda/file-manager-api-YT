import { NextFunction, Request, Response } from 'express'
export type AppRequest = {
    [k: string]: any
} & Request
export type AppNext = NextFunction
export type AppResponse = Response