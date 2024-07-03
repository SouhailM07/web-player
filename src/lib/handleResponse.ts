import { NextResponse } from "next/server";

export default function handleResponse(msg, status: number) {
  return NextResponse.json(msg, { status });
}
