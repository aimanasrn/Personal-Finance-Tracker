export class ApiError extends Error {
  statusCode: number;
  code: string;

  constructor(statusCode: number, code: string, message?: string) {
    super(message ?? code);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export function getErrorResponse(error: unknown) {
  if (error instanceof ApiError) {
    return {
      statusCode: error.statusCode,
      body: { error: error.code }
    };
  }

  return {
    statusCode: 500,
    body: { error: "INTERNAL_SERVER_ERROR" }
  };
}
