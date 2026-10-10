import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { jsonError, serverError } from "@/lib/api/route-response";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return jsonError("Please sign in.", 401);

  try {
    const formData = await request.formData();
    const image = formData.get("image");
    if (!(image instanceof File)) return jsonError("Choose a JPG or PNG image.");
    if (image.size > MAX_FILE_SIZE) return jsonError("Image must be 5 MB or smaller.", 413);
    const extension = path.extname(image.name).toLowerCase();
    if (![".jpg", ".jpeg", ".png"].includes(extension)) return jsonError("Only JPG, JPEG, or PNG files are allowed.");

    const bytes = Buffer.from(await image.arrayBuffer());
    const isJpeg = bytes.length > 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    const isPng = bytes.length > 8 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    if ((!isJpeg && !isPng) || (isJpeg && (image.type !== "image/jpeg" || ![".jpg", ".jpeg"].includes(extension))) || (isPng && (image.type !== "image/png" || extension !== ".png"))) {
      return jsonError("Only valid JPG, JPEG, or PNG images are allowed.");
    }

    const savedExtension = isJpeg ? "jpg" : "png";
    const filename = `${user.id}-${randomUUID()}.${savedExtension}`;
    const uploadDirectory = path.resolve(process.cwd(), process.env.UPLOAD_DIR ?? "./public/uploads");
    await mkdir(uploadDirectory, { recursive: true });
    await writeFile(path.join(uploadDirectory, filename), bytes, { flag: "wx" });
    const imagePath = `uploads/${filename}`;
    await prisma.user.update({ where: { id: Number(user.id) }, data: { imagePath } });
    return NextResponse.json({ success: true, data: { imagePath }, message: "Profile photo updated." });
  } catch (error) {
    return serverError(error);
  }
}
