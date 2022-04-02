import { createContext, useRef, useState } from "react"
import { io } from "socket.io-client"
import { API_BASE_URL, LOCAL_STORAGE_KEY } from "../helper/constants"

export const AuthContext = createContext()

const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const socketRef = useRef()
    
    const checkAuthenticated = () => {
        const localUser = user ?? JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
        if (!user && !localUser) {
            return false
        } else if (!user) {
            setUser(localUser)
        }
        if (!socketRef.current) {
            socketRef.current = io.connect(API_BASE_URL)
            socketRef.current.emit('add-user', localUser._id, localUser.name)
        }
        return true
    }

    const loginHandle = user => {
        setUser(user)
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user))
    }

    const logoutHandle = () => {
        setUser(null)
        localStorage.removeItem(LOCAL_STORAGE_KEY)
    }

    return (
        <AuthContext.Provider value={{user, socketRef, checkAuthenticated, loginHandle, logoutHandle}}>
            { children }
        </AuthContext.Provider>
    )
}

export default AuthContextProvider