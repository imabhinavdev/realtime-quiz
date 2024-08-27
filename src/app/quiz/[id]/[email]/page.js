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
import { useParams } from "next/navigation";

const QuizApp = ({ params }) => {
  const email = decodeURIComponent(params.email);
  const { id } = useParams();
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

  const encodeEmail = (email) => {
    return email.replace(/\./g, "%2E");
  };

  useEffect(() => {
    // Reset user score to 0 on page refresh
    const resetUserScore = () => {
      const db = database;
      const encodedEmail = encodeEmail(email);
      const userScoreRef = ref(db, `${id}/users/${encodedEmail}/score`);
      set(userScoreRef, 0)
        .then(() => {
          console.log("User score reset to 0.");
        })
        .catch((error) => {
          console.error("Error resetting user score:", error);
        });
    };

    resetUserScore();

    // Delay updating the progress bar's width until after the component has mounted
    setTimeout(() => {
      setBarWidth(100); // Update the width to 100 after a delay
    }, 1000); // Adjust the delay time as needed
  }, []);

  useEffect(() => {
    const db = database;
    const quizActiveRef = ref(db, `${id}/quiz_active`);
    const currentQuestionRef = ref(db, `${id}/current_question`);
    const showAnswerRef = ref(db, `${id}/showAnswer`);

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
      const currentQuestionRef = ref(db, `${id}/questions/${currentQuestion}`);
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
      get(child(dbRef, `${id}/questions/${currentQuestion}`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            const questionData = snapshot.val();
            setQuestions(questionData);
            setSelectedAnswer("");
            setBtnActive(true);
            setTimeLeft(questionData.timer || 10); // Set timer dynamically
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
    } else if (timeLeft === 0 && selectedAnswer) {
      handleSubmit(); // Automatically submit the answer if the timer runs out
    }

    return () => clearTimeout(timer); // Clear the timer when the component unmounts
  }, [timeLeft, quizActive]);

  const handleAnswerChange = (e) => {
    setSelectedAnswer(e.target.value);
  };

  const handleSubmit = (e) => {
    e?.preventDefault(); // Prevent default only if an event is passed
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
    const userScoreRef = ref(db, `${id}/users/${email}`);
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
      `${id}/questions/${questionId}/${selectedOption}SelectedCount`
    );
    get(optionSelectedCountRef)
      .then((snapshot) => {
        const count = snapshot.val() || 0;
        const updatedCount = count + 1; // Increase count by 1
        set(optionSelectedCountRef, updatedCount) // Set the count directly in the database
          .then(() => { })
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
      <div className="text-black text-xl text-center p-8 bg-gray-100 shadow-md rounded-lg">
        <p className="text-lg mb-2">Please wait until the quiz starts. Kindly do not refresh the page.</p>
        <p className="text-md text-gray-700">Your email: <span className="font-bold">{email}</span></p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r  flex items-center justify-center">
      <div className="p-6 bg-white shadow-lg rounded-lg w-full max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-800">Question:</h1>

          <p className="text-lg text-gray-800 whitespace-pre-wrap">{questions.text}</p>

          <div className="flex items-center flex-col">
            <p className="text-xl font-semibold text-red-600 mb-2">Time Left: {timeLeft}</p>

            {Object.keys(questions).length > 0 && (


              <progress
                className="w-full h-2 bg-gray-200 rounded-md overflow-hidden translate-all ease-out duration-2000"
                value={timeLeft}
                max={questions.timer || 10} // Set max value dynamically
              ></progress>
            )}
          </div>

          <fieldset className="space-y-4">
            <legend className="sr-only">Choose an answer</legend>
            {questions.optionA && (
              <div className={`flex items-center p-4 cursor-pointer rounded-lg border-2 ${showAnswer && questions.correct === "optionA" ? "bg-green-100 border-green-500" : showAnswer && selectedAnswer === "optionA" ? "bg-red-100 border-red-500" : "border-gray-300"}`}>
                <input
                  id="optionA"
                  type="radio"
                  name="answers"
                  value="optionA"
                  checked={selectedAnswer === "optionA"}
                  onChange={handleAnswerChange}
                  disabled={!btnActive}
                  className="w-5 h-5 border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="optionA" className="ml-3 cursor-pointer  text-lg font-medium text-gray-900">{questions.optionA}</label>
                {showAnswer && (
                  <span className="ml-3 bg-black text-white px-2 py-1 rounded-full">{optionASelectedCount}</span>
                )}
              </div>
            )}

            {questions.optionB && (
              <div className={`flex items-center cursor-pointer p-4 rounded-lg border-2 ${showAnswer && questions.correct === "optionB" ? "bg-green-100 border-green-500" : showAnswer && selectedAnswer === "optionB" ? "bg-red-100 border-red-500" : "border-gray-300"}`}>
                <input
                  id="optionB"
                  type="radio"
                  name="answers"
                  value="optionB"
                  checked={selectedAnswer === "optionB"}
                  onChange={handleAnswerChange}
                  disabled={!btnActive}
                  className="w-5 h-5 border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="optionB" className="ml-3 cursor-pointer text-lg font-medium text-gray-900">{questions.optionB}</label>
                {showAnswer && (
                  <span className="ml-3 bg-black text-white px-2 py-1 rounded-full">{optionBSelectedCount}</span>
                )}
              </div>
            )}

            {questions.optionC && (
              <div className={`flex items-center p-4 cursor-pointer rounded-lg border-2 ${showAnswer && questions.correct === "optionC" ? "bg-green-100 border-green-500" : showAnswer && selectedAnswer === "optionC" ? "bg-red-100 border-red-500" : "border-gray-300"}`}>
                <input
                  id="optionC"
                  type="radio"
                  name="answers"
                  value="optionC"
                  checked={selectedAnswer === "optionC"}
                  onChange={handleAnswerChange}
                  disabled={!btnActive}
                  className="w-5 h-5 border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="optionC" className="ml-3 cursor-pointer text-lg font-medium text-gray-900">{questions.optionC}</label>
                {showAnswer && (
                  <span className="ml-3 bg-black text-white px-2 py-1 rounded-full">{optionCSelectedCount}</span>
                )}
              </div>
            )}

            {questions.optionD && (
              <div className={`flex items-center p-4  cursor-pointer rounded-lg border-2 ${showAnswer && questions.correct === "optionD" ? "bg-green-100 border-green-500" : showAnswer && selectedAnswer === "optionD" ? "bg-red-100 border-red-500" : "border-gray-300"}`}>
                <input
                  id="optionD"
                  type="radio"
                  name="answers"
                  value="optionD"
                  checked={selectedAnswer === "optionD"}
                  onChange={handleAnswerChange}
                  disabled={!btnActive}
                  className="w-5 h-5 border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="optionD" className="ml-3 text-lg cursor-pointer font-medium text-gray-900">{questions.optionD}</label>
                {showAnswer && (
                  <span className="ml-3 bg-black text-white px-2 py-1 rounded-full">{optionDSelectedCount}</span>
                )}
              </div>
            )}
          </fieldset>

          <button
            type="submit"
            disabled={!btnActive || !selectedAnswer}
            className={`w-full p-3 text-lg font-medium text-white rounded-md ${!btnActive || !selectedAnswer ? "bg-green-300 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"} transition duration-300`}
          >
            Submit Answer
          </button>
        </form>
        <div className="mt-6 text-gray-800 text-lg text-center">
          <p>Your email: <span className="font-semibold">{email}</span></p>
        </div>
      </div>
    </div>
  );
};

export default QuizApp;