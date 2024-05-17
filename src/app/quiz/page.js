"use client";
import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue, get, child } from "firebase/database";
import database from "@/firebase/config";

const QuizApp = () => {
  const [questions, setQuestions] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [btnActive, setBtnActive] = useState(true);

  // useEffect(() => {
  //   const db = database;
  //   const questionsRef = ref(db, "current_question");

  //   const unsubscribe = onValue(
  //     questionsRef,
  //     (snapshot) => {
  //       const data = snapshot.val();
  //       setCurrentQuestion(data);
  //     },
  //     (error) => {
  //       console.error("Error fetching questions:", error);
  //     }
  //   );

  //   // // Cleanup function to unsubscribe from the database reference when the component unmounts
  //   return () => unsubscribe();
  // }, []);

  // useEffect(() => {
  //   // fetch the particular question from the database using get() function
  //   const db = database;
  //   const dbRef = ref(db);
  //   get(child(dbRef, `questions/${currentQuestion}`))
  //     .then((snapshot) => {
  //       if (snapshot.exists()) {
  //         setQuestions(snapshot.val());
  //       } else {
  //         console.log("No data available");
  //       }
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }, [currentQuestion]);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="p-4 flex flex-col gap-4 justify-center items-center">
      <div className="p-4 flex flex-col gap-4 shadow-2xl rounded-lg md:min-w-96">
        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4 ">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Question:
          </h1>
          <p className="text-xl text-gray-900 dark:text-gray-100">
            {/* {questions.text} */}
            What is the capital of India?
          </p>
          <fieldset>
            <legend className="sr-only">s</legend>
            <div className="flex items-center mb-4">
              <input
                id="country-option-1"
                type="radio"
                name="countries"
                defaultValue={questions.optionA}
                className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600"
                defaultChecked=""
              />
              <label
                htmlFor="country-option-1"
                className="block ms-2  text-md md:text-lg font-medium text-gray-900 dark:text-gray-300 cursor-pointer"
              >
                {/* {questions.optionA} */} Gujarat
              </label>
            </div>
            <div className="flex items-center mb-4">
              <input
                id="country-option-2"
                type="radio"
                name="countries"
                defaultValue={questions.optionB}
                className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="country-option-2"
                className="block ms-2 text-md md:text-lg font-medium text-gray-900 dark:text-gray-300 cursor-pointer"
              >
                {/* {questions.optionB} */} Delhi
              </label>
            </div>
            <div className="flex items-center mb-4">
              <input
                id="country-option-3"
                type="radio"
                name="countries"
                defaultValue={questions.optionC}
                className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="country-option-3"
                className="block ms-2 text-md md:text-lg font-medium text-gray-900 dark:text-gray-300 cursor-pointer"
              >
                {/* {questions.optionC} */} Uttar Pradesh
              </label>
            </div>
            <div className="flex items-center mb-4">
              <input
                id="country-option-4"
                type="radio"
                name="countries"
                defaultValue={questions.optionD}
                className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus-ring-blue-600 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="country-option-4"
                className="block ms-2 text-md md:text-lg font-medium text-gray-900 dark:text-gray-300 cursor-pointer"
              >
                {/* {questions.optionD} */} Maharashtra
              </label>
            </div>
          </fieldset>
          <button
            type="submit"
            disabled={!btnActive}
            onClick={() => setBtnActive(false)}
            className={`w-full p-2  text-white rounded-md ${
              !btnActive ? "bg-green-300" : "bg-green-500"
            } `}
          >
            Submit Answer
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuizApp;
