import { NextResponse } from "next/server";
import { ZodSchema, ZodError } from "zod";

export interface FormattedZodError {
  field: string;
  message: string;
}

export function formatZodError(error: ZodError): FormattedZodError[] {
  const issues = error.issues || (error as any).errors || [];
  return issues.map((err: any) => ({
    field: (err.path && err.path.join(".")) || "payload",
    message: err.message,
  }));
}

export function validationErrorResponse(error: ZodError): NextResponse {
  return NextResponse.json(
    {
      error: "Invalid request",
      details: formatZodError(error),
    },
    { status: 400 }
  );
}

export function safeValidate<T>(
  schema: ZodSchema<T>,
  data: unknown
):
  | { success: true; data: T }
  | { success: false; response: NextResponse; error: ZodError } {
  const result = schema.safeParse(data);
  if (!result.success) {
    return {
      success: false,
      response: validationErrorResponse(result.error),
      error: result.error,
    };
  }
  return {
    success: true,
    data: result.data,
  };
}
