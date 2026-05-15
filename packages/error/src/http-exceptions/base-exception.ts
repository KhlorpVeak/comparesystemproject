import { HTTPException } from 'hono/http-exception';
import { ContentfulStatusCode } from 'hono/utils/http-status';

export type HTTPExceptionOptions = {
  res?: Response;
  message?: string;
  cause?: unknown;
  context?: Context;
};

export type Context = {
  url?: string;
  method?: string;
  statusCode?: number;
};

export class BaseHTTPException extends HTTPException {
  public context?: Context;

  constructor(statusCode: ContentfulStatusCode, opts?: HTTPExceptionOptions) {
    // Extract context before passing to parent, as HTTPException doesn't accept it
    if (opts) {
      const { context, ...httpExceptionOpts } = opts;
      super(statusCode, httpExceptionOpts);
      this.context = context;
    } else {
      super(statusCode);
      this.context = undefined;
    }
  }

  public static fromRequest(request: Request, response: Response) {
    return new BaseHTTPException(response.status as ContentfulStatusCode, {
      message: response.statusText, // can be overriden with { ...res, statusText: 'Custom message' }
      context: {
        url: request.url,
        method: request.method,
        statusCode: response.status,
      },
    });
  }
}
