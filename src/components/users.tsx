import React, {ChangeEvent, FormEvent, useEffect, useState} from "react"
import {ISignUpCredentials, ISignUpData, IUser, Nullable} from "../utils.types";
import {Link} from "react-router-dom";
import {Api} from "../api";

interface IUsersProps {
    users: IUser[]
}

function Users () {
    const [users, setUsers] = useState<IUser[]>([])

    const [newUser, setNewUser] = useState<ISignUpData>({
        login: "",
        password: "",
        telegram: '',
    })

    const [error, setError] = useState<Nullable<string>>(null)

    const fetchUsers = async () => {
      const users = await Api.GetUsers()

        if(!('error' in users))
            setUsers(users)
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name
        const value = e.target.value

        const user = structuredClone(newUser)

        user[name] = value

        setNewUser(user)
    }

    const onSubmitAddUser = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if(
            newUser
            && newUser.login !== ''
            && newUser.password !== ''
        ){
            const res = await Api.CreateNewUser(newUser)

            if('error' in res)
                return setError(res.message)
            else {
                setError(null)
                const newUsers = structuredClone(users)

                newUsers.push(res)

                setUsers(newUsers)
            }
        }
        else
            setError('Не все обязательные поля заполнены')
    }

    return (
        <div className="col-md-6">
            <div className="card-box">
                <h4 className="card-title">Новый пользователь</h4>
                <form onSubmit={onSubmitAddUser}>
                    <div className="form-group">
                        <label>Логин</label>
                        <input onChange={onInputChange} name="login" type="text" className="form-control"/>
                    </div>
                    <div className="form-group">
                        <label>Пароль</label>
                        <input onChange={onInputChange} name="password" type="text" className="form-control"/>
                    </div>
                    <div className="form-group">
                        <label>Телеграм</label>
                        <input onChange={onInputChange} name="telegramLogin" type="text" className="form-control"/>
                    </div>
                    <input type="hidden" name="add" value="user"/>
                    <div className="text-right">
                        <button type="submit" className="btn btn-primary">Добавить</button>
                    </div>
                </form>
                <p style={{width: '100%', color: 'red', textAlign: 'center'}}>{error ?? ''}</p>
            </div>

            <div className="col-md-12">
                <div className="table-responsive" style={{overflowX: 'unset'}}>
                    <table className="table table-striped custom-table" style={{width: 808}}>
                        <thead>
                        <tr>
                            <th>Логин</th>
                            <th>Пароль</th>
                            <th>Телеграм</th>
                            <th>Баланс</th>
                            <th/>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            users.map(user => <tr>
                                    <td>{user.login}</td>
                                    <td>{user.password}</td>
                                    <td>{user.telegram || ''}</td>
                                    <td>{user.balance}</td>
                                    <td>
                                        <Link to={`/user/${user._id}/edit`} className="btn btn-outline-primary take-btn">Изменить</Link>
                                    </td>
                                </tr>
                            )
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Users