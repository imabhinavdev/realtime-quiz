"use client";
import React, { useEffect, useState } from "react";
import {
  getDatabase,
  ref,
  onValue,
  get,
  child,
  update,
} from "firebase/database";
import database from "@/firebase/config";

const QuizApp = ({ params }) => {
  const email = decodeURIComponent(params.email);
  const [questions, setQuestions] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [btnActive, setBtnActive] = useState(true);
  const [quizActive, setQuizActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timer, setTimer] = useState(null); // Declare timer state
  const [optionASelectedCount, setOptionASelectedCount] = useState(0);
  const [optionBSelectedCount, setOptionBSelectedCount] = useState(0);
  const [optionCSelectedCount, setOptionCSelectedCount] = useState(0);
  const [optionDSelectedCount, setOptionDSelectedCount] = useState(0);

  const encodeEmail = (email) => {
    return email.replace(/\./g, "%2E");
  };

  useEffect(() => {
    const db = database;
    const quizActiveRef = ref(db, "quiz/quiz_active");
    const currentQuestionRef = ref(db, "quiz/current_question");
    const showAnswerRef = ref(db, "quiz/showAnswer");

    const unsubscribeShowAnswer = onValue(
      showAnswerRef,
      (snapshot) => {
        const data = snapshot.val();
        setShowAnswer(data);
      },
      (error) => {
        console.error("Error fetching show answer status:", error);
      }
    );

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
      unsubscribeShowAnswer();
    };
  }, []);

  useEffect(() => {
    if (quizActive && currentQuestion != null) {
      const db = database;
      const currentQuestionRef = ref(db, `quiz/questions/${currentQuestion}`);
      get(currentQuestionRef)
        .then((snapshot) => {
          const data = snapshot.val();
          setOptionASelectedCount(
            data.optionASelectedCount
              ? data.optionASelectedCount.optionASelectedCount
              : 0
          );
          setOptionBSelectedCount(
            data.optionBSelectedCount
              ? data.optionBSelectedCount.optionBSelectedCount
              : 0
          );
          setOptionCSelectedCount(
            data.optionCSelectedCount
              ? data.optionCSelectedCount.optionCSelectedCount
              : 0
          );
          setOptionDSelectedCount(
            data.optionDSelectedCount
              ? data.optionDSelectedCount.optionDSelectedCount
              : 0
          );
        })
        .catch((error) => {
          console.error("Error fetching current question:", error);
        });
    }
  }, [showAnswer]);

  useEffect(() => {
    if (quizActive && currentQuestion !== null) {
      const db = database;
      const dbRef = ref(db);
      get(child(dbRef, `quiz/questions/${currentQuestion}`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            setQuestions(snapshot.val());
            setSelectedAnswer("");
            setBtnActive(true);
            setTimeLeft(10);
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [currentQuestion, quizActive]);

  useEffect(() => {
    let timer; // Declare timer variable within useEffect

    if (quizActive && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else {
      setBtnActive(false);
    }

    setTimer(timer); // Set timer state

    return () => clearTimeout(timer);
  }, [timeLeft, quizActive]);

  const handleAnswerChange = (e) => {
    setSelectedAnswer(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setBtnActive(false);

    // Check if the selected answer is correct
    const isCorrect = questions.correct === selectedAnswer;

    clearTimeout(timer);

    if (isCorrect) {
      updateScore(email);
    }

    // Update the count of selected option
    updateOptionSelectedCount(currentQuestion, selectedAnswer);
  };

  const updateScore = (email) => {
    const db = database;
    email = encodeEmail(email);
    const userScoreRef = ref(db, `users/${email}`);
    get(userScoreRef)
      .then((snapshot) => {
        const userData = snapshot.val();
        const newScore = (userData.score || 0) + 1; // Increment the score by 1
        const newTime = new Date().getTime();
        update(userScoreRef, { score: newScore, lastAnswered: newTime }); // Update the score in the database
      })
      .catch((error) => {
        console.error("Error updating user score:", error);
      });
  };

  const updateOptionSelectedCount = (questionId, selectedOption) => {
    const db = database;
    const optionSelectedCountRef = ref(
      db,
      `quiz/questions/${questionId}/${selectedOption}SelectedCount`
    );
    get(optionSelectedCountRef)
      .then((snapshot) => {
        const count = snapshot.val() || 0;
        const updatedCount = count + 1; // Increase count by 1
        update(optionSelectedCountRef, updatedCount); // Update the count in the database directly without creating an object
      })
      .catch((error) => {
        if (error.code === "PERMISSION_DENIED") {
          console.error("Permission denied to update count.");
        } else {
          console.error("Error updating option selected count:", error);
        }
      });
  };


  if (!quizActive) {
    return (
      <div className="text-red-600 text-xl">
        <p>The quiz is not active at the moment or has been ended!</p>
        <p>Your email is {email}</p>
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
            <div className="flex items-center">
              <p className="text-red-600 font-semibold mr-2">
                Time Left: {timeLeft}
              </p>
            </div>
            <fieldset>
              <legend className="sr-only">s</legend>
              {questions.optionA && (
                <div
                  className={`flex items-center mb-4 rounded-lg p-2 ${
                    showAnswer && questions.correct === "optionA"
                      ? "bg-green-400"
                      : ""
                  }`}
                >
                  <input
                    id="optionA"
                    type="radio"
                    name="answers"
                    value="optionA"
                    checked={selectedAnswer === "optionA"}
                    onChange={handleAnswerChange}
                    className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600"
                  />
                  <div className="flex w-full justify-between h-full items-center">
                    <label
                      htmlFor="optionA"
                      className={`block ms-2 text-md md:text-lg font-medium text-gray-900 cursor-pointer `}
                    >
                      {questions.optionA}
                    </label>
                    {showAnswer && (
                      <p className="bg-black text-white p-1 px-3 rounded-full">
                        {optionASelectedCount}
                      </p>
                    )}
                  </div>
                </div>
              )}
              {questions.optionB && (
                <div
                  className={`flex items-center mb-4 rounded-lg p-2 ${
                    showAnswer && questions.correct === "optionB"
                      ? "bg-green-400"
                      : ""
                  }`}
                >
                  <input
                    id="optionB"
                    type="radio"
                    name="answers"
                    value="optionB"
                    checked={selectedAnswer === "optionB"}
                    onChange={handleAnswerChange}
                    className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600"
                  />
                  <div className="flex w-full justify-between h-full items-center">
                    <label
                      htmlFor="optionB"
                      className={`block ms-2 text-md md:text-lg font-medium text-gray-900 cursor-pointer `}
                    >
                      {questions.optionB}
                    </label>
                    {showAnswer && (
                      <p className="bg-black text-white p-1 px-3 rounded-full">
                        {optionBSelectedCount}
                      </p>
                    )}
                  </div>
                </div>
              )}
              {questions.optionC && (
                <div
                  className={`flex items-center mb-4 rounded-lg p-2 ${
                    showAnswer && questions.correct === "optionC"
                      ? "bg-green-400"
                      : ""
                  }`}
                >
                  <input
                    id="optionC"
                    type="radio"
                    name="answers"
                    value="optionC"
                    checked={selectedAnswer === "optionC"}
                    onChange={handleAnswerChange}
                    className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300"
                  />
                  <div className="flex w-full justify-between h-full items-center">
                    <label
                      htmlFor="optionC"
                      className={`block ms-2 text-md md:text-lg font-medium text-gray-900 cursor-pointer `}
                    >
                      {questions.optionC}
                    </label>
                    {showAnswer && (
                      <p className="bg-black text-white p-1 px-3 rounded-full">
                        {optionCSelectedCount}
                      </p>
                    )}
                  </div>
                </div>
              )}
              {questions.optionD && (
                <div
                  className={`flex items-center mb-4 rounded-lg p-2 ${
                    showAnswer && questions.correct === "optionD"
                      ? "bg-green-400"
                      : ""
                  }`}
                >
                  <input
                    id="optionD"
                    type="radio"
                    name="answers"
                    value="optionD"
                    checked={selectedAnswer === "optionD"}
                    onChange={handleAnswerChange}
                    className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300"
                  />
                  <div className="flex w-full justify-between h-full items-center">
                    <label
                      htmlFor="optionD"
                      className={`block ms-2 text-md md:text-lg font-medium text-gray-900 cursor-pointer `}
                    >
                      {questions.optionD}
                    </label>
                    {showAnswer && (
                      <p className="bg-black text-white p-1 px-3 rounded-full">
                        {optionDSelectedCount}
                      </p>
                    )}
                  </div>
                </div>
              )}
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
