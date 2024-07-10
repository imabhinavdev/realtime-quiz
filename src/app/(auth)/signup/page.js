"use client"

import { EyeCloseIcon, EyeIcon } from '@/utils/Icon'
import Link from 'next/link'
import React, { useState, useRef, useContext } from 'react'
import { ToastContainer, toast } from "react-toastify";

import 'react-toastify/dist/ReactToastify.css'
import { UserContext } from '@/context/UserContext'
import axios from 'axios'
import { useRouter } from 'next/navigation'

const Signup = () => {

    const { user, setUser } = useContext(UserContext);

    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()

    const togglePassword = () => {
        setShowPassword(!showPassword)
    }

    const emailRef = useRef(null)
    const passwordRef = useRef(null)
    const nameRef = useRef(null)

    const handleSubmit = (e) => {
        e.preventDefault()
        const email = emailRef.current.value
        const password = passwordRef.current.value
        const name = nameRef.current.value

        const submitSignup = async () => {
            try {
                const response = await axios.post('/api/auth/signup', {
                    email,
                    password,
                    name
                })

                if (response.data) {
                    toast.success(response.data)
                    localStorage.setItem('user', JSON.stringify(response.data.user))
                    setUser(response.data.user)
                    window.location.reload()
                } else {
                    toast.error(response.data.message)
                }
            } catch (error) {
                console.error(error)
            }
        }

        submitSignup()



    }



    return (
        <>
            <ToastContainer />
            <main className="w-full flex flex-col items-center justify-center bg-gray-50 sm:px-4 py-4">
                <div className="w-full space-y-6 text-gray-600 sm:max-w-md">
                    <div className="text-center">
                        <div className="mt-5 space-y-2">
                            <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">Create an account</h3>
                            <p className="">Already have an account? <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Log in</Link></p>
                        </div>
                    </div>
                    <div className="bg-white shadow p-4 py-6 sm:p-6 sm:rounded-lg">
                        <form
                            className="space-y-5"
                            autoComplete="off"
                            onSubmit={handleSubmit}

                        >
                            <div>
                                <label className="font-medium">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    ref={nameRef}
                                    required
                                    autoComplete="off"
                                    className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="font-medium">
                                    Email
                                </label>
                                <input
                                    ref={emailRef}
                                    type="email"
                                    required
                                    autoComplete="off"
                                    className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="font-medium">
                                    Password
                                </label>
                                <div className='flex w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border shadow-sm rounded-lg'>
                                    <input
                                        ref={passwordRef}
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        autoComplete="off"
                                        className="w-full bg-transparent focus:outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePassword}
                                        className="focus:outline-none"
                                    >
                                        {!showPassword ? <EyeIcon className="w-6 h-6 text-gray-500" /> : <EyeCloseIcon className="w-6 h-6 text-gray-500" />}
                                    </button>
                                </div>
                            </div>
                            <button
                                className="w-full px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150"
                            >
                                Create account
                            </button>
                        </form>


                    </div>
                </div>
            </main>
        </>
    )
}

export default Signup