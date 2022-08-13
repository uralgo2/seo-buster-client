import React, {ChangeEvent, FormEvent, useState} from "react"
import {ILoginCredentials, IUser, Nullable} from "../utils.types";
import {Link} from "react-router-dom";
import {Api} from "../api";

function RestorePassword(){
    const [telegramLogin, setTelegramLogin] = useState<string>('')

    const [error, setError] = useState<Nullable<string>>(null)
    const [successful, setSuccessful] = useState<Nullable<string>>(null)
    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value

        setTelegramLogin(value)
    }

    const onSubmitLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if(telegramLogin !== ''){
            const res = await Api.RestoreTelegram(telegramLogin.replace(/@/g, ''))

            if('error' in res) {
                setError(res.message)
                setSuccessful(null)
            }
            else {
                setError(null)
                setSuccessful('Сообщение отправленно. Проверьте свой телеграм.')
            }
        }
    }

    return (
        <div className="main-wrapper account-wrapper">
            <div className="account-page">
                <div className="account-center">
                    <div className="account-box">
                        <form className="form-signin" onSubmit={onSubmitLogin}>
                            <div className="account-logo">
                                <h2>SEO Бустер</h2>
                                <p style={{color: successful ? 'green' : "red" }}>{successful ?? error ?? ''}</p>
                            </div>

                            <div className="form-group">
                                <label>Телеграм</label>
                                <input name="login" type="text" className="form-control" onChange={onInputChange}/>
                            </div>

                            <div className="form-group text-center">
                                <button type="submit" className="btn btn-primary account-btn">Восстановить</button>
                            </div>
                        </form>
                        <p style={{
                            textAlign: 'center'
                        }}>
                            <Link to='/signup' style={{marginRight: 10}}>Зарегистрироваться</Link>
                            или
                            <Link to='/login' style={{marginLeft: 10}}>Войти</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RestorePassword