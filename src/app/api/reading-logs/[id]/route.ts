import { NextRequest } from "next/server";
import { handleReading } from "@/lib/reading-api";
type Context = { params: Promise<{ id: string }> };
export async function PATCH(request: NextRequest, { params }: Context) {
  return handleReading(request, "patch", (await params).id);
}
export async function DELETE(request: NextRequest, { params }: Context) {
  return handleReading(request, "delete", (await params).id);
}
