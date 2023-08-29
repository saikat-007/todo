import { NextResponse } from "next/server";
import { connectDB } from "../../../../utils/connect";
import { Task } from "@/models/task";

export const POST = async (req) => {
  connectDB();
  try {
    const body = await req.json();
    const taskData = await Task.create(body);
    return new NextResponse(JSON.stringify(taskData), { status: 201 });
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};
