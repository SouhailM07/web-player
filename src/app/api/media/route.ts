import { NextRequest } from "next/server";
import handleResponse from "@/lib/handleResponse";
import connectMongoose from "@/lib/connectDB";
import Media from "@/models/media.model";
import queryParam from "@/lib/queryParam";

connectMongoose();

export async function GET(req: NextRequest) {
  try {
    const id = queryParam(req, "id");
    const userId = queryParam(req, "userId");
    if (!id) {
      const medias = await Media.find({ user: userId });
      return handleResponse(medias, 200);
    }
    const oneMedia = await Media.findById(id);
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
    const newMedia = new Media(values);
    await newMedia.save();
    return handleResponse("new media was created", 201);
  } catch (error) {
    handleResponse(error, 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    // const id = req.nextUrl.searchParams.get("id");
    const id = queryParam(req, "id");
    const values = await req.json();
    const updateMedia = await Media.findByIdAndUpdate(id, values);
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
    // const id = req.nextUrl.searchParams.get("id");
    const id = queryParam(req, "id");
    const deleteMedia = await Media.findByIdAndDelete(id);
    if (!deleteMedia) {
      return handleResponse("media was not found", 404);
    }
    return handleResponse("media was deleted", 200);
  } catch (error) {
    return handleResponse(error, 500);
  }
}
