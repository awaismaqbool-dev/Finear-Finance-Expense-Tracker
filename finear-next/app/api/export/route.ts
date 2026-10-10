import ExcelJS from "exceljs";
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { jsonError, serverError } from "@/lib/api/route-response";

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user) return jsonError("Please sign in.", 401);

  try {
    const query = new URL(request.url).searchParams;
    const requestedType = query.get("type");
    if (requestedType && !["income", "expense", "savings"].includes(requestedType)) return jsonError("Invalid transaction type.");
    const transactions = await prisma.transaction.findMany({
      where: { userId: user.id, ...(requestedType ? { type: requestedType as "income" | "expense" | "savings" } : {}) },
      orderBy: { createdAt: "desc" },
    });

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Finear";
    workbook.created = new Date();
    const sheet = workbook.addWorksheet("Transactions", { views: [{ state: "frozen", ySplit: 1 }] });
    sheet.columns = [
      { header: "Description", key: "title", width: 34 },
      { header: "Type", key: "type", width: 16 },
      { header: "Category", key: "category", width: 20 },
      { header: "Source", key: "source", width: 14 },
      { header: "Amount (PKR)", key: "amount", width: 18 },
      { header: "Date", key: "date", width: 22 },
    ];
    sheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
    sheet.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF176B4B" } };
    for (const transaction of transactions) {
      sheet.addRow({ title: transaction.title, type: transaction.type, category: transaction.category, source: transaction.source, amount: Number(transaction.amount), date: transaction.createdAt });
    }
    sheet.getColumn("amount").numFmt = "#,##0.00";
    sheet.getColumn("date").numFmt = "dd mmm yyyy hh:mm";
    sheet.autoFilter = { from: "A1", to: "F1" };

    const bytes = await workbook.xlsx.writeBuffer();
    return new NextResponse(new Uint8Array(bytes), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="finear-${requestedType ?? "transactions"}.xlsx"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    return serverError(error);
  }
}
