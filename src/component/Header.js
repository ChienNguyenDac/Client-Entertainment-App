import React from "react"
import { Link, NavLink } from "react-router-dom"
import logo from "../asset/img/logo.png"

const Header = () => {
    const getActiveClassLink = isActive => isActive ? "underline font-semibold" : ""

    return (
        <header className="py-1 px-10 shadow-lg">
            <div className="flex items-center justify-between">
                <Link className="flex items-center" to="/">
                    <img src={ logo } alt="logo entertainment application" 
                    className="w-14 h-14 mr-2"/>
                    <p className="font-semibold text-2xl">Entertainment
                        <span className="ml-2 text-blue-300">APP</span>
                    </p>
                </Link>
                <div>
                    <NavLink className={isActive => getActiveClassLink(isActive)} to="/caro">
                        <p>Game Caro</p>
                    </NavLink>
                </div>
            </div>
        </header>
    )
}


export default Header