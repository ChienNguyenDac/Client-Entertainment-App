import React, { useContext, useEffect, useState } from "react"
import Avatar from "../asset/img/avatar.jpg"
import { AuthContext } from "../contexts/AuthContext"
import { convertUserData } from "../helper/index"
import { API_URL, SearchIcon } from "../helper/constants"
import { NavLink, useNavigate } from "react-router-dom"
import axios from "axios"


const SideBarItem = ({ receiver, time, messages, avatar }) => {
    const [conversationId, setConversationId] = useState(null)
    const { user } = useContext(AuthContext)
    const navigate = useNavigate()

    const getClassName = isActive => 
    "flex items-center px-3 py-2 text-sm transition duration-150 ease-in-out border-b border-gray-300 cursor-pointer focus:outline-none"
    + (isActive ? " bg-gray-100 border-r-4 border-r-blue-300" : " hover:bg-gray-100")

    const handleNavigate = async event => {
        event.preventDefault()
        if (!conversationId) {
            const createConversationId = await createConversation()
            navigate(`/${createConversationId}`)
        } else {
            navigate(`/${conversationId}`)
        }
    }

    const getConversation = async () => {
        try {
            const res = await axios.post(`${API_URL}/conversation/get-by-member`, {
                members: [
                    user._id, receiver._id
                ]
            })

            const { data } = res.data
            console.log(user._id, receiver._id)
            if (data[0]) {
                setConversationId(data[0]._id)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const createConversation = async () => {
        try {
            const res = await axios.post(`${API_URL}/conversation/create`, {
                members: [
                    user._id, receiver._id
                ]
            })

            const { data } = res.data
            setConversationId(data._id)

            return data._id
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => getConversation(), [])
    
    return (
        <NavLink className={({ isActive }) => getClassName(isActive)} 
        to={conversationId ? `/${conversationId}` : '/create'} onClick={ handleNavigate }>
            <img className="object-cover w-10 h-10 rounded-full" src={ Avatar } alt="username" />
            <div className="w-full pb-2">
                <div className="flex justify-between">
                <span className="block ml-2 font-semibold text-gray-600">{ receiver.name }</span>
                <span className="block ml-2 text-sm text-green-800">{ time }</span>
                </div>
                <span className="block ml-2 text-sm text-gray-600">{ messages[0] }</span>
            </div>
        </NavLink>
    )
}

const SideBar = ({ getConversation, users, updateUser }) => {
    const { socketRef } = useContext(AuthContext)

    useEffect(() => {
        socketRef.current.on('update-user', data => {
            console.log(data)
            const Users = data.users.map(convertUserData)
            console.log(Users)
            updateUser(users => [...users, ...Users])
        })

        socketRef.current.on('remove-user', ({ socketId }) => {
            updateUser(users => users.filter(user => user.socketId !== socketId))
        })
    }, [])

    return (
        <>
            <div className="mx-3 my-3">
                <div className="relative text-gray-600">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                        <SearchIcon width="20px" height="20px"/>
                    </span>
                    <input type="search" className="block w-full py-2 pl-10 bg-gray-100 rounded outline-none" name="search"
                    placeholder="Search" required />
                </div>
            </div>

            <ul className="overflow-auto h-[32rem]">
                <h2 className="my-2 mb-2 ml-2 text-lg text-gray-600">Chats</h2>
                <li>
                    {users.map((user, idx) => (
                        <SideBarItem key={ idx } receiver={ user }
                        messages={ user.messages } time={ user.lastOnline }/>
                    ))}
                </li>
            </ul>
        </>
    )
}

export default SideBar