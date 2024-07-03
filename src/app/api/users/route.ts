import { NextRequest } from "next/server";
import User from "@/models/user.model";
import connectMongoose from "@/lib/connectDB";
import handleResponse from "@/lib/handleResponse";
import queryParam from "@/lib/queryParam";

connectMongoose();

export async function GET(req: NextRequest) {
  try {
    // const userId = req.nextUrl.searchParams.get("userId");
    const userId = queryParam(req, "userId");
    if (!userId) {
      let users = await User.find({});
      return handleResponse(users, 200);
    }
    const oneUser = await User.findOne({ clerkId: userId });
    if (!oneUser) {
      return handleResponse("user was not found", 404);
    }
    return handleResponse(oneUser, 200);
  } catch (error) {
    return handleResponse(error, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    let values = await req.json();
    let newUser = new User(values);
    newUser.save();
    return handleResponse("new user was created", 201);
  } catch (error) {
    return handleResponse(error, 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // const id = req.nextUrl.searchParams.get("id");
    const id = queryParam(req, "id");
    const deleteUser = await User.findByIdAndDelete(id);
    if (!deleteUser) {
      return handleResponse("user was not found", 404);
    }
    return handleResponse("user was deleted", 204);
  } catch (error) {
    return handleResponse(error, 500);
  }
}
