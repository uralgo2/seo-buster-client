import React, {useEffect, useState} from 'react'
import Header from "./components/header"
import Sidebar from "./components/sidebar"
import {BrowserRouter as Router, Routes, Route, } from "react-router-dom"
import {Nullable, IUser, IDefaults, UserRoleEnum} from "./utils.types"
import {Navigate} from "react-router"
import PovedFactor from "./components/povedfactor"
import PovedFactorAdmin from "./components/povedfactoradmin"
import Calculator from "./components/calculator"
import PriceCalculator from "./components/pricecalculator"
import Login from './components/login'
import SignUp from "./components/signup"
import Logout from "./components/logout"
import Users from "./components/users"
import UserEdit from "./components/user.edit"
import Cabinet from "./components/cabinet"
import PFViewAdmin from "./components/pf.view.admin"
import RestorePassword from "./components/restore.password"
import PovedFactorAddProject from "./components/povedfactor.add.project"
import PFView from "./components/pf.view"
import {Api} from "./api";

function App() {
    const [user, setUser] = useState<Nullable<IUser>>(null)
    const [loaded, setLoaded] = useState<boolean>(false)
    const [update, setUpdate] = useState<boolean>(false)
    const [defaults, setDefaults] = useState<IDefaults>({
        factor: 0.5,
        accountsFactor: 2,
        geo: 213,
        price: 550,
        pristavka1: "",
        pristavka2: "",
        pristavka3: "",
        proxies: 35,
        sclick: 0

    })
    // todo make saving defaults at backend
    const fetchUser = async () => {
        const me = await Api.GetMe()

        if("error" in me)
            setUser(null)
        else
            setUser(me)

        setLoaded(true)
    }

    useEffect(() => {
        fetchUser()
    }, [])

    useEffect(() => {
        if(!update) return
        else {
            fetchUser()
            setUpdate(false)
        }
        }, [update])

    return (
        <Router>
            {(user && loaded) ?
                <div className="App">
                    <Header user={user}/>
                    <Sidebar user={user}/>

                    <div className="page-wrapper">
                        <div className="content">
                            {loaded &&
                                <Routes>
                                    <Route path="/calc" element={
                                        user?.role !== UserRoleEnum.Admin
                                            ? <PriceCalculator/>
                                            : <Calculator _defaults={defaults} _setDefaults={setDefaults}/>
                                    }/>

                                    <Route path="/pf" element={
                                        user?.role !== UserRoleEnum.Admin
                                            ? <PovedFactor/>
                                            : <PovedFactorAdmin/>
                                    }/>

                                    <Route path="/cabinet" element={user && <Cabinet user={user} setUser={setUser}/>}/>

                                    <Route path='/logout' element={
                                        <Logout setUser={setUser}/>
                                    }/>

                                    <Route path="/users"
                                           element={
                                               user?.role !== UserRoleEnum.Admin
                                                   ? <Navigate to="pf" replace/>
                                                   : <Users/>
                                           }
                                    />

                                    <Route path="/user/:id/edit"
                                           element={
                                               user?.role !== UserRoleEnum.Admin
                                                   ? <Navigate to="pf" replace/>
                                                   : <UserEdit update={setUpdate}/>
                                           }
                                    />

                                    <Route path="/pf/:id/view"
                                           element={
                                               user?.role !== UserRoleEnum.Admin
                                                   ? <PFView update={setUpdate}/>
                                                   : <PFViewAdmin update={setUpdate}/>
                                           }
                                    />

                                    <Route path="/pf/add/project"
                                           element={
                                               user?.role === UserRoleEnum.Admin
                                                   ? <Navigate to="pf" replace/>
                                                   : <PovedFactorAddProject/>
                                           }
                                    />
                                    <Route path="*" element={<Navigate to="pf" replace/>}/>
                                </Routes>
                            }
                        </div>
                    </div>
                </div>
                : (!user && loaded) && <Routes>
                    <Route path="/login" element={<Login setUser={setUser}/>}/>
                    <Route path="/signup" element={<SignUp setUser={setUser}/>}/>
                    <Route path="/restore" element={<RestorePassword/>}/>
                    <Route path="*" element={<Navigate to='login' replace/>}/>
                </Routes>
            }
        </Router>
    );
}

export default App;