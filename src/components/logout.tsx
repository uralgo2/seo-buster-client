import React, {Dispatch, SetStateAction, useEffect} from "react"
import { Navigate } from "react-router-dom";
import {IUser, Nullable} from "../utils.types";
import {Api} from "../api";

interface ILogoutProps {
    setUser:  Dispatch<SetStateAction<Nullable<IUser>>>
}

function Logout({setUser}: ILogoutProps) {

    useEffect(() => {
        Api.Logout().then((res) => {
            if(!("error" in res))
                setUser(null)
        })
    }, [setUser])

    return <Navigate to='login' replace/>
}

export default Logout