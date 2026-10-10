import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

export function validationError(error: ZodError) {
  return NextResponse.json(
    { success: false, message: "Please check the submitted details.", fieldErrors: error.flatten().fieldErrors },
    { status: 422 },
  );
}

export function serverError(error: unknown) {
  console.error("Finear API error:", error);
  return jsonError("The request could not be completed. Please try again.", 500);
}
