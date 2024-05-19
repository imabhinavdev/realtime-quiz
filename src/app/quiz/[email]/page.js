"use client";
import React, { useEffect, useState } from "react";
import {
  getDatabase,
  ref,
  onValue,
  get,
  child,
  update,
  set,
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
  const [optionASelectedCount, setOptionASelectedCount] = useState(0);
  const [optionBSelectedCount, setOptionBSelectedCount] = useState(0);
  const [optionCSelectedCount, setOptionCSelectedCount] = useState(0);
  const [optionDSelectedCount, setOptionDSelectedCount] = useState(0);
  const [barWidth, setBarWidth] = useState(100);
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    // Delay updating the progress bar's width until after the component has mounted
    setTimeout(() => {
      setBarWidth(100); // Update the width to 100 after a delay
    }, 1000); // Adjust the delay time as needed
  }, []);

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
            data.optionASelectedCount ? data.optionASelectedCount : 0
          );
          setOptionBSelectedCount(
            data.optionBSelectedCount ? data.optionBSelectedCount : 0
          );
          setOptionCSelectedCount(
            data.optionCSelectedCount ? data.optionCSelectedCount : 0
          );
          setOptionDSelectedCount(
            data.optionDSelectedCount ? data.optionDSelectedCount : 0
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
            const questionData = snapshot.val();
            setQuestions(questionData);
            setSelectedAnswer("");
            setBtnActive(true);
            setTimeLeft(questionData.timer || 10); // Set timer dynamically
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
    if (quizActive && timeLeft > 0) {
      setTimer(
        setTimeout(() => {
          setTimeLeft((prevTime) => prevTime - 1);
        }, 1000)
      );
    } else {
      // If time runs out, set time left to 0 and stop the timer
      setTimeLeft(0);
      setBtnActive(false);
    }

    return () => clearTimeout(timer); // Clear the timer when the component unmounts
  }, [timeLeft, quizActive]);

  const handleAnswerChange = (e) => {
    setSelectedAnswer(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setBtnActive(false);

    // Check if the selected answer is correct
    const isCorrect = questions.correct === selectedAnswer;

    // Clear the timer
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
        set(optionSelectedCountRef, updatedCount) // Set the count directly in the database
          .then(() => {
            console.log("Option selected count updated successfully.");
          })
          .catch((error) => {
            console.error("Error updating option selected count:", error);
          });
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
            <div className="flex items-start flex-col">
              <p className="text-red-600 font-semibold mr-2">
                Time Left: {timeLeft}
              </p>

              {Object.keys(questions).length > 0 && (
                <progress
                  className="w-full h-2 bg-gray-200 rounded-md overflow-hidden translate-all ease-out duration-2000"
                  value={timeLeft}
                  max={questions.timer || 10} // Set max value dynamically
                >
                  <div
                    className="h-full text-yellow-500"
                    style={{
                      width: `${(timeLeft / (questions.timer || 10)) * 100}%`, // Adjust width based on timeLeft
                    }}
                  ></div>
                </progress>
              )}
            </div>
            <fieldset>
              <legend className="sr-only">s</legend>
              {questions.optionA && (
                <div
                  className={`flex items-center mb-4 rounded-lg p-2 ${
                    showAnswer && questions.correct === "optionA"
                      ? "bg-green-400"
                      : showAnswer && selectedAnswer === "optionA"
                      ? "bg-red-400"
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
                      : showAnswer && selectedAnswer === "optionB"
                      ? "bg-red-400"
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
                      : showAnswer && selectedAnswer === "optionC"
                      ? "bg-red-400"
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
                      : showAnswer && selectedAnswer === "optionD"
                      ? "bg-red-400"
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
