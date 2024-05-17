import { NextResponse } from "next/server";
import { getDatabase, ref, set } from "firebase/database";
import database from "@/firebase/config";

export async function POST(req) {
  const { text, optionA, optionB, optionC, optionD, correct } =
    await req.json();
  const time = new Date().getTime();
  const ques_id = text.split(" ").join("_") + time;
  set(ref(database, "questions/" + ques_id), {
    optionA: optionA,
    optionB: optionB,
    optionC: optionC,
    optionD: optionD,
    text: text,
    correct: correct,
  });
  return NextResponse.json({ message: "Question added successfully" });
}
