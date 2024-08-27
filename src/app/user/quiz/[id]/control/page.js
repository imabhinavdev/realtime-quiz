"use client";
import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue, set, get, update } from "firebase/database";
import database from "@/firebase/config";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import ResetScore from "@/components/ResetScore";
import { useParams } from "next/navigation";
const AdminQuizControlPage = () => {
    const { id } = useParams();
    const quizId = id
    const [quizActive, setQuizActive] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState("");
    const [questions, setQuestions] = useState([]);
    const [showAnswer, setShowAnswer] = useState(false);
    const [users, setUsers] = useState([]); // State to store users data

    useEffect(() => {
        const db = database;

        // Fetch quiz_active status from Firebase
        const quizActiveRef = ref(db, `${quizId}/quiz_active`);
        const unsubscribeQuizActive = onValue(quizActiveRef, (snapshot) => {
            const data = snapshot.val();
            setQuizActive(data);
        });

        // Fetch current_question from Firebase
        const currentQuestionRef = ref(db, `${quizId}/current_question`);
        const unsubscribeCurrentQuestion = onValue(
            currentQuestionRef,
            (snapshot) => {
                const data = snapshot.val();
                setCurrentQuestion(data);
            }
        );

        // Fetch showAnswer status from Firebase
        const showAnswerRef = ref(db, `${quizId}/showAnswer`);
        const unsubscribeShowAnswer = onValue(showAnswerRef, (snapshot) => {
            const data = snapshot.val();
            setShowAnswer(data);
        });

        // Fetch all questions from Firebase
        const questionsRef = ref(db, `${quizId}/questions`);
        get(questionsRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    setQuestions(Object.keys(data));
                } else {
                    console.log("No questions available");
                }
            })
            .catch((error) => {
                console.error("Error fetching questions:", error);
            });

        // Fetch all users from Firebase
        const usersRef = ref(db, `${quizId}/users`);
        const unsubscribeUsers = onValue(usersRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                // Convert the object of users into an array
                const usersArray = Object.entries(data).map(([key, value]) => ({
                    id: key,
                    ...value,
                }));
                setUsers(usersArray);
            } else {
                console.log("No users available");
            }
        });

        return () => {
            unsubscribeQuizActive();
            unsubscribeCurrentQuestion();
            unsubscribeShowAnswer();
            unsubscribeUsers();
        };
    }, []);

    const handleStartQuiz = () => {
        const db = database;
        set(ref(db, `${quizId}/quiz_active`), true);
        toast.success("Quiz started successfully");
        handleToggleShowAnswer(false); // Reset showAnswer status in Firebase
    };

    const handleStopQuiz = () => {
        const db = database;
        set(ref(db, `${quizId}/quiz_active`), false);
        toast.success("Quiz stopped successfully");
        handleToggleShowAnswer(false); // Reset showAnswer status in Firebase
    };

    const handleNextQuestion = () => {
        const currentIndex = questions.indexOf(currentQuestion);
        if (currentIndex < questions.length - 1) {
            const nextQuestion = questions[currentIndex + 1];
            const db = database;
            set(ref(db, `${quizId}/current_question`), nextQuestion);
            setShowAnswer(false); // Reset showAnswer to false
            handleToggleShowAnswer(false); // Reset showAnswer status in Firebase

            toast.success("Next question is set successfully");
        }
    };

    const handlePreviousQuestion = () => {
        const currentIndex = questions.indexOf(currentQuestion);
        if (currentIndex > 0) {
            const previousQuestion = questions[currentIndex - 1];
            const db = database;
            set(ref(db, `${quizId}/current_question`), previousQuestion);
            handleToggleShowAnswer(false); // Reset showAnswer status in Firebase

            setShowAnswer(false); // Reset showAnswer to false
            toast.success("Previous question is set successfully");
        }
    };

    const handleResetQuiz = () => {
        const db = database;
        if (questions.length > 0) {
            const firstQuestionId = questions[0];

            // Reset current question
            set(ref(db, `${quizId}/current_question`), firstQuestionId);

            // Reset showAnswer status
            setShowAnswer(false);
            handleToggleShowAnswer(false); // Reset showAnswer status in Firebase

            // Reset counts of options selected to 0 for all questions
            questions.forEach((questionId) => {
                const optionSelectedCountRef = ref(db, `${quizId}/questions/${questionId}`);
                const dataToUpdate = {
                    optionASelectedCount: 0,
                    optionBSelectedCount: 0,
                    optionCSelectedCount: 0,
                    optionDSelectedCount: 0,
                };
                update(optionSelectedCountRef, dataToUpdate);
            });

            // Reset scores of all users to 0
            users.forEach((user) => {
                const userRef = ref(db, `${quizId}/users/${user.id}`);
                update(userRef, { score: 0 })
                    .then(() => {
                    })
                    .catch((error) => {
                        console.error(`Error resetting score for user ${user.id}:`, error);
                    });
            });

            toast.success("Quiz reset successfully");
        } else {
            toast.error("No questions available to reset the quiz");
        }
    };

    const handleRemoveAllUsers = () => {
        const db = database;
        const usersRef = ref(db, `${quizId}/users`);
        set(usersRef, null)
            .then(() => {
                toast.success("All users removed successfully");
            })
            .catch((error) => {
                toast.error("Failed to remove users");
                console.error("Error removing users:", error);
            });
    };

    const handleToggleShowAnswer = (val) => {
        const db = database;
        const newShowAnswer = val;
        setShowAnswer(newShowAnswer);
        set(ref(db, `${quizId}/showAnswer`), newShowAnswer);
    };

    return (
        <>
            <div className="flex flex-col gap-6 w-full">
                <h1 className="text-2xl font-bold">Control Quiz</h1>
                <p>
                    You can control the quiz here like starting, stopping, resetting, and
                    navigating through the quiz questions.
                </p>
                <div className="grid gap-4 md:grid-cols-5 grid-cols-2">
                    <button
                        className={`bg-red-500 text-white px-4 py-2 rounded-lg ${!quizActive ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        onClick={handleStopQuiz}
                        disabled={!quizActive}
                    >
                        Stop Quiz
                    </button>
                    <button
                        className={`bg-green-500 text-white px-4 py-2 rounded-lg ${quizActive ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        onClick={handleStartQuiz}
                        disabled={quizActive}
                    >
                        Start Quiz
                    </button>
                    <button
                        className={`bg-gray-500 text-white px-4 py-2 rounded-lg ${quizActive ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        onClick={handleResetQuiz}
                        disabled={quizActive}
                    >
                        Reset Quiz
                    </button>
                    <ResetScore disabled={quizActive} quizId={quizId} />
                    <button
                        className={`bg-blue-500 text-white px-4 py-2 rounded-lg`}
                        onClick={() => {
                            handleToggleShowAnswer(!showAnswer);
                        }}
                    >
                        {showAnswer ? "Hide Answers" : "Show Answers"}
                    </button>
                    <button
                        className={`bg-red-600 text-white px-4 py-2 rounded-lg ${quizActive ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        onClick={handleRemoveAllUsers}
                        disabled={quizActive}
                    >
                        Remove All Users
                    </button>
                </div>
                <div className="flex gap-4 w-full">
                    <button
                        className={`bg-blue-600 text-white px-4 py-2 rounded-lg w-1/2 ${!quizActive || questions.indexOf(currentQuestion) === 0
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                            }`}
                        onClick={handlePreviousQuestion}
                        disabled={!quizActive || questions.indexOf(currentQuestion) === 0}
                    >
                        Previous Question
                    </button>
                    <button
                        className={`bg-blue-600 text-white px-4 py-2 rounded-lg w-1/2 ${!quizActive ||
                            questions.indexOf(currentQuestion) === questions.length - 1
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                            }`}
                        onClick={handleNextQuestion}
                        disabled={
                            !quizActive ||
                            questions.indexOf(currentQuestion) === questions.length - 1
                        }
                    >
                        Next Question
                    </button>
                </div>

                <div className="mt-6">
                    <h2 className="text-xl font-bold mb-2">Registered Users</h2>
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Total Users: {users.length}
                            </h3>
                        </div>
                        <div className="border-t border-gray-200">
                            <ul className="divide-y divide-gray-200">
                                {users.map((user, index) => (
                                    <li key={user.id}>
                                        <div className="flex items-center px-4 py-4 sm:px-6">
                                            <div className="min-w-0 flex-1 flex items-center">
                                                <div className="flex-shrink-0">{index + 1}</div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {user.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        ID: {decodeURIComponent(user.id)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminQuizControlPage;
