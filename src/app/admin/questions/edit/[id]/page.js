"use client";
import React, { useState, useEffect } from "react";
import { getDatabase, ref, set, get } from "firebase/database";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import database from "@/firebase/config";
import { useRouter } from "next/navigation";
const EditQuestions = ({ params }) => {
  const questionId = params.id;
  const [questionData, setQuestionData] = useState({
    text: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correct: "",
  });
  const router = useRouter();

  useEffect(() => {
    const db = getDatabase();
    const questionRef = ref(db, `questions/${questionId}`);

    get(questionRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          setQuestionData(snapshot.val());
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
    setQuestionData({
      ...questionData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !questionData.text ||
      !questionData.optionA ||
      !questionData.optionB ||
      !questionData.optionC ||
      !questionData.optionD ||
      !questionData.correct
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    const db = getDatabase();
    set(ref(db, `questions/${questionId}`), questionData)
      .then(() => {
        toast.success("Question updated successfully!");
        setTimeout(() => {
          router.push("/admin/questions");
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
      <div className="flex flex-col items-center p-4">
        <h1 className="text-2xl font-bold mb-4">Edit Question</h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 w-full max-w-md"
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
            <label htmlFor="optionA" className="font-medium">
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
          <div className="flex flex-col gap-2">
            <label htmlFor="optionB" className="font-medium">
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
          <div className="flex flex-col gap-2">
            <label htmlFor="optionC" className="font-medium">
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
          <div className="flex flex-col gap-2">
            <label htmlFor="optionD" className="font-medium">
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
          <div className="flex flex-col gap-2">
            <label htmlFor="correct" className="font-medium">
              Correct Answer
            </label>
            <input
              type="text"
              name="correct"
              value={questionData.correct}
              onChange={handleChange}
              className="p-2 border rounded"
              placeholder="Enter the correct answer (e.g., optionA, optionB, etc.)"
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
