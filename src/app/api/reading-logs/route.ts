import { NextRequest } from "next/server";
import { handleReading } from "@/lib/reading-api";
export function GET(request: NextRequest) {
  return handleReading(request, "list");
}
export function POST(request: NextRequest) {
  return handleReading(request, "create");
}
