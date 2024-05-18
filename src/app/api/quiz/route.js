import { NextResponse } from "next/server";
import { getDatabase, ref, set } from "firebase/database";
import database from "@/firebase/config";

export async function POST(req) {
  const { id } = await req.json();
  try {
    const db = getDatabase();
    const dbRef = ref(db, `quiz/current_question`);
    set(dbRef, id);
    return NextResponse.json({ message: "Question changed successfully" });
  } catch (error) {
    return NextResponse.json({ message: error.message, error: error.code });
  }
}
