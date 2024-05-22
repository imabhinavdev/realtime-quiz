"use client";
import React, { useState, useEffect } from "react";
import { getDatabase, ref, set, get } from "firebase/database";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import database from "@/firebase/config";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

const EditQuestions = () => {
  let { id } = useParams(); // Assuming you have set up routing to pass `id` as a parameter
  id = decodeURIComponent(id);

  const questionId = decodeURIComponent(id);
  const [questionData, setQuestionData] = useState({
    text: "",
    correct: "",
    timer: 10, // Default timer value
  });
  const [options, setOptions] = useState({
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
  });
  const router = useRouter();

  useEffect(() => {
    const db = database;
    const questionRef = ref(db, `/quiz/questions/${questionId}`);

    get(questionRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setQuestionData({
            text: data.text,
            correct: data.correct,
            timer: data.timer || 10, // Set timer value if it exists, otherwise default to 10
          });
          setOptions({
            optionA: data.optionA || "",
            optionB: data.optionB || "",
            optionC: data.optionC || "",
            optionD: data.optionD || "",
          });
        } else {
          toast.error("Question not found");
        }
      })
      .catch((error) => {
        toast.error("Failed to fetch question data");
        console.error("Error fetching question data:", error);
      });
  }, [questionId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "text" || name === "correct" || name === "timer") {
      setQuestionData({
        ...questionData,
        [name]: value,
      });
    } else {
      setOptions({
        ...options,
        [name]: value,
      });
    }
  };

  const handleOptionChange = (e) => {
    const { value } = e.target;
    setQuestionData({
      ...questionData,
      correct: value,
    });
  };

  const handleTimerChange = (e) => {
    let timerValue = parseInt(e.target.value);
    if (timerValue < 10) {
      timerValue = 10; // Minimum timer value is 10 seconds
    }
    setQuestionData({
      ...questionData,
      timer: timerValue,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if question text, correct answer, and timer are filled
    if (
      !questionData.text ||
      !questionData.correct ||
      questionData.timer < 10
    ) {
      toast.error(
        "Please fill in the question text, select the correct option, and set the timer (minimum 10 seconds)."
      );
      return;
    }

    // Construct the questionData object
    let constructedQuestionData = {
      text: questionData.text,
      optionA: options.optionA,
      optionB: options.optionB,
      optionC: options.optionC,
      optionD: options.optionD,
      correct: questionData.correct,
      timer: questionData.timer,
      updatedAt: new Date().getTime(),
    };

    const db = getDatabase();
    set(ref(db, `quiz/questions/${questionId}`), constructedQuestionData)
      .then(() => {
        toast.success("Question updated successfully!");
        setTimeout(() => {
          router.push("/mainhuadmin/questions");
        }, 1500);
      })
      .catch((error) => {
        toast.error("Failed to update question. Please try again.");
        console.error("Error updating question:", error);
      });
  };

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col items-center bg-white w-full rounded-lg p-4">
        <h1 className="text-2xl font-bold mb-4">Edit Question</h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 w-full max-w-lg"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="text" className="font-medium">
              Question Text
            </label>
            <input
              type="text"
              name="text"
              value={questionData.text}
              onChange={handleChange}
              className="p-2 border rounded"
              placeholder="Enter the question text"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium">Options</label>
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="correct"
                  value="optionA"
                  checked={questionData.correct === "optionA"}
                  onChange={handleOptionChange}
                />
                Option A
              </label>
              <input
                type="text"
                name="optionA"
                value={options.optionA}
                onChange={handleChange}
                className="p-2 border rounded"
                placeholder="Enter option A"
              />
            </div>
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="correct"
                  value="optionB"
                  checked={questionData.correct === "optionB"}
                  onChange={handleOptionChange}
                />
                Option B
              </label>
              <input
                type="text"
                name="optionB"
                value={options.optionB}
                onChange={handleChange}
                className="p-2 border rounded"
                placeholder="Enter option B"
              />
            </div>
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="correct"
                  value="optionC"
                  checked={questionData.correct === "optionC"}
                  onChange={handleOptionChange}
                />
                Option C
              </label>
              <input
                type="text"
                name="optionC"
                value={options.optionC}
                onChange={handleChange}
                className="p-2 border rounded"
                placeholder="Enter option C"
              />
            </div>
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="correct"
                  value="optionD"
                  checked={questionData.correct === "optionD"}
                  onChange={handleOptionChange}
                />
                Option D
              </label>
              <input
                type="text"
                name="optionD"
                value={options.optionD}
                onChange={handleChange}
                className="p-2 border rounded"
                placeholder="Enter option D"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="timer" className="font-medium">
              Timer (seconds)
            </label>
            <input
              type="number"
              name="timer"
              value={questionData.timer}
              onChange={handleTimerChange}
              className="p-2 border rounded"
              min="10"
              placeholder="Enter the timer value (minimum 10)"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Update Question
          </button>
        </form>
      </div>
    </>
  );
};

export default EditQuestions;
