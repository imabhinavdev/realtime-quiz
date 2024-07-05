"use client"

import { EyeCloseIcon, EyeIcon } from '@/utils/Icon'
import Link from 'next/link'
import React, { useState } from 'react'

const Signup = () => {


    const [showPassword, setShowPassword] = useState(false)

    const togglePassword = () => {
        setShowPassword(!showPassword)
    }


    return (
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
                        autocomplete="off"
                    >
                        <div>
                            <label className="font-medium">
                                Name
                            </label>
                            <input
                                type="text"
                                required
                                autocomplete="off"
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="font-medium">
                                Email
                            </label>
                            <input
                                type="email"
                                required
                                autocomplete="off"
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="font-medium">
                                Password
                            </label>
                            <div className='flex w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border shadow-sm rounded-lg'>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    autocomplete="off"
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
    )
}

export default Signup