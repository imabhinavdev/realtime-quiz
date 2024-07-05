import { NextResponse } from "next/server";
import { getDatabase, ref, set } from "firebase/database";
import database from "@/firebase/config";

import db from "@/db/db";
import { QuizModel } from "@/models/QuizModel";


// export async function POST(req) {
//   const { id } = await req.json();
//   try {
//     const db = database;
//     const dbRef = ref(db, `quiz/current_question`);
//     set(dbRef, id);
//     return NextResponse.json({ message: "Question changed successfully" });
//   } catch (error) {
//     return NextResponse.json({ message: error.message, error: error.code });
//   }
// }

export async function POST(req) {
  try {
    const { name, admin } = await req.json();

    if (!name) {
      return NextResponse.json({ message: "Name is required" });
    }

    if (!admin) {
      return NextResponse.json({ message: "Admin is required" });
    }
    await db();
    const quiz = await QuizModel.create({ name, admin });
    return NextResponse.json({ message: "Quiz created successfully", quiz });
  } catch (error) {
    return NextResponse.json({ message: error.message, error: error.code });
  }
}


export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const admin = searchParams.get('admin')
  const id = searchParams.get('id')
  if (admin) {
    try {
      await db();
      const quiz = await QuizModel.find({ "admin": admin });
      if (!quiz) {
        return NextResponse.json({ message: "Quizzes not found" });
      }
      return NextResponse.json({ quiz });
    } catch (error) {
      return NextResponse.json({ message: error.message, error: error.code });
    }
  }
  else {
    try {
      await db();
      const quiz = await QuizModel.findById(id);
      if (!quiz) {
        return NextResponse.json({ message: "Quiz not found" });
      }
      return NextResponse.json({ quiz });
    }
    catch (error) {
      return NextResponse.json({ message: error.message, error: error.code });
    }
  }
}


export async function PATCH(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  await db();

  if (!id) {
    return NextResponse.json({ message: "Id is required" }, { status: 400 });
  }

  try {
    const { name, isActive } = await req.json();
    const updateData = {};
    if (name !== undefined) {
      updateData.name = name;
    }
    if (isActive !== undefined) {
      updateData.isActive = isActive;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: "No fields to update" }, { status: 400 });
    }

    const updatedUser = await QuizModel.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedUser) {
      return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Quiz updated successfully", Quiz: updatedUser });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "An error occurred", message: err.message }, { status: 500 });
  }
}


export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if(!id){
    return NextResponse.json({message:"Id is required"},{status:400});
  }
  await db();
  try{
    const quiz=await QuizModel.findByIdAndDelete(id);
    if(!quiz){
      return NextResponse.json({message:"Quiz not found"},{status:404});
    }
    return NextResponse.json({message:"Quiz deleted successfully"});

  }
  catch(err){
    console.error(err);
    return NextResponse.json({error:"An error occurred",message:err.message},{status:500});
  }
}