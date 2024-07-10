"use client"
import Link from 'next/link'
import React, { useRef, useContext } from 'react'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useRouter } from 'next/navigation'
import { UserContext } from '@/context/UserContext'

const LoginPage = () => {
    const { user, setUser } = useContext(UserContext)
    const emailRef = useRef(null)
    const passwordRef = useRef(null)
    const router = useRouter()

    const handleSubmit = (e) => {
        e.preventDefault()
        const email = emailRef.current.value
        const password = passwordRef.current.value

        const submitLogin = async () => {
            const respone = await axios.post('/api/auth/login', {
                email,
                password
            }).then((res) => {
                if (res.data.token) {
                    setUser(res.data)
                    localStorage.setItem('user', JSON.stringify(res.data))
                    window.location.reload()
                }
                else {
                    toast.error(res.data.error)
                }
            }).catch((err) => {
                console.log(err)
                toast.error(err)
            })
        }

        submitLogin()
    }

    return (
        <>
            <ToastContainer />
            <main className="w-full flex flex-col items-center justify-center px-4">
                <div className="max-w-sm w-full text-gray-600 space-y-5">
                    <div className="text-center pb-8">
                        <div className="mt-5">
                            <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">Log in to your account</h3>
                        </div>
                    </div>
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="font-medium">
                                Email
                            </label>
                            <input
                                ref={emailRef}
                                type="email"
                                required
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="font-medium">
                                Password
                            </label>
                            <input
                                ref={passwordRef}
                                type="password"
                                required
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                            />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-x-3">
                                <input type="checkbox" id="remember-me-checkbox" className="checkbox-item peer hidden" />
                                <label
                                    htmlFor="remember-me-checkbox"
                                    className="relative flex w-5 h-5 bg-white peer-checked:bg-indigo-600 rounded-md border ring-offset-2 ring-indigo-600 duration-150 peer-active:ring cursor-pointer after:absolute after:inset-x-0 after:top-[3px] after:m-auto after:w-1.5 after:h-2.5 after:border-r-2 after:border-b-2 after:border-white after:rotate-45"
                                >
                                </label>
                                <span>Remember me</span>
                            </div>
                            <Link href=" " className="text-center text-indigo-600 hover:text-indigo-500">Forgot password?</Link>
                        </div>
                        <button
                            className="w-full px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150"
                        >
                            Sign in
                        </button>
                    </form>

                    <p className="text-center">Don&apos;t have an account? <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">Sign up</Link></p>
                </div>
            </main>
        </>
    )
}

export default LoginPage
