import React, { useContext, useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { AuthContext } from "../../contexts/AuthContext"
import Spinner from "../../UI/Spinner"

const PrivateRoute = () => {
    const { checkAuthenticated } = useContext(AuthContext)
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()
    
    useEffect(() => {
        const check = checkAuthenticated()
        if (!check) {
            navigate('/login')
        } else {
            setIsLoading(false)
        }
    }, [])

    return isLoading ? (
        <div className="w-min mx-auto my-20">
            <Spinner size="large" color="blue"/>
        </div>
    ) : <Outlet/>
}

export default PrivateRoute