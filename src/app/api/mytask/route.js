import { NextResponse } from "next/server";
import { connectDB } from "../../../../utils/connect";
import { Task } from "@/models/task";

export const GET = async (req) => {
  if (req.method === "GET") {
    connectDB();

    try {
      const { searchParams } = new URL(req.url);
      const date = searchParams.get("date");
      //console.log(date);
      const tasks = await Task.find({ dueDate: date }); // Replace with your fetching logic
      return new NextResponse(JSON.stringify(tasks), { status: 201 });
    } catch (err) {
      console.log(err);
      return new NextResponse(
        JSON.stringify({ message: "Something went wrong!" }),
        { status: 500 }
      );
    }
  }
};

export const PUT = async (req) => {
  if (req.method === "PUT") {
    connectDB();

    try {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get("id");
      //console.log("id", id);
      const task = await Task.findById(id);

      if (!task) {
        return new NextResponse(
          JSON.stringify({ message: "Task not found!" }),
          { status: 404 }
        );
      }

      task.isCompleted = !task.isCompleted; // Toggle the isCompleted field
      await task.save();

      return new NextResponse(JSON.stringify(task), { status: 200 });
    } catch (err) {
      console.log(err);
      return new NextResponse(
        JSON.stringify({ message: "Something went wrong!" }),
        { status: 500 }
      );
    }
  }
};

export const DELETE = async (req) => {
  if (req.method === "DELETE") {
    connectDB();

    try {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get("id");
      //console.log("id", id);
      const task = await Task.findById(id);

      if (!task) {
        return new NextResponse(
          JSON.stringify({ message: "Task not found!" }),
          { status: 404 }
        );
      }

      await task.deleteOne();
      return new NextResponse(JSON.stringify({ message:"Successful..." }), {
        status: 201,
      });
    } catch (err) {
      console.log(err);
      return new NextResponse(
        JSON.stringify({ message: "Something went wrong!" }),
        { status: 500 }
      );
    }
  }
};
