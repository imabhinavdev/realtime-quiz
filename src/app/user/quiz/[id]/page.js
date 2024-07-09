"use client";
import React, { useState, useEffect } from "react";
import { getDatabase, ref, get, remove } from "firebase/database";
import database from "@/firebase/config";
import Link from "next/link";
import ConfirmationModal from "@/components/ConfirmationModal";
import { useParams } from "next/navigation";

const ControlPage = () => {
  const [questions, setQuestions] = useState({});
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const { id } = useParams();
  const quizId = id


  useEffect(() => {
    const db = database;
    const questionsRef = ref(db, `${quizId}/questions`);



    get(questionsRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          setQuestions(snapshot.val());
        } else {
          console.log("No questions available");
        }
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
      });
  }, []);

  const handleDeleteQuestion = (questionId) => {
    const db = database;
    const questionRef = ref(db, `${quizId}/questions/${questionId}`);

    // Remove the question data from the database
    remove(questionRef)
      .then(() => {
        // Remove the question from the local state
        const updatedQuestions = { ...questions };
        delete updatedQuestions[questionId];
        setQuestions(updatedQuestions);
      })
      .catch((error) => {
        console.error("Error deleting question:", error);
      });
  };

  const handleOpenConfirmationModal = (questionId) => {
    setSelectedQuestion(questionId);
  };

  const handleCloseConfirmationModal = () => {
    setSelectedQuestion(null);
  };

  return (
    <div className="w-full">
      <div className="w-full">
        <div className="max-w-md flex flex-col gap-4">
          <h1 className="text-gray-800 text-xl font-extrabold sm:text-2xl">
            Questions
          </h1>
          <p className="text-gray-600 mt-2">
            Extend and automate your workflow by using integrations for your
            favorite tools.
          </p>
          <span>
            <Link
              href={`/user/quiz/${quizId}/add`}
              className="p-2 bg-blue-700 text-white rounded-full px-4"
            >
              Add Question
            </Link>
          </span>
        </div>
      </div>
      {Object.keys(questions).length > 0 ? (
        <ul className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(questions).map(([id, question]) => (
            <li key={id} className="border rounded-lg">
              <div className="flex items-start justify-between p-6">
                <div className="space-y-2">
                  <h4 className="text-gray-800 font-semibold">
                    {question.text}
                  </h4>
                  <p className="text-sm">{question.correct}</p>
                  <p className="text-sm">{question.timer}</p>
                </div>
                <Link
                  href={`/user/quiz/${quizId}/edit/${id}`}
                  className="text-gray-700 text-sm border rounded-lg px-3 mx-2 py-2 duration-150 hover:bg-gray-100"
                >
                  Edit
                </Link>
              </div>
              <button
                onClick={() => handleOpenConfirmationModal(id)}
                className="text-red-500 ml-4 p-2"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No questions available</p>
      )}
      {selectedQuestion && (
        <ConfirmationModal
          questionId={selectedQuestion}
          onDelete={handleDeleteQuestion}
          onClose={handleCloseConfirmationModal}
        />
      )}
      <section className="py-16"></section>
    </div>
  );
};

export default ControlPage;
