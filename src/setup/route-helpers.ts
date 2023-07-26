import { AppNext, AppRequest, AppResponse } from "@/type";

export function endpointNotFound(req: AppRequest, res: AppResponse, _next: AppNext) {
    const resObj = {
        status: 405,
        data: null,
        method: req.method,
        message: "Method not allowed"
    }
    return res.status(405).json(resObj)
}

export function appErrorHandler(err: any, req: AppRequest, res: AppResponse, _next: AppNext) {
    console.log(`Error in request handler: ${err.message}`);
    const resObj = {
        status: 500,
        message: err.message ?? "Internal server error",
        data: null,
        method: req.method

    }
    return res.status(resObj.status).json(resObj)

}