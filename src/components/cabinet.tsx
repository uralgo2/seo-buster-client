import React, {ChangeEvent, Dispatch, SetStateAction, useState} from "react"
import UserImg from '../img/user.jpg'
import {IUser, Nullable} from "../utils.types";
import {Api} from "../api";

interface ICabinetProps {
    user: IUser,
    setUser: Dispatch<SetStateAction<Nullable<IUser>>>
}
function Cabinet({user, setUser}: ICabinetProps){
    const [telegram, setTelegram] = useState<Nullable<string>>(user.telegram)
    const [error, setError] = useState<Nullable<string>>(null)

    const onInputChangeTelegram = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value

        setTelegram(value || null)
    }

    const onButtonSaveClick = async () => {
        if(telegram){
            const user = await Api.PatchMeTelegram(telegram.replace(/@/g, ''))

            if(!("error" in user)) {
                setUser(user)
            }
            else {
                setError(user.message)
                setTelegram(null)
            }
        }
    }

    return (
        <div className="card">
            <div className="card-header">
                <h4 className="card-title d-inline-block">Личный Кабинет </h4>
            </div>
            <div className="card-block">
                <div className="table-responsive"  style={{overflowX:'hidden'}}>
                    <table className="table mb-0 new-patient-table">
                        <thead>
                        <tr>
                            <th>Логин</th>
                            <th>Пароль</th>
                            <th>Баланс</th>
                            <th>Телеграм</th>
                        </tr>
                        </thead>
                        <tbody>

                        <tr>
                            <td>
                                <img width="28" height="28" className="rounded-circle" src={UserImg} alt=""/>
                                <h2>{user.login}</h2>
                            </td>
                            <td>{user.password}</td>
                            <td>{user.balance}</td>
                            <td>
                                <div className='row'>
                                    <input
                                        placeholder={error ?? 'Введите логин в телеграм'}
                                        className='input-group-text'
                                        style={{backgroundColor: 'white'}}
                                        type='text'
                                        onChange={onInputChangeTelegram}
                                        value={telegram ?? ''}/>
                                    <button onClick={onButtonSaveClick} id='saveTelegram'>Сохранить</button>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Cabinet