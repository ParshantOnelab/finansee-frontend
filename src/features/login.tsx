import React, { useState } from 'react'
import { useLoginMutation } from '../store/api'
import { useNavigate } from 'react-router-dom'
import {setUserData} from "../store/reducers"
import { useDispatch } from 'react-redux'

function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()


    // const userdata = useSelector((state: RootState)=>state.user)
    const [login] = useLoginMutation()
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const data = await login({ email: formData.email, password: formData.password }).unwrap()
            // console.log(data,'data')
            alert('Login successful! Welcome to the dashboard.')
            navigate('/dashboard')
            dispatch(setUserData(data?.user))
            // console.log(document.cookie, 'cookie')
        } catch (error: any) {
            alert(error?.data?.message || 'Login failed. Please try again.')
            console.error('Login failed:', error)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-md">
                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-semibold text-gray-800">Login</h1>
                    <p className="text-sm text-gray-500 mt-1">Enter credentials to access the dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            placeholder="user@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 text-gray-600">
                            <input
                                type="checkbox"
                                name="remember-me"
                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                            />
                            Remember me
                        </label>
                        <a href="#" className="text-indigo-600 hover:underline">
                            Forgot password?
                        </a>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login
