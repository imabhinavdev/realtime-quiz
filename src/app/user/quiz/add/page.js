"use client"
import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddQuiz = () => {
    const [user, setUser] = useState(null);
    const router = useRouter();
    const nameRef = useRef(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const tempUser = JSON.parse(storedUser);
            setUser(tempUser.user);
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const name = nameRef.current.value;
        const submitQuiz = async () => {
            if (user) {
                const id = user._id;
                try {
                    const res = await axios.post(`/api/quiz?admin=${id}`, { name });
                    toast.success(res.data.message);
                    router.push('/user/quiz');
                } catch (err) {
                    toast.error(err.response ? err.response.data.message : err.message);
                }
            } else {
                toast.error("User not found.");
            }
        };
        submitQuiz();
    };

    return (
        <>
            <div className='w-full '>
                <h1 className='text-2xl font-semibold'>Create New Quiz</h1>
                <form className='mt-4' onSubmit={handleSubmit}>
                    <div className='flex flex-col'>
                        <label htmlFor='name' className='text-sm'>Quiz Name</label>
                        <input type='text' name='name' ref={nameRef} className='border border-gray-300 rounded-md p-2 mt-1' required />
                    </div>
                    <div className='mt-4'>
                        <button type='submit' className='bg-blue-500 text-white px-3 py-1 rounded-md'>Create Quiz</button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default AddQuiz;
