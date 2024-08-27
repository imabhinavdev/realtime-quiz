"use client";
import React, { useState } from "react";
import { getDatabase, ref, set, get } from "firebase/database";
import { useParams, useRouter } from "next/navigation";
import database from "@/firebase/config"; // Adjust the path as necessary
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const QuizRegister = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();
  const { id } = useParams();

  const encodeEmail = (email) => {
    return email.replace(/\./g, "%2E");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const db = database;
    const encodedEmail = encodeEmail(email);

    try {
      const userRef = ref(db, `${id}/users/${encodedEmail}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        toast.info("Email is already registered.");
        router.push(`/quiz/${id}/${email}`);
      } else {
        await set(userRef, { name: name, score: 0 });
        toast.success("Registered successfully!");
        setTimeout(() => {
          router.push(`/quiz/${id}/${encodedEmail}`);
        }, 1500);
      }
    } catch (error) {
      toast.error("Error registering. Please try again.");
      console.error("Error registering user:", error);
    }
  };

  return (
    <main className="w-full flex flex-col items-center justify-center px-4">
      <div className="max-w-sm w-full text-gray-600">
        <div className="text-center">
          <div className="mt-5 space-y-2">
            <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">
              Register for Quiz
            </h3>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
            />
          </div>
          <div>
            <label className="font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150"
          >
            Start Quiz
          </button>
        </form>
      </div>
    </main>
  );
};

export default QuizRegister;
