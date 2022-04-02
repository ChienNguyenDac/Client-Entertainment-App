import React, { useContext, useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import SideBar from "../component/SideBar"
import { AuthContext } from "../contexts/AuthContext"

const Message = () => {
    const [users, setUsers] = useState([])
    const { user, socketRef } = useContext(AuthContext)

    useEffect(() => {
        socketRef.current.removeListener('receive-msg')
        socketRef.current.on('receive-msg', ({ message, sender }) => {
            console.log(message)
            const idx = users.findIndex(user => user._id === sender._id)
            console.log(idx, user, users)

            if (idx > -1) {
                setUsers(users => [
                    ...users.slice(0, idx),
                    {
                        ...users[idx],
                        messages: [
                            message,
                            ...users[idx].messages
                        ]
                    },
                    ...users.slice(idx+1)
                ])
            }
        })
    }, [ users ])

    return (
        <div className="min-w-full border rounded lg:grid lg:grid-cols-3">
            <div className="border-r border-gray-300 lg:col-span-1">
                <SideBar users={ users } updateUser={ setUsers }/>
            </div>
			<div className="hidden lg:col-span-2 lg:block">
                <Outlet/>
			</div>
      </div>
    )
}

export default Message