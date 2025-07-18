import React, { useEffect, useState } from 'react'
import { useLoginMutation, useAuthenticateQuery } from '../store/api'
import { useNavigate } from 'react-router-dom'
import { setIsAdminLoggedIn, setUserRole } from '../store/reducers'
import { useDispatch } from 'react-redux'
import { motion } from 'framer-motion'

function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [login] = useLoginMutation()

    const { data: authData, isLoading: authLoading } = useAuthenticateQuery({
        refetchOnMountOrArgChange: true,
    })

    useEffect(() => {
        if (!authLoading && authData) {
            navigate('/dashboard')
        }
    }, [authData, authLoading, navigate])
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
            dispatch(setUserRole(data?.user?.role))
            if (data?.user?.role === "Admin") dispatch(setIsAdminLoggedIn("Yes"))
            navigate('/dashboard')
            alert('Login successful! Welcome to the dashboard.')
        } catch (error: unknown) {
            type ErrorWithMessage = { data?: { message?: string } };
            if (typeof error === 'object' && error && 'data' in error && typeof (error as ErrorWithMessage).data?.message === 'string') {
                alert((error as ErrorWithMessage).data!.message!);
            } else {
                alert('Login failed. Please try again.');
            }
            console.error('Login failed:', error)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <motion.div
                className="w-full max-w-sm p-8 bg-white rounded-lg shadow-md"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
                <motion.div
                    className="mb-6 text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h1 className="text-3xl font-semibold text-gray-800">Login</h1>
                    <p className="text-sm text-gray-500 mt-1">Enter credentials to access the dashboard</p>
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-black"
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-black"
                        />
                    </motion.div>

                    <motion.button
                        type="submit"
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.02 }}
                        className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                        transition={{ type: 'spring', stiffness: 300 }}
                    >
                        Sign In
                    </motion.button>
                </form>
            </motion.div>
        </div>
    )
}

export default Login
