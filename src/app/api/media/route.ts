import { NextRequest } from "next/server";
import handleResponse from "@/lib/handleResponse";
import { PrismaClient } from "@prisma/client";
import queryParam from "@/lib/queryParam";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const id = queryParam(req, "id");
    const userId: any = queryParam(req, "userId");

    if (!id) {
      const medias = await prisma.media.findMany({
        where: { user: userId },
      });
      return handleResponse(medias, 200);
    }

    const oneMedia = await prisma.media.findUnique({
      where: { id },
    });

    if (!oneMedia) {
      return handleResponse("media was not found", 404);
    }
    return handleResponse(oneMedia, 200);
  } catch (error) {
    return handleResponse(error, 404);
  }
}

export async function POST(req: NextRequest) {
  try {
    const values = await req.json();
    const newMedia = await prisma.media.create({
      data: values,
    });
    return handleResponse("new media was created", 201);
  } catch (error) {
    return handleResponse(error, 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const id: any = queryParam(req, "id");
    const values = await req.json();
    const updateMedia = await prisma.media.update({
      where: { id },
      data: values,
    });
    if (!updateMedia) {
      return handleResponse("media was not found", 404);
    }
    return handleResponse("media was updated", 204);
  } catch (error) {
    return handleResponse(error, 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id: any = queryParam(req, "id");
    const deleteMedia = await prisma.media.delete({
      where: { id },
    });
    if (!deleteMedia) {
      return handleResponse("media was not found", 404);
    }
    return handleResponse("media was deleted", 204);
  } catch (error) {
    return handleResponse(error, 500);
  }
}
