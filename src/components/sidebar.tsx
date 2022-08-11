import React from 'react'
import {Link} from 'react-router-dom'
import {Nullable, IUser, UserRoleEnum} from "../utils.types";
interface ISidebarProps {
    user: Nullable<IUser>
}
function Sidebar({user}: ISidebarProps) {
    return (
        <div className={"sidebar"} id="sidebar">
            <div className="slimScrollDiv" style={{
                position: 'relative', overflow: 'hidden', width: '100%', height: 694
            }}>
                <div className="sidebar-inner slimscroll" style={{
                    overflow: 'hidden', width: '100%', height: 694
                }}>
                    <div id="sidebar-menu" className="sidebar-menu">
                        <ul>
                            <li className="menu-title">Меню</li>
                            <li>
                                <Link to="/pf">
                                    <i className="fa fa-hospital-o"/>
                                    <span>Накрутка ПФ</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/calc">
                                    <i className="fa fa-calculator"/>
                                    <span>Калькулятор</span>
                                </Link>
                            </li>
                            {
                                user?.role === UserRoleEnum.Admin &&
                                <li>
                                    <Link to="/users">
                                        <i className="fa fa-user"/>
                                        <span>Пользователи</span>
                                    </Link>
                                </li>
                            }
                        </ul>
                    </div>
                </div>
                <div className="slimScrollBar"
                     style={{
                         background: 'rgb(204, 204, 204)',
                         width: 7,
                         position: 'absolute',
                         top: 0,
                         opacity: 0.4,
                         display: 'none',
                         borderRadius: 7,
                         zIndex: 99,
                         right: 1,
                         height: 694,
                     }}/>
                <div className="slimScrollRail"
                     style={{
                         width: 7,
                         height: '100%',
                         position: 'absolute',
                         top: 0,
                         display: 'none',
                         borderRadius: 7,
                         background: 'rgb(51, 51, 51)',
                         opacity: 0.2,
                         zIndex: 90,
                         right: 1,
                     }}/>
            </div>
        </div>
    );
}

export default Sidebar;