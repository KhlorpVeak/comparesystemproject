import { HTTPException } from 'hono/http-exception';
import { BaseHTTPException } from '@comparesystem/error';
import { SchemaError, ErrorCodes, statusToCode, } from '@comparesystem/error';
import { z } from '@hono/zod-openapi';
import { ZodError } from 'zod';
export function handleError(err, c) {
    if (err instanceof ZodError) {
        const error = SchemaError.fromZod(err, c);
        // If the error is a client error, we disable Sentry
        c.get('sentry')?.setEnabled(false);
        return c.json({
            code: 'BAD_REQUEST',
            message: error.message,
            requestId: c.get('requestId'),
        }, { status: 400 });
    }
    /**
     * This is a custom error that we throw in our code so we can handle it
     */
    if (err instanceof BaseHTTPException || err instanceof HTTPException) {
        const code = statusToCode(err.status);
        // If the error is a client error, we disable Sentry
        if (err.status < 499) {
            c.get('sentry')?.setEnabled(false);
        }
        return c.json({
            code: code,
            message: err.message,
            requestId: c.get('requestId'),
        }, { status: err.status });
    }
    return c.json({
        code: 'INTERNAL_SERVER_ERROR',
        message: err.message ?? 'Something went wrong',
        requestId: c.get('requestId'),
    }, { status: 500 });
}
export function handleZodError(result, c) {
    if (!result.success) {
        const error = SchemaError.fromZod(result.error, c);
        return c.json({
            code: 'BAD_REQUEST',
            message: error.message,
            requestId: c.get('requestId'),
        }, { status: 400 });
    }
}
export function createErrorSchema(code) {
    return z.object({
        code: z.enum(ErrorCodes).openapi({
            example: code,
            description: 'The error code related to the status code.',
        }),
        message: z.string().openapi({
            description: 'A human readable message describing the issue.',
            example: '<string>',
        }),
        requestId: z.string().openapi({
            description: 'The request id to be used for debugging and error reporting.',
            example: '<uuid>',
        }),
    });
}
