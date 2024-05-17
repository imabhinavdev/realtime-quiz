"use client";
import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue, set, get, child } from "firebase/database";
import database from "@/firebase/config";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

const AdminQuizControlPage = () => {
  const [quizActive, setQuizActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const db = getDatabase();

    // Fetch quiz_active status from Firebase
    const quizActiveRef = ref(db, "quiz_active");
    const unsubscribeQuizActive = onValue(quizActiveRef, (snapshot) => {
      const data = snapshot.val();
      setQuizActive(data);
    });

    // Fetch current_question from Firebase
    const currentQuestionRef = ref(db, "current_question");
    const unsubscribeCurrentQuestion = onValue(
      currentQuestionRef,
      (snapshot) => {
        const data = snapshot.val();
        setCurrentQuestion(data);
      }
    );

    // Fetch all questions from Firebase
    const questionsRef = ref(db, "questions");
    get(questionsRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setQuestions(Object.keys(data));
        } else {
          console.log("No questions available");
        }
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
      });

    return () => {
      unsubscribeQuizActive();
      unsubscribeCurrentQuestion();
    };
  }, []);

  const handleStartQuiz = () => {
    const db = getDatabase();
    set(ref(db, "quiz_active"), true);
    toast.success("Quiz started successfully");
  };

  const handleStopQuiz = () => {
    const db = getDatabase();
    set(ref(db, "quiz_active"), false);
    toast.success("Quiz stopped successfully");
  };

  const handleNextQuestion = () => {
    const currentIndex = questions.indexOf(currentQuestion);
    if (currentIndex < questions.length - 1) {
      const nextQuestion = questions[currentIndex + 1];
      const db = getDatabase();
      set(ref(db, "current_question"), nextQuestion);
      toast.success("Next question is set successfully");
    }
  };

  const handlePreviousQuestion = () => {
    const currentIndex = questions.indexOf(currentQuestion);
    if (currentIndex > 0) {
      const previousQuestion = questions[currentIndex - 1];
      const db = getDatabase();
      set(ref(db, "current_question"), previousQuestion);
      toast.success("Previous question is set successfully");
    }
  };

  const handleResetQuiz = () => {
    const db = getDatabase();
    if (questions.length > 0) {
      const firstQuestionId = questions[0];
      set(ref(db, "current_question"), firstQuestionId);
      toast.success("Quiz reset successfully");
    } else {
      toast.error("No questions available to reset the quiz");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col gap-6 w-full">
        <h1 className="text-2xl font-bold">Control Quiz</h1>
        <p>
          You can control the quiz here like starting, stopping, resetting, and
          navigating through the quiz questions.
        </p>
        <div className="flex gap-4">
          <button
            className={`bg-red-500 text-white px-4 py-2 rounded-lg ${
              !quizActive ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleStopQuiz}
            disabled={!quizActive}
          >
            Stop Quiz
          </button>
          <button
            className={`bg-green-500 text-white px-4 py-2 rounded-lg ${
              quizActive ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleStartQuiz}
            disabled={quizActive}
          >
            Start Quiz
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-lg"
            onClick={handleResetQuiz}
            disabled={quizActive}
          >
            Reset Quiz
          </button>
        </div>
        <div className="flex gap-4 w-full">
          <button
            className={`bg-blue-600 text-white px-4 py-2 rounded-lg w-1/2 ${
              !quizActive || questions.indexOf(currentQuestion) === 0
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={handlePreviousQuestion}
            disabled={!quizActive || questions.indexOf(currentQuestion) === 0}
          >
            Previous Question
          </button>
          <button
            className={`bg-blue-600 text-white px-4 py-2 rounded-lg w-1/2 ${
              !quizActive ||
              questions.indexOf(currentQuestion) === questions.length - 1
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={handleNextQuestion}
            disabled={
              !quizActive ||
              questions.indexOf(currentQuestion) === questions.length - 1
            }
          >
            Next Question
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminQuizControlPage;
