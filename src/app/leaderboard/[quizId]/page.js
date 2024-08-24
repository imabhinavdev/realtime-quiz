"use client";
import React, { useEffect, useState } from "react";
import {
  getDatabase,
  ref,
  orderByChild,
  onValue,
  query,
  off,
} from "firebase/database";
import database from "@/firebase/config";
import { useParams } from "next/navigation";
import jsPDF from "jspdf";
import "jspdf-autotable";

const LeaderBoardPage = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const { quizId } = useParams();

  useEffect(() => {
    const db = database;
    const usersRef = ref(db, `/${quizId}/users`);
    const usersQuery = query(usersRef, orderByChild("lastAnswered"));

    const fetchData = () => {
      onValue(usersQuery, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const dataArray = Object.keys(data).map((key) => ({
            ...data[key],
            email: key,
          }));

          const sortedByScore = dataArray.sort((a, b) => b.score - a.score);

          const maxScore = sortedByScore.length > 0 ? sortedByScore[0].score : 0;

          const sortedData = sortedByScore.sort((a, b) => {
            if (a.score === maxScore && b.score === maxScore) {
              const lastAnsweredA = new Date(a.lastAnswered).getTime();
              const lastAnsweredB = new Date(b.lastAnswered).getTime();
              return lastAnsweredA - lastAnsweredB;
            } else {
              return 0;
            }
          });

          setLeaderboardData(sortedData);
        }
      });
    };

    fetchData();

    return () => {
      off(usersQuery);
    };
  }, []);

  const downloadPDF = () => {
    const doc = new jsPDF();

    // Add quiz name and date
    doc.setFontSize(20);
    doc.text("Quiz Name: " + quizId, 20, 20);
    doc.setFontSize(12);
    doc.text("Date: " + new Date().toLocaleDateString(), 20, 30);

    // Add table
    const tableColumn = ["Rank", "Name", "Score"];
    const tableRows = [];

    leaderboardData.forEach((user, index) => {
      const userData = [index + 1, user.name, user.score];
      tableRows.push(userData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 40 });

    doc.save(`leaderboard_${quizId}.pdf`);
  };

  return (
    <div className="w-full p-6 bg-gray-100 rounded-md shadow-md">
      <h1 className="text-3xl font-bold text-center mb-6">Leaderboard</h1>
      <ol>
        {leaderboardData.map((user, index) => (
          <li
            key={user.email}
            className="flex justify-between items-center py-3 border-b text-2xl"
          >
            <span className="font-bold">{index + 1}.</span>
            <span className="flex-grow ml-4">{user.name}</span>
            <span className="font-bold">{user.score}</span>
          </li>
        ))}
      </ol>
      <button
        className="mt-6 p-2 bg-blue-500 text-white rounded"
        onClick={downloadPDF}
      >
        Download PDF
      </button>
    </div>
  );
};

export default LeaderBoardPage;
