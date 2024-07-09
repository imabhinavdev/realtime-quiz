"use client";
import React, { useState } from "react";
import { getDatabase, ref, set, get } from "firebase/database";
import database from "@/firebase/config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

const AddQuestions = () => {
  const { id } = useParams();
  const quizId = id;
  const [questionData, setQuestionData] = useState({
    text: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correct: "", // For storing the correct option
    timer: 10, // Default timer value
  });
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestionData({
      ...questionData,
      [name]: value,
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

    // Add the question to the database
    const postData = async () => {
      const resp = await axios.post(`/api/questions?id=${quizId}`, questionData).then((res) => {
        toast.success("Question added successfully");
        router.push(`/user/quiz/${quizId}`);
      }
      ).catch((error) => {
        toast.error("Error adding question");
      });


    }
    postData();
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

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col items-center bg-white w-full rounded-lg p-4">
        <h1 className="text-2xl font-bold mb-4">Add Question</h1>
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
                value={questionData.optionA}
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
                value={questionData.optionB}
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
                value={questionData.optionC}
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
                value={questionData.optionD}
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
            Add Question
          </button>
        </form>
      </div>
    </>
  );
};

export default AddQuestions;
