"use client";
import React, { useState, useEffect } from "react";
import { getDatabase, ref, get } from "firebase/database";
import database from "@/firebase/config";
import Link from "next/link";

const ControlPage = () => {
  const [questions, setQuestions] = useState({});

  useEffect(() => {
    const db = database;
    const questionsRef = ref(db, "questions");

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

  return (
    <div className="">
      <div className="">
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
              href="/admin/questions/add"
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
            <>
              <li className="border rounded-lg">
                <div className="flex items-start justify-between p-6">
                  <div className="space-y-2">
                    <h4 className="text-gray-800 font-semibold">
                      {question.text}
                    </h4>
                    <p className="text-sm">{question.correct}</p>
                  </div>
                  <Link
                    href={`/admin/questions/edit/${id}`}
                    className="text-gray-700 text-sm border rounded-lg px-3 mx-2 py-2 duration-150 hover:bg-gray-100"
                  >
                    Edit
                  </Link>
                </div>
              </li>
            </>
          ))}
        </ul>
      ) : (
        <p>No questions available</p>
      )}
      <section className="py-16"></section>
    </div>
  );
};

export default ControlPage;
