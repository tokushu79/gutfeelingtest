export class ApiError extends Error {
  constructor(public status: number, message: string, public details?: unknown) {
    super(message);
    this.name = "ApiError";
  }
}

export const badRequest = (msg: string, details?: unknown) => new ApiError(400, msg, details);
export const unauthorized = (msg = "Unauthorized") => new ApiError(401, msg);
export const forbidden = (msg = "Forbidden") => new ApiError(403, msg);
export const notFound = (msg = "Not found") => new ApiError(404, msg);
export const conflict = (msg: string) => new ApiError(409, msg);
