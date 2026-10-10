import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { FinanceError, getDashboard } from "@/lib/services/finance-service";
import { serverError } from "@/lib/api/route-response";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ success: false, message: "Please sign in." }, { status: 401 });
    return NextResponse.json({ success: true, data: await getDashboard(user.id) });
  } catch (error) {
    if (error instanceof FinanceError) return NextResponse.json({ success: false, message: error.message }, { status: error.status });
    return serverError(error);
  }
}
