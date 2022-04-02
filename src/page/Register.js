import axios from "axios"
import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { onChangeInputText } from "../helper"
import { API_URL } from "../helper/constants"

const Register = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const handleRegisterForm = async event => {
        event.preventDefault()

        try {
            await axios.post(`${API_URL}/auth/register`, {
                name, email, password, confirmPassword
            })

            navigate('/login')
        } catch ({ response }) {
            console.log(response.data)
            setError(response.data.message)
        }
    }


    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="px-8 py-6 mx-4 mt-4 text-left bg-white shadow-lg md:w-1/3 lg:w-1/3 sm:w-1/3">
                <h3 className="text-2xl font-bold text-center">Join us</h3>
                <form onSubmit={ handleRegisterForm }>
                    <div className="mt-4">
                        <div>
                            <label className="block" htmlFor="Name">Name</label>
                            <input type="text" placeholder="Name" defaultValue={ name }
                            onChange={event => onChangeInputText(event, setName)}
                            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"/>
                        </div>
                        <div className="mt-4">
                            <label className="block" htmlFor="email">Email</label>
                            <input type="text" placeholder="Email" defaultValue={ email }
                            onChange={event => onChangeInputText(event, setEmail)}
                            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"/>
                        </div>
                        <div className="mt-4">
                            <label className="block">Password</label>
                            <input type="password" placeholder="Password" defaultValue={ password }
                            onChange={event => onChangeInputText(event, setPassword)}
                            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"/>
                        </div>
                        <div className="mt-4">
                            <label className="block">Confirm Password</label>
                            <input type="password" placeholder="Password" defaultValue={ confirmPassword }
                            onChange={event => onChangeInputText(event, setConfirmPassword)}
                            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"/>
                        </div>
                        <span className="text-xs text-red-400">{error ?? "Password must be same!"}</span>
                        <div className="flex">
                            <button className="w-full px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900"
                            type="submit">
                                Create Account
                            </button>
                        </div>
                        <div className="mt-6 text-grey-dark">
                            Already have an account?
                            <Link className="text-blue-600 hover:underline ml-2" to="/login">
                                Log in
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register