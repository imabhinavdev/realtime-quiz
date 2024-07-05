import { NextResponse } from "next/server";
import { getDatabase, ref, set, get } from "firebase/database";
import database from "@/firebase/config";
import db from "@/db/db";
import { QuizModel } from "@/models/QuizModel";

export async function POST(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ message: "Quiz id is required" }, { status: 400 });
  }

  const { text, optionA, optionB, optionC, optionD, correct, timer } = await req.json();

  // Validate required fields
  if (!text || !correct || timer < 10) {
    return NextResponse.json({
      message: "Please fill in the question text, select the correct option, and set the timer (minimum 10 seconds)."
    }, { status: 400 });
  }

  // Ensure all options are provided
  if (typeof optionA === "undefined" || typeof optionB === "undefined" || typeof optionC === "undefined" || typeof optionD === "undefined") {
    return NextResponse.json({
      message: "All options (A, B, C, D) must be provided."
    }, { status: 400 });
  }

  try {
    await db();
    const quiz = await QuizModel.findById(id);
    if (!quiz) {
      return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
    }

    const database = getDatabase();
    const questionNoRef = ref(database, `${id}/question_no`);
    const quizActiveRef = ref(database, `${id}/active`);
    const showAnswerRef=ref(database,`${id}/show_answer`);

    // Fetch current question number
    const snapshot = await get(questionNoRef);
    let currentQuestionNo = snapshot.val() || 0;

    const activeSnapshot = await get(quizActiveRef);
    const quizActive = activeSnapshot.val() || false;

    const showAnswerSnapshot = await get(showAnswerRef);
    const showAnswer = showAnswerSnapshot.val() || false;

    // Format question number to always have five digits
    const formattedQuestionNo = String(currentQuestionNo).padStart(5, "0");

    let time = new Date().getTime();
    // Construct the questionData object
    let constructedQuestionData = {
      text: text,
      optionA: optionA,
      optionB: optionB,
      optionC: optionC,
      optionD: optionD,
      correct: correct,
      timer: timer, // Include timer value
      createdAt: time,
    };

    // Replace spaces and question marks with underscores
    const replacedText = text.replace(/[\s?]/g, "_");
    const questionId = `${formattedQuestionNo}_${replacedText}`;

    // Update question number in Firebase
    await set(questionNoRef, currentQuestionNo + 1);
    await set(showAnswerRef,showAnswer);
    await set(quizActiveRef,quizActive);


    // Store the new question with the updated question number
    await set(ref(database, `${id}/questions/${questionId}`), constructedQuestionData);

    return NextResponse.json({ message: "Question added successfully" });
  } catch (error) {
    console.error("Error adding question: ", error);
    return NextResponse.json({ message: error.message, error: error.code }, { status: 500 });
  }
}
