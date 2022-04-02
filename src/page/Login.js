import React, { useContext, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"
import { AuthContext } from "../contexts/AuthContext"
import { onChangeInputText } from "../helper"
import { API_URL } from "../helper/constants"

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)

    const navigate = useNavigate()
    const { loginHandle } = useContext(AuthContext)

    const handleLoginForm = async event => {
        event.preventDefault()

        try {
            const res = await axios.post(`${API_URL}/auth/login`, {
                email, password
            })
            const { data } = res.data

            loginHandle(data)
            navigate('/')
        } catch ({ response }) {
            console.log(response.data)
            setError(response.data.message)
        }
    }

    return (
        <div className="flex items-center justify-center py-20 bg-gray-100">
            <div className="px-8 py-6 mx-4 mt-4 text-left bg-white shadow-lg md:w-1/3 lg:w-1/3 sm:w-1/3">
                <h3 className="text-2xl font-bold text-center">Login</h3>
                <form onSubmit={ handleLoginForm }>
                    <div className="mt-4">
                        {error && (
                            <span className="text-md text-red-400">{ error }</span>
                        )}

                        <div className="mt-4">
                            <label className="block" htmlFor="email">Email</label>
                            <input type="text" placeholder="Email" defaultValue={ email } 
                            onChange={event => onChangeInputText(event, setEmail)}
                            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"/>
                        </div>
                        <div className="mt-4">
                            <label className="block" htmlFor="password">Password</label>
                            <input type="password" placeholder="Password" defaultValue={ password }
                            onChange={event => onChangeInputText(event, setPassword)}
                            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"/>
                        </div>
                        <div className="flex">
                            <button type="submit" 
                            className="w-full px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900">
                                Login
                            </button>
                        </div>
                        <div className="mt-6 text-grey-dark">
                            You don't have an account?
                            <Link className="text-blue-600 hover:underline ml-2" to="/register">
                                Register
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login