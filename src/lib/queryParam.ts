import { NextRequest } from "next/server";

export default function queryParam(req: NextRequest, qp: string) {
  return req.nextUrl.searchParams.get(qp);
}
