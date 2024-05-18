"use client";
import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue, get, child } from "firebase/database";
import database from "@/firebase/config";

const QuizApp = () => {
  const [questions, setQuestions] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [btnActive, setBtnActive] = useState(true);
  const [quizActive, setQuizActive] = useState(false); // State to manage quiz active status

  useEffect(() => {
    const db = database;
    const quizActiveRef = ref(db, "quiz/quiz_active");
    const currentQuestionRef = ref(db, "quiz/current_question");

    const unsubscribeQuizActive = onValue(
      quizActiveRef,
      (snapshot) => {
        const data = snapshot.val();
        setQuizActive(data);
      },
      (error) => {
        console.error("Error fetching quiz active status:", error);
      }
    );

    const unsubscribeCurrentQuestion = onValue(
      currentQuestionRef,
      (snapshot) => {
        const data = snapshot.val();
        setCurrentQuestion(data);
      },
      (error) => {
        console.error("Error fetching current question:", error);
      }
    );

    return () => {
      unsubscribeQuizActive();
      unsubscribeCurrentQuestion();
    };
  }, []);

  useEffect(() => {
    if (quizActive) {
      const db = database;
      const dbRef = ref(db);
      get(child(dbRef, `quiz/questions/${currentQuestion}`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            setQuestions(snapshot.val());
            setSelectedAnswer(""); // Reset selected answer
            setBtnActive(true); // Re-enable the button
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [currentQuestion, quizActive]);

  const handleAnswerChange = (e) => {
    setSelectedAnswer(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setBtnActive(false);
  };

  if (!quizActive) {
    return (
      <div className="text-red-600 text-xl flex items-center ">
        <p>The quiz is not active at the moment or has been ended !</p>
      </div>
    );
  }

  return (
    <div>
      <div className="md:flex justify-center">
        <div className="p-4 flex flex-col gap-4 shadow-2xl rounded-lg md:min-w-96">
          <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Question:</h1>
            <p className="text-xl text-gray-900">{questions.text}</p>
            <fieldset>
              <legend className="sr-only">s</legend>
              <div className="flex items-center mb-4">
                <input
                  id="optionA"
                  type="radio"
                  name="answers"
                  value="optionA"
                  checked={selectedAnswer === "optionA"}
                  onChange={handleAnswerChange}
                  className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600"
                />
                <label
                  htmlFor="optionA"
                  className="block ms-2 text-md md:text-lg font-medium text-gray-900 cursor-pointer"
                >
                  {questions.optionA}
                </label>
              </div>
              <div className="flex items-center mb-4">
                <input
                  id="optionB"
                  type="radio"
                  name="answers"
                  value="optionB"
                  checked={selectedAnswer === "optionB"}
                  onChange={handleAnswerChange}
                  className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600"
                />
                <label
                  htmlFor="optionB"
                  className="block ms-2 text-md md:text-lg font-medium text-gray-900 cursor-pointer"
                >
                  {questions.optionB}
                </label>
              </div>
              <div className="flex items-center mb-4">
                <input
                  id="optionC"
                  type="radio"
                  name="answers"
                  value="optionC"
                  checked={selectedAnswer === "optionC"}
                  onChange={handleAnswerChange}
                  className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300"
                />
                <label
                  htmlFor="optionC"
                  className="block ms-2 text-md md:text-lg font-medium text-gray-900 cursor-pointer"
                >
                  {questions.optionC}
                </label>
              </div>
              <div className="flex items-center mb-4">
                <input
                  id="optionD"
                  type="radio"
                  name="answers"
                  value="optionD"
                  checked={selectedAnswer === "optionD"}
                  onChange={handleAnswerChange}
                  className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300"
                />
                <label
                  htmlFor="optionD"
                  className="block ms-2 text-md md:text-lg font-medium text-gray-900 cursor-pointer"
                >
                  {questions.optionD}
                </label>
              </div>
            </fieldset>
            <button
              type="submit"
              disabled={!btnActive || selectedAnswer.length === 0}
              className={`w-full p-2 text-white rounded-md ${
                !btnActive || selectedAnswer.length === 0
                  ? "bg-green-300"
                  : "bg-green-500"
              }`}
            >
              Submit Answer
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuizApp;
