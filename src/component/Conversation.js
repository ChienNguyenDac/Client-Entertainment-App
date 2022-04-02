import axios from "axios"
import React, { useContext, useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"

import { AuthContext } from "../contexts/AuthContext"
import { onChangeInputText } from "../helper"
import { API_URL, FaceIcon, LinkIcon, SendIcon, VoiceIcon } from "../helper/constants"
import Avatar from "../asset/img/avatar.jpg"


const Message = ({ isSender = false, content }) => (
    <li className={"flex " + (isSender ? "justify-end" : "justify-start")}>
        <div className={"relative max-w-xl px-4 py-2 text-gray-700 rounded shadow"
        + (isSender ? " bg-gray-100" : "")}>
            <span className="block">{ content }</span>
        </div>
    </li>
)


const Conversation = () => {
    const { conversationId } = useParams()
    const [conversation, setConversation] = useState(null)
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState('')
    const { socketRef, user } = useContext(AuthContext)
    const messageEndRef = useRef(null)

    const scrollToBottom = () => {
        console.log("run")
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    const getMessageFromConversation = async () => {
        try {
            const res = await axios.get(`${API_URL}/conversation/${conversationId}/get-message`)
            const { data } = res.data
            
            setMessages(data)
        } catch (error) {
            console.log(error)
        }
    }

    const getConversation = async () => {
        try {
            const res = await axios.get(`${API_URL}/conversation/${conversationId}`)
            const { data } = res.data
            data.members = data.members.filter(member => member._id !== user._id)
            setConversation(data)
        } catch (error) {
            console.log(error)
        }
    }

    const handleSendMessageForm = async event => {
        event.preventDefault()
        if (!message) {
            return
        }
        try {
            await axios.post(`${API_URL}/message/create`, {
                conversation: conversationId,
                sender: user._id,
                content: message
            })
            setMessages(messages => ([
                ...messages,
                {
                    content: message,
                    sender: user._id
                }
            ]))
    
            socketRef.current.emit('send-msg', {
                message: message,
                to: conversation.members[0]._id
            })

            socketRef.current.emit('send-msg-to-conversation', {
                message, conversationId
            })
            setMessage('')
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        scrollToBottom()
        const socket = socketRef.current

        const run = async () => {
            socket.emit('join-conversation', conversationId)
            await getConversation()
            await getMessageFromConversation()
        }
        run()

        // Leave from conversation
        return () => {
            socket.emit('leave-conversation', conversationId)
        }
    }, [ conversationId ])

    useEffect(() => {
        socketRef.current.removeListener('receive-msg-from-conversation')
        socketRef.current.on('receive-msg-from-conversation', ({message, sender}) => {
            setMessages(messages => ([
                ...messages,
                {
                    content: message,
                    sender: sender._id
                }
            ]))
        })
        scrollToBottom()
    }, [ messages ])

    return (
        <div className="w-full">
            <div className="relative flex items-center p-3 border-b border-gray-300">
                <img className="object-cover w-10 h-10 rounded-full"
                src={ Avatar } alt="username" />
                <span className="block ml-2 font-bold text-gray-600">{ conversation?.members[0].name }</span>
                <span className="absolute w-3 h-3 bg-green-600 rounded-full left-10 top-3"></span>
            </div>
            <div className="relative w-full p-6 overflow-y-auto h-[29rem]">
                <ul className="space-y-2">
                    {messages.map((message,idx) => 
                        <Message key={idx} isSender={message.sender === user._id} content={message.content}/>
                    )}
                </ul>
                <div ref={ messageEndRef }/>
            </div>

            <form onSubmit={ handleSendMessageForm }
            className="flex items-center justify-between w-full p-3 border-t border-gray-300">
                <button>
                    <FaceIcon width="20px" height="20px"/>
                </button>
                <button className="ml-2">
                    <LinkIcon width="20px" height="20px"/>
                </button>

                <input type="text" placeholder="Message" value={ message } 
                onChange={event => onChangeInputText(event, setMessage)}
                className="block w-full py-2 pl-4 mx-3 bg-gray-100 rounded-full outline-none focus:text-gray-700"/>
                <button>
                    <VoiceIcon width="20px" height="20px"/>
                </button>
                <button type="submit" className="ml-2">
                    <SendIcon width="20px" height="20px"/>
                </button>
            </form>
        </div>
    )
}

export default Conversation