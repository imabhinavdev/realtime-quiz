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
    const usersQuery = query(usersRef, orderByChild("score"), limitToLast(10));

    const fetchData = () => {
      onValue(usersQuery, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          // Convert object of objects to array of objects
          const dataArray = Object.keys(data).map((key) => ({
            ...data[key],
            email: key,
          }));
          // Sort users based on score
          const sortedData = dataArray.sort((a, b) => b.score - a.score);
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
    <div className="max-w-md mx-auto p-6 bg-gray-100 rounded-md shadow-md">
      <h1 className="text-3xl font-bold text-center mb-6">Leaderboard</h1>
      <ol>
        {leaderboardData.map((user, index) => (
          <li
            key={user.email}
            className="flex justify-between items-center py-3 border-b"
          >
            <span className="font-bold">{index + 1}.</span>
            <span className="flex-grow ml-4">{user.name}</span>
            <span className="font-bold">{user.score}</span>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default LeaderBoardPage;
