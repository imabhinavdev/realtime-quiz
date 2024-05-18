"use client";
import React, { useState } from "react";
import { getDatabase, ref, set } from "firebase/database";
import database from "@/firebase/config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

const AddQuestions = () => {
  const [questionData, setQuestionData] = useState({
    text: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correct: "", // For storing the correct option
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

    // Check if question text and correct answer are filled
    if (!questionData.text || !questionData.correct) {
      toast.error(
        "Please fill in the question text and select the correct option."
      );
      return;
    }

    let time = new Date().getTime();
    // Construct the questionData object
    let constructedQuestionData = {
      text: questionData.text,
      optionA: questionData.optionA,
      optionB: questionData.optionB,
      optionC: questionData.optionC,
      optionD: questionData.optionD,
      correct: questionData.correct,
      createdAt: time,
    };

    const questionId = questionData.text.split(" ").join("_");

    const db = getDatabase();
    set(ref(db, `quiz/questions/${questionId}`), constructedQuestionData)
      .then(() => {
        toast.success("Question added successfully!");
        setTimeout(() => {
          router.push("/admin/questions");
        }, 1500);
        setQuestionData({
          text: "",
          optionA: "",
          optionB: "",
          optionC: "",
          optionD: "",
          correct: "",
        });
      })
      .catch((error) => {
        toast.error("Failed to add question. Please try again.");
        console.error("Error adding question: ", error);
      });
  };

  const handleOptionChange = (e) => {
    const { value } = e.target;
    setQuestionData({
      ...questionData,
      correct: value,
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
