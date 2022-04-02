import React, { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"
import { OIcon, XIcon } from "../helper/constants"
import Spinner from "../UI/Spinner"

const GameState = {
    WAITING: 'waiting',
    MY_TURN: 'my-turn',
    OTHER_TURN: 'other-turn',
    WIN: 'win',
    LOSE: 'lose'
}

const CaroGamePlay = () => {
    const { roomId } = useParams()
    const { socketRef, user } = useContext(AuthContext)
    const [board, setBoard] = useState(null)
    const [players, setPlayers] = useState([])
    const [own, setOwn] = useState(null)
    const [gameState, setGameState] = useState(GameState.WAITING)

    const clickEvent = (x, y) => {
        setBoard(board => board.map((row, i) => (
            row.map((col, j) => {
                if(i === x && j === y) {
                    return own.type
                } else {
                    return col
                }
            })
        )))
        setGameState(GameState.OTHER_TURN)
        const own = players.find(player => player._id === user._id)

        socketRef.current.emit('game-play', {
            roomId, x, y,
            value: own.type
        })
    }

    const isMyTurn = () => gameState === GameState.MY_TURN

    useEffect(() => {
        const client = socketRef.current

        client.on('game-start', ({ players, board }) => {
            const own = players.find(player => player._id === user._id)
            setOwn(own)

            if (own.isGoingFirst) {
                setGameState(GameState.MY_TURN)
            } else {
                setGameState(GameState.OTHER_TURN)
            }

            setPlayers(players)
            setBoard(board)
        })

        client.emit('join-room', {
            roomId,
            userId: user._id,
            userName: user.name
        })


        client.on('game-update', board => {
            setBoard(board)
            setGameState(GameState.MY_TURN)
        })

        return () => {
            client.emit('leave-room', {
                roomId,
                userId: user._id
            })
        }
    }, [])

    useEffect(() => {
        socketRef.current.removeListener("game-over")
        socketRef.current.on('game-over', winner => {
            if (winner === own.type) {
                setGameState(GameState.WIN)
                alert('YOU WIN !!!')
            } else {
                setGameState(GameState.LOSE)
                alert('YOU LOSE !!!')
            }
        })
    }, [ own ])

    return (
        <div className="text-center relative">
            {board ? board.map((row, x) => (
                <div className="flex justify-center">
                    {row.map((col, y) => (
                        <div onClick={(!col && isMyTurn()) ? (() => clickEvent(x, y)) : () => {}} 
                        className={`group border border-gray-500 w-10 h-10 flex items-center justify-center ${isMyTurn() ? "cursor-pointer" : "cursor-not-allowed"}`}>
                            {col ? (col === 'x' ? 
                                <XIcon width="30px" height="30px" fill="#27AEEB"/> : 
                                <OIcon width="30px" height="30px" fill="#B9321D"/>
                                ) : 
                                (isMyTurn() && (
                                    own.type === 'x' ? 
                                        <XIcon width="30px" height="30px" fill="#27AEEB"
                                        className="hidden group-hover:block opacity-50"/> :
                                        <OIcon width="30px" height="30px" fill="#B9321D"
                                        className="hidden group-hover:block opacity-50"/>
                                ))
                            }
                        </div>
                    ))}
                </div>
            )) : (
                <div className="flex justify-center items-center space-x-4">
                    <p className="italic">Waiting other player</p>
                    <Spinner size="small"/>
                </div>
            )}
            {players.length > 0 && (
            <div className="absolute right-52 top-0 text-left">
                <p className="py-2 px-5 text-xl font-semibold text-center border-b border-gray-700">Players</p>
                <ul className="mt-2 italic">
                    {players.map(player => (
                        <li className="flex items-center space-x-2">
                            <span>{player._id === user._id ? "YOU" : player.name}</span>
                            {
                                player.type === 'x' ? 
                                <XIcon width="30px" height="30px" fill="#27AEEB"/> : 
                                <OIcon width="30px" height="30px" fill="#B9321D"/>
                            }
                        </li>
                    ))}
                </ul>
            </div>
            )}
        </div>
    )
}

export default CaroGamePlay