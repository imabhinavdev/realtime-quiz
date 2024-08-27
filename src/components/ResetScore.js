import React from "react";
import { ref, update, get } from "firebase/database";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import database from "@/firebase/config";

const ResetScore = ({ disabled = false, quizId }) => {
  const resetScores = () => {
    const db = database;

    // Fetch the list of users
    console.log(quizId)
    const usersRef = ref(db, `${quizId}/users`);
    getUsers(usersRef)
      .then((users) => {
        // Update the score of each user to 0
        users.forEach((user) => {
          const userRef = ref(db, `${quizId}/users/${user.id}`);
          update(userRef, { score: 0 })
            .then(() => { })
            .catch((error) => {
              console.error(
                `Error resetting score for user: ${user.name}`,
                error
              );
            });
        });
        toast.success(`Score reset for users successfully!`);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  };

  const getUsers = (usersRef) => {
    return new Promise((resolve, reject) => {
      // Fetch the list of users
      get(usersRef)
        .then((snapshot) => {
          const users = [];
          snapshot.forEach((childSnapshot) => {
            const user = {
              id: childSnapshot.key,
              ...childSnapshot.val(),
            };
            users.push(user);
          });
          resolve(users);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  return (
    <button
      onClick={resetScores}
      className={`bg-purple-500 text-white px-4 py-2 rounded-lg ${disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      disabled={disabled}
    >
      Reset Scores
    </button>
  );
};

export default ResetScore;
