import React, {ChangeEvent, Dispatch, FormEvent, SetStateAction, useState} from "react"
import {ApiException, ISignUpCredentials, IUser, Nullable, Union} from "../utils.types";
import {Link} from "react-router-dom";
import {Api} from "../api";

interface ISignUpProps {
    setUser:  Dispatch<SetStateAction<Nullable<IUser>>>
}

function SignUp({setUser}: ISignUpProps) {
    const [credentials, setCredentials] = useState<ISignUpCredentials>({
        login: '',
        password: '',
        checkPassword: '',
        telegram: ''
    })

    const [error, setError] = useState<Nullable<string>>(null)

    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name
        const value = e.target.value

        const newCredentials = structuredClone(credentials)

        newCredentials[name] = value

        setCredentials(newCredentials as ISignUpCredentials)
    }

    const onSubmitLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if(credentials.login === '')
            return setError('Поле логина не может быть пустым')

        if(credentials.password === '')
            return setError('Поле пароля не может быть пустым')

        if(credentials.checkPassword === '')
            return setError('Поле повтора пароля не может быть пустым')

        if(credentials.checkPassword !== credentials.password)
            return setError('Пароли не совпадают')

        const res: Union<IUser, ApiException> = await Api.SignUp({
            login: credentials.login,
            password: credentials.password,
            telegram: credentials.telegram?.replace(/@/g, '')
        })

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

                            <div className="form-group">
                                <label>Повторите пароль</label>
                                <input name="checkPassword" type="password" className="form-control" onChange={onInputChange}/>
                            </div>

                            <div className="form-group">
                                <label>Телеграм</label>
                                <input placeholder='nik_name' name="telegram" type="text" className="form-control" onChange={onInputChange}/>
                                <label style={{margin: 10, color: '#33222269'}}>Для уведомлений и восстановления пароля</label>
                            </div>

                            <div className="form-group text-center">
                                <button type="submit" className="btn btn-primary account-btn">Зарегистрироваться</button>
                            </div>
                        </form>
                        <p style={{
                            textAlign: 'center'
                        }}>
                            Уже есть аккаунт? <Link to='/login' style={{marginLeft: 10}}>Войти</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUp