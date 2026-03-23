import type { ErrorHandler } from "hono";
import { ZodError } from "zod";

export const errorHandler: ErrorHandler = (error, c) => {
  console.error("[api-error]", error);

  if (error instanceof ZodError) {
    return c.json(
      {
        error: "Validation Error",
        issues: error.issues,
      },
      422,
    );
  }

  const status = (error as Error & { status?: number }).status ?? 500;

  return c.json(
    {
      error: status >= 500 ? "Internal Server Error" : "Request Error",
      message: error.message,
    },
    status as any,
  );
};
