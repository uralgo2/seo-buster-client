import React from 'react'
import {Link} from "react-router-dom";
import userImg from '../img/user.jpg'
import {Nullable, IUser} from "../utils.types";

interface IHeaderProps {
    user: Nullable<IUser>
}

function Header({user}: IHeaderProps) {
    return (
        <div className="header">
            <div className="header-left">
                <Link to="/" className="logo">
                    <span>SEO Бустер</span>
                </Link>
            </div>
            <a id="toggle_btn" style={{cursor: "pointer"}}>
                <i className="fa fa-bars"/>
            </a>
            <a id="mobile_btn" className="mobile_btn float-left" >
                <i className="fa fa-bars"/>
            </a>
            <ul className="nav user-menu float-right">
                <li style={
                    {
                        color: 'white',
                        marginTop: 14
                    }
                }>Баланс: {user?.balance}
                </li>
                <li className="nav-item dropdown has-arrow">

                    <a href="#" className="dropdown-toggle nav-link user-link" data-toggle="dropdown">
                        <span className="user-img">
                            <img className="rounded-circle" src={userImg} width="40" alt="Admin"/>
							<span className="status online"/>
                        </span>
                        <span>{"  "}{user?.login}{"   "}</span>
                    </a>
                    <div className="dropdown-menu">
                        <Link className="dropdown-item" to="/cabinet">Личный кабинет</Link>
                        <Link className="dropdown-item" to="/cabinet">Уведомления</Link>
                        <Link className="dropdown-item" to="/logout">Выход</Link>
                    </div>
                </li>
            </ul>
        </div>);
}

export default Header;