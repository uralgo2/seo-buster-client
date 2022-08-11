import React, {ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useState} from "react"
import {IUpdateProps, IUser, Nullable} from "../utils.types";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {Api} from "../api";


function UserEdit ({update} : IUpdateProps) {
    const [user, setUser] = useState<Nullable<IUser>>(null)
    const [loaded, setLoaded] = useState<boolean>(false)
    const [error, setError] = useState<Nullable<string>>(null)
    const navigate = useNavigate()

    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name
        const value = e.target.value

        const newUser = structuredClone(user)

        newUser[name] = value

        setUser(newUser as IUser)
    }

    const onSubmitEdit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if(
            user
            && user.login !== ''
            && user.password !== ''
        ){
            const res = await Api.UpdateUser(user._id, user)

            if('error' in res)
                return setError(res.message)

            update(true)
            navigate('../../users')
        }
        else
            setError('Обязательные поля не могут быть пустыми')
    }

    const params = useParams()

    const fetchUser = async () => {
        const user = await Api.GetUserById(params.id!)

        if("error" in user)
            return navigate('../../users')

        setUser(user)
        setLoaded(true)
    }



    const onClickDeleteUserButton = async () => {
        if(!user) return

        const res = await Api.DeleteUser(user._id)

        if('error' in res)
            return setError(res.message)

        update(true)
        navigate('../../users')
    }

    if(loaded && !user) navigate('../../users')

    useEffect(() => {
        fetchUser()
    }, [])

    return (
        <div className="card-box">
            <h4 className="card-title">Изменить данные</h4>
            <div className="col-lg-8 offset-lg-2">
                <form onSubmit={onSubmitEdit}>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Логин</label>
                                <input onChange={onInputChange} name="login" className="form-control" type="text" value={user?.login}/>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Телеграм</label>
                                <input onChange={onInputChange} name="telegram" className="form-control" type="text" value={user?.telegram || ''}/>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Пароль</label>
                                <input onChange={onInputChange} name="password" className="form-control" type="text" value={user?.password}/>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Баланс</label>
                                <input onChange={onInputChange} name="balance" className="form-control" type="number" value={user?.balance}/>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6" style={{maxWidth: '100%', flex: 'none'}}>
                            <div className="form-group" style={{marginTop: 40, textAlign: 'center', width: '100%'}}>
                                <i onClick={onClickDeleteUserButton} style={{color: 'red', cursor: 'pointer', fontStyle: 'normal'}}>
                                    Удалить аккаунт
                                </i>
                            </div>
                        </div>

                    </div>
                    <div className='row'>
                        <p style={{textAlign: 'center', color: 'red', width: '100%'}}>{error ?? ''}</p>
                    </div>
                    <div className="m-t-20 text-center">
                        <button className="btn btn-primary submit-btn" style={{
                            fontSize: 14,
                            textTransform: 'none'
                        }}>Сохранить
                        </button>
                        <br/><br/>
                        <i onClick={() => navigate('users')}
                           className="btn btn-outline-primary take-btn"
                           id="cancel">Отмена</i>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UserEdit