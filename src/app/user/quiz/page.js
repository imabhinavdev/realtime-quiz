"use client";
import SectionHeaders from '@/components/SectionHeaders';
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '@/context/UserContext';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
const UserQuiz = () => {

    const user = localStorage.getItem('user');
    const id = JSON.parse(user).user._id;
    useEffect(() => {
        if (user) {
            const fetchQuizes = async () => {
                const res = await axios.get(`/api/quiz?admin=${id}`).then((res) => {
                    setQuizes(res.data.quiz);
                    setLoading(false);
                }
                ).catch((err) => {
                    console.log(err);
                });

            };
            fetchQuizes();
        }
    }, []);


    const [quizes, setQuizes] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleDelete = async (quizId) => {
        const res = await axios.delete(`/api/quiz?id=${quizId}&admin=${id}`).then((res) => {
            toast.success(res.data.message);
            const newQuizes = quizes.filter((quiz) => quiz._id !== quizId);
            setQuizes(newQuizes);
        }
        ).catch((err) => {
            toast.error(err);
        });

    }



    return (
        <div className="flex flex-col items-center w-full">
            <div className="w-full">
                <SectionHeaders title="Manage Quiz" btnLink="/user/quiz/add" btnText="Create New Quiz" />
            </div>
            <div className="w-full mt-4">
                {quizes ? <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {quizes.map((quiz, index) => {
                            return (
                                <div key={index} className="bg-white shadow-md p-4 rounded-lg">
                                    <h4 className="text-lg font-semibold">{quiz.name}</h4>
                                    <Link href={`http://localhost:3000/quiz/${quiz._id}/`} className="text-sm line-clamp-1 text-gray-500">http://localhost:3000/quiz/{quiz._id}/</Link>
                                    <div className="mt-4">
                                        <Link href={`/user/quiz/${quiz._id}`} className="bg-blue-500 text-white px-3 py-1 rounded-full">Edit</Link>

                                        <Link href={`/user/quiz/${quiz._id}/control`} className="bg-green-500 text-white px-3 py-1 rounded-full ml-2">Control</Link>
                                        <button onClick={() => {
                                            handleDelete(quiz._id);
                                        }} className="bg-red-500 text-white px-3 py-1 rounded-full ml-2">Delete</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </> :
                    <div className="flex justify-center items-center h-64">
                        <p className="text-gray-500">No Quiz Found</p>
                    </div>}
            </div>
        </div>
    );
};

export default UserQuiz;
