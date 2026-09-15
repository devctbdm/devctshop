import { NextResponse } from "next/server";

import { requireAdmin, requireUser } from "@/lib/auth/session";
import { cloudinary, CLOUDINARY_FOLDERS } from "@/lib/cloudinary/config";

const allowedFolders = new Set<string>(Object.values(CLOUDINARY_FOLDERS));

export async function POST(request: Request) {
  const user = await requireUser();
  const body = (await request.json()) as {
    paramsToSign?: Record<string, string | number>;
  };
  const params = Object.fromEntries(
    Object.entries(body.paramsToSign ?? {}).filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    ),
  ) as Record<string, string | number>;
  const folder = typeof params.folder === "string" ? params.folder : "";
  if (
    !allowedFolders.has(folder) &&
    !folder.startsWith(`${CLOUDINARY_FOLDERS.users}/`)
  ) {
    return NextResponse.json({ error: "invalid_folder" }, { status: 400 });
  }
  if (!folder.startsWith(`${CLOUDINARY_FOLDERS.users}/${user.id}`))
    await requireAdmin();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();
  const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY?.trim();
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim();
  if (!apiSecret || !apiKey || !cloudName)
    return NextResponse.json(
      { error: "cloudinary_not_configured" },
      { status: 503 },
    );
  return NextResponse.json({
    signature: cloudinary.utils.api_sign_request(params, apiSecret),
    apiKey,
  });
}
