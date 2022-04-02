import React from "react"
import { Outlet, Route, Routes } from "react-router-dom"
import Header from "./component/Header"
import Message from "./page/Message"
import AuthContextProvider from "./contexts/AuthContext"
import Login from "./page/Login"
import PrivateRoute from "./component/auth/PrivateRoute"
import Register from "./page/Register"
import Conversation from "./component/Conversation"
import Caro from "./page/Caro"
import CaroGamePlay from "./page/CaroGamePlay"

const App = () => {
	return (
		<AuthContextProvider>
			<Header/>
			<Routes>
				<Route path="/" element={ <PrivateRoute/> }>
					<Route path="/" element={ <Message/> }>
						<Route index element={
							<p className="text-center font-semibold text-3xl my-20">Welcome to WebChat</p>
						}/>
						<Route path="/:conversationId" element={ <Conversation/> }/>
					</Route>
				</Route>
				<Route path="/caro" element={ <PrivateRoute/> }>
					<Route path="/caro" element={ 
						<div>
							<p className="text-center text-3xl my-10">Welcome game caro</p>
							<Outlet/>
						</div>
					}>
						<Route index element={ <Caro/> } />
						<Route path="/caro/:roomId" element={ <CaroGamePlay/> } />
					</Route>
				</Route>
				<Route path="/login" element={ <Login/> }/>
				<Route path="/register" element={ <Register/> }/>
			</Routes>
		</AuthContextProvider>
	)
}

export default App