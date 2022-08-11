import React, {ChangeEvent, FormEvent, useEffect, useState} from "react"
import {formatNumber, IProject, ITask, IUpdateProps, Nullable, StatusEnum, TaskEnum} from "../utils.types";
import {useNavigate, useParams} from "react-router-dom";
import {Api} from "../api";

function PFView({update} : IUpdateProps) {
    const [project, setProject] = useState<Nullable<IProject>>(null)
    const [task, setTask] = useState<Nullable<Partial<ITask>>>(null)
    const [factor, setFactor] = useState<Nullable<number>>(null)
    const [file, setFile] = useState<Nullable<File>>(null)
    const navigate = useNavigate()

    const onFactorChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = Number(e.target.selectedOptions.item(0)!.value)

        const tmp = structuredClone(project)
        tmp.factor = value

        setProject(tmp)
        setFactor(value)
        setTask(null)
    }

    const onQueriesAdd = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.item(0)

        if(!file)
            return

        setFile(file)
        setFactor(null)
        setTask({
            fileName: file.name,
            type: TaskEnum.AddQueries
        })
    }

    const onQueriesDelete = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.item(0)

        if(!file)
            return

        setFile(file)
        setFactor(null)
        setTask({
            fileName: file.name,
            type: TaskEnum.DeleteQueries
        })
    }

    const onSubmitForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if(!project) return

        if(factor)
        {
            const res = await Api.PatchProjectFactor(project._id, factor)

            if('error' in res)
                return alert(res.message)

            update(true)
            navigate('pf')
        }
        else if(task){
            const upload = await Api.UploadFile(file!)

            if('error' in upload)
                return alert(upload.message)

            const res = await Api.AddTask(project._id, {
                type: task.type,
                fileName: file!.name,
                filePath: upload.uploadPath
            })

            if('error' in res)
                return alert(res.message)

            update(true)
            navigate('pf')
        }
    }

    const params = useParams()

    const fetchProject = async () => {
        const project = await Api.GetProjectById(params.id as string)

        if('error' in project)
            return navigate('pf')

        setTask(project.lastTask)
        setProject(project)
    }

    useEffect(() => {
        fetchProject()
    }, [])

    return (
        <form id="form" onSubmit={onSubmitForm}>
            <div className="col-lg-6">
                <div className="card-box">
                    <div className="card-block">
                        <h4 className="card-title" style={{marginBottom: 6}}>Данные по сайту
                            {" "}{project?.site ?? ''}</h4>
                        Отправить можно лишь 1 действие за раз (поменять кф, добавить запросы, удалить запросы)
                        <div className="table-responsive " style={{marginTop: 15}}>
                            <table className="table mb-0">
                                <tbody>
                                <tr>
                                    <td><b>Сайт</b></td>
                                    <td>{project?.site ?? ''}</td>
                                </tr>
                                <tr>
                                    <td><b>Статус</b></td>
                                    <td>
                                        {
                                            project?.lastTask?.status === StatusEnum.Execute ? 'Обработка'
                                                : project?.lastTask?.status === StatusEnum.Done ? 'Крутится'
                                                    : project?.lastTask?.status === StatusEnum.Error ?
                                                        <>
                                                            Ошибка
                                                            <div className="dropdown dropdown-action"
                                                                 style={{float: 'right', marginRight: 20}}>
                                                                <a href="#" className="action-icon dropdown-toggle"
                                                                   data-toggle="dropdown" aria-expanded="false">
                                                                    <i className="fa fa-info-circle"/>
                                                                </a>
                                                                <div className="dropdown-menu dropdown-menu-right"
                                                                     x-placement="bottom-end"
                                                                     style={{
                                                                         position: 'absolute',
                                                                         willChange: 'transform',
                                                                         top: 0,
                                                                         left: 0,
                                                                         transform: 'translate3d(141px, 27px, 0px)'
                                                                     }}>
                                                                    <div style={{paddingLeft: 9}}>
                                                                        {project!.lastTask.message}
                                                                        <br/>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                        : ''
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <td><b>Режим кф.</b></td>
                                    <td>
                                        <select value={project?.factor ?? 1} name="factor" id="kof" onChange={onFactorChange}>
                                            <option value="0.1">0,1</option>
                                            <option value="0.2">0,2</option>
                                            <option value="0.3">0,3</option>
                                            <option value="0.4">0,4</option>
                                            <option value="0.5">0,5</option>
                                            <option value="0.6">0,6</option>
                                            <option value="0.7">0,7</option>
                                            <option value="0.8">0,8</option>
                                            <option value="0.9">0,9</option>
                                            <option value="1">1</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td><b>Страниц</b></td>
                                    <td>{project?.pages ?? ''}</td>
                                </tr>
                                <tr>
                                    <td><b>Запросов</b></td>
                                    <td>{project?.queries ?? ''}</td>
                                </tr>
                                <tr>
                                    <td><b>Кликов\день</b></td>
                                    <td>{project?.clicksPerDay ?? ''}</td>
                                </tr>
                                <tr>
                                    <td><b>Стоимость\день</b></td>
                                    <td>{formatNumber(project?.expensePerDay ?? 0, 0)}</td>
                                </tr>
                                <tr>
                                    <td><b>Тариф</b></td>
                                    <td>{formatNumber(project?.tariff ?? 0)}</td>
                                </tr>
                                <tr>
                                    <td><b>Расход мес.</b></td>
                                    <td>{formatNumber(project?.expensePerMonth ?? 0, 0)}</td>
                                </tr>
                                <tr>
                                    <td><b>Окончание</b></td>
                                    <td>{new Date(project?.endingAt as unknown as string).toLocaleDateString('ru-RU', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                    })
                                        .split('.')
                                        .reverse()
                                        .join('-')
                                    }</td>
                                </tr>
                                <tr>
                                    <td><b>Добавить Запросы</b></td>
                                    <td>
                                        <label className="btn btn btn-primary btn-rounded " htmlFor="file_input_id"
                                               style={{
                                                   padding: '0.175rem 0.65rem',
                                                   float: 'left',
                                                   marginBottom: -4
                                               }}>
                                            <i className="fa fa-plus"/>
                                        </label>
                                        <input onChange={onQueriesAdd} name="file_plus" type="file" id="file_input_id"
                                               accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"/>
                                        <div className="ri" style={{
                                            float: 'left',
                                            marginTop: 5,
                                            marginLeft: 15
                                        }}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td><b>Удалить Запросы</b></td>
                                    <td>
                                        <label className="btn btn btn-primary btn-rounded " htmlFor="file_input_id2"
                                               style={{
                                                   padding: '0.175rem 0.65rem',
                                                   float: 'left',
                                                   marginBottom: -4
                                               }}>
                                            <i className="fa fa-minus"/>
                                        </label>
                                        <input onChange={onQueriesDelete} name="file_minus" type="file" id="file_input_id2"
                                               accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"/>
                                        <div className="ri2" style={{float: 'left', marginTop: 5, marginLeft: 15}}/>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                            <br/>
                            <div className="text-right">
                                <a onClick={() => navigate('project')}
                                   className="btn btn-outline-primary take-btn"
                                   id="cancel"
                                   style={{margin: 10}}>Отмена</a>
                                <button type="submit"
                                        className="btn btn-primary">Сохранить
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default PFView