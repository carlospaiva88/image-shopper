import {Request, Response, NextFunction } from 'express'

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500
    const message = err.message || 'Internal Server Error'
    res.status(statusCode).json({
        error_code: err.error_code || 'INTERNAL_ERROR',
        error_description: message,
    })
}

export default errorHandler