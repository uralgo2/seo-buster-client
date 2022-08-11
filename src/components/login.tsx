import React, {ChangeEvent, Dispatch, FormEvent, SetStateAction, useState} from "react"
import {ApiException, ILoginCredentials, IUser, Nullable, Union} from "../utils.types";
import {Link} from "react-router-dom";
import {Api} from "../api";

interface ILoginProps {
    setUser:  Dispatch<SetStateAction<Nullable<IUser>>>
}

function Login({setUser}: ILoginProps) {
    const [credentials, setCredentials] = useState<ILoginCredentials>({
        login: '',
        password: ''
    })

    const [error, setError] = useState<Nullable<string>>(null)

    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name
        const value = e.target.value

        const newCredentials = structuredClone(credentials)

        newCredentials[name] = value

        setCredentials(newCredentials as ILoginCredentials)
    }

    const onSubmitLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if(credentials.login === '')
            return setError('Поле логина не может быть пустым')

        if(credentials.password === '')
            return setError('Поле пароля не может быть пустым')

        const res: Union<IUser, ApiException> = await Api.Login(credentials)

        if("error" in res && res.error){
            setError(res.message)
        }
        else
            setUser(res as IUser)
    }

    return (
        <div className="main-wrapper account-wrapper">
            <div className="account-page">
                <div className="account-center">
                    <div className="account-box">
                        <form className="form-signin" onSubmit={onSubmitLogin}>
                            <div className="account-logo">
                                <h2>SEO Бустер</h2>
                                <p style={{color:"red"}}>{error ?? ''}</p>
                            </div>

                            <div className="form-group">
                                <label>Логин</label>
                                <input name="login" type="text" className="form-control" onChange={onInputChange}/>
                            </div>

                            <div className="form-group">
                                <label>Пароль</label>
                                <input name="password" type="password" className="form-control" onChange={onInputChange}/>
                            </div>

                            <div className="form-group text-center">
                                <button type="submit" className="btn btn-primary account-btn">Вход</button>
                            </div>
                        </form>
                        <p style={{
                            textAlign: 'center'
                        }}>
                            Еще нет аккаунта? <Link to='/signup' style={{marginLeft: 10}}>Зарегистрироваться</Link>
                        </p>
                        <p style={{
                            textAlign: "center"
                        }}>
                            <Link to='/restore'>Забыли пароль?</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login