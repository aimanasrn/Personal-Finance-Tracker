type ServerLogMeta = Record<string, unknown> | undefined;

function normalizeError(error: unknown) {
  if (error instanceof Error) {
    return {
      message: error.message,
      stack: error.stack
    };
  }

  return {
    message: String(error)
  };
}

export function logServerError(
  scope: string,
  error: unknown,
  meta?: ServerLogMeta
) {
  const payload = {
    scope,
    ...normalizeError(error),
    meta
  };

  console.error(`[server:${scope}]`, JSON.stringify(payload));
}
