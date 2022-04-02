import React, { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { onChangeInputText } from "../helper"
import { customAlphabet } from "nanoid"
import { AuthContext } from "../contexts/AuthContext"

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 20)

const Caro = () => {
    const [id, setId] = useState('')
    const { socketRef } = useContext(AuthContext)
    const navigate = useNavigate()

    const createNewRoomHandle = () => {
        const roomId = nanoid()

        socketRef.current.emit('create-room', roomId)
        navigate(`/caro/${roomId}`)
    }

    return (
        <div className="text-center">
            <input type="text" placeholder="Room ID" defaultValue={ id } 
            onChange={event => onChangeInputText(event, setId)}
            className="w-min px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"/>
            <button onClick={() => navigate(`/caro/${id}`)}
            className="w-max px-6 py-2 ml-4 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900">
                Join Room
            </button>
            <div>
                <button onClick={ createNewRoomHandle }
                className="w-max px-6 py-2 mt-4 text-white bg-green-600 rounded-lg hover:bg-green-900">
                    Create New Room
                </button>
            </div>
        </div>
    )
}

export default Caro