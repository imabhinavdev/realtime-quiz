"use client";
import React, { useEffect, useState } from "react";
import {
  getDatabase,
  ref,
  orderByChild,
  limitToLast,
  onValue,
  query,
  off,
} from "firebase/database";
import database from "@/firebase/config";

const LeaderBoardPage = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    const db = database;
    const usersRef = ref(db, "users");
    const usersQuery = query(
      usersRef,
      orderByChild("lastAnswered"),
      limitToLast(10)
    );

    const fetchData = () => {
      onValue(usersQuery, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          // Convert object of objects to array of objects
          const dataArray = Object.keys(data).map((key) => ({
            ...data[key],
            email: key,
          }));

          // Sort users based on score in descending order
          const sortedByScore = dataArray.sort((a, b) => b.score - a.score);

          // Find the maximum score
          const maxScore =
            sortedByScore.length > 0 ? sortedByScore[0].score : 0;

          // Further sort by lastAnswered (least recently answered first) if score is the same
          const sortedData = sortedByScore.sort((a, b) => {
            if (a.score === maxScore && b.score === maxScore) {
              // Convert lastAnswered to milliseconds for comparison
              const lastAnsweredA = new Date(a.lastAnswered).getTime();
              const lastAnsweredB = new Date(b.lastAnswered).getTime();
              return lastAnsweredA - lastAnsweredB;
            } else {
              // Users with different scores should remain in their sorted order
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

  return (
    <div className=" w-full p-6 bg-gray-100 rounded-md shadow-md">
      <h1 className="text-3xl font-bold text-center mb-6">Leaderboard</h1>
      <ol>
        {leaderboardData.map((user, index) => (
          <li
            key={user.email}
            className="flex justify-between items-center py-3 border-b text-2xl"
          >
            <span className="font-bold">{index + 1}.</span>
            <span className="flex-grow ml-4 ">{user.name}</span>
            <span className="font-bold ">{user.score}</span>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default LeaderBoardPage;
