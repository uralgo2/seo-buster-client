import React, {ChangeEvent, FormEvent, useEffect, useState} from "react"
import {formatNumber, IProject, ITask, IUpdateProps, Nullable, StatusEnum, TaskEnum,} from "../utils.types";
import {useNavigate, useParams} from "react-router-dom";
import {Api} from "../api";

function PFViewAdmin ({update} : IUpdateProps){
    const [project, setProject] = useState<Nullable<IProject>>(null)
    const [deduct, setDeduct] = useState<Nullable<number>>(null)
    const [task, setTask] = useState<Nullable<ITask>>(null)
    const navigate = useNavigate()

    const onProjectInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name
        const value = e.target.value

        const newProject = structuredClone(project)

        newProject[name] = value

        setProject(newProject as IProject)
    }

    const onTaskInputChange = (e: ChangeEvent<HTMLInputElement & HTMLTextAreaElement>) => {
        const name = e.target.name
        const value = e.target.value

        const newProject = structuredClone(project)

        newProject.lastTask[name] = value

        setTask(newProject.lastTask)
        setProject(newProject as IProject)
    }

    const onStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const newTask = structuredClone(task)
        const newProject = structuredClone(project)

        newTask.status = e.target.selectedOptions.item(0)!.value
        newProject.lastTask = newTask
        setTask(newTask as ITask)

        setProject(newProject)
    }

    const OnDeductInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value

        setDeduct(Number(value))
    }

    const onFactorChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const newProject = structuredClone(project)

        newProject.factor = Number(e.target.selectedOptions.item(0)!.value)

        setProject(newProject as IProject)
    }

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        console.log(project)
        console.log(deduct)
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
        <form id="form" onSubmit={onSubmit}>


            <div className="col-lg-6">
                <div className="card-box">
                    <div className="card-block">
                        <h4 className="card-title">Данные по сайту {project?.site??''}</h4>
                        <div className="table-responsive">
                            <table className="table mb-0">
                                <tbody>
                                <tr>
                                    <td><b>Сайт</b></td>
                                    <td>{project?.site??''}</td>

                                </tr>
                                <tr>
                                    <td><b>Задача</b></td>
                                    <td>{project?.lastTask?.type === TaskEnum.ChangeFactor
                                        ? (TaskEnum.ChangeFactor + ' на ' + formatNumber(project.lastTask.factorToChange!, 1, 1))
                                        : (project?.lastTask?.type ?? '')}</td>

                                </tr>
                                <tr>
                                    <td><b>Файл</b></td>
                                    <td>
                                        <a href={`http://seobuster.ru/${project?.lastTask?.filePath}`} download="">
                                            {project?.lastTask?.fileName??''}
                                        </a>
                                    </td>

                                </tr>
                                <tr>
                                    <td><b>Баланс клиента</b></td>
                                    <td>{project?.user?.balance??''}</td>
                                </tr>
                                <tr>
                                    <td><b>Режим кф.</b></td>
                                    <td>
                                        <select
                                            onChange={onFactorChange}
                                            name="factor">
                                            <option selected={project?.factor === 0.1} value="0.1">0,1</option>
                                            <option selected={project?.factor === 0.2} value="0.2">0,2</option>
                                            <option selected={project?.factor === 0.3} value="0.3">0,3</option>
                                            <option selected={project?.factor === 0.4} value="0.4">0,4</option>
                                            <option selected={project?.factor === 0.5} value="0.5">0,5</option>
                                            <option selected={project?.factor === 0.6} value="0.6">0,6</option>
                                            <option selected={project?.factor === 0.7} value="0.7">0,7</option>
                                            <option selected={project?.factor === 0.8} value="0.8">0,8</option>
                                            <option selected={project?.factor === 0.9} value="0.9">0,9</option>
                                            <option selected={project?.factor === 1} value="1">1</option>
                                        </select>
                                    </td>

                                </tr>
                                <tr>
                                </tr>
                                <tr>
                                    <td><b>Статус</b></td>
                                    <td>
                                        <select name="status" id="kof"
                                            onChange={onStatusChange}
                                        >
                                            <option selected={project?.lastTask?.status === StatusEnum.Execute}  value={StatusEnum.Execute}>Выполнить</option>
                                            <option selected={project?.lastTask?.status === StatusEnum.Done} value={StatusEnum.Done}>Готово</option>
                                            <option selected={project?.lastTask?.status === StatusEnum.Error} value={StatusEnum.Error}>Ошибка</option>
                                        </select>
                                        <div className="textt"/>
                                    </td>

                                </tr>
                                <tr>
                                    <td><b>Страниц</b></td>

                                    <td style={{padding: '0.15rem'}}>
                                        <input id="page_old" type="number" disabled
                                               className="form-control"
                                               style={{
                                                   marginRight:10,
                                                   float: 'left',
                                                   width: 70
                                               }}
                                               value={project?.pages ?? 0}/>
                                        <input id="page" name="pages"
                                               type="number"
                                               className="form-control"
                                               style={{width: 70}}
                                               value={project?.pages ?? 0}
                                               onChange={onProjectInputChange}
                                               required/>
                                    </td>
                                </tr>
                                <tr>
                                    <td><b>Запросов</b></td>

                                    <td style={{padding: '0.15rem'}}>
                                        <input id="zapros_old" type="number" disabled
                                               className="form-control"
                                               style={{
                                                   marginRight:10,
                                                   float:'left',
                                                   width: 70
                                               }}
                                               value={project?.queries ?? 0}/>
                                        <input id="zapros" name="queries"
                                               type="number"
                                               className="form-control"
                                               style={{width: 70}}
                                               value={project?.queries ?? 0}
                                               onChange={onProjectInputChange}
                                               required/>
                                    </td>
                                </tr>
                                <tr>
                                    <td><b>Кликов\день</b></td>

                                    <td style={{padding: '0.15rem'}}>
                                        <input id="page_old" type="number" disabled
                                               className="form-control"
                                               style={{
                                                   marginRight:10,
                                                   float: 'left',
                                                   width: 70
                                               }}
                                               value={project?.clicksPerDay ?? 0}/>
                                        <input id="page" name="clicksPerDay"
                                               type="number"
                                               className="form-control"
                                               style={{width: 70}}
                                               value={project?.clicksPerDay ?? 0}
                                               onChange={onProjectInputChange}
                                               required/>
                                    </td>
                                </tr>
                                <tr>
                                    <td><b>Расход\день</b></td>

                                    <td style={{padding: '0.15rem'}}>
                                        <input id="page_old" type="number" disabled
                                               className="form-control"
                                               style={{
                                                   marginRight:10,
                                                   float: 'left',
                                                   width: 70
                                               }}
                                               value={project?.expensePerDay ?? 0}/>
                                        <input id="page" name="expensePerDay"
                                               type="number"
                                               className="form-control"
                                               style={{width: 70}}
                                               value={project?.expensePerDay ?? 0}
                                               onChange={onProjectInputChange}
                                               required/>
                                    </td>
                                </tr>
                                <tr>
                                    <td><b>Тариф</b></td>

                                    <td style={{padding: '0.15rem'}}>
                                        <input id="page_old" type="number" disabled
                                               className="form-control"
                                               style={{
                                                   marginRight:10,
                                                   float: 'left',
                                                   width: 70
                                               }}
                                               value={project?.tariff ?? 0}/>
                                        <input id="page" name="tariff"
                                               type="number"
                                               className="form-control"
                                               style={{width: 70}}
                                               value={project?.tariff ?? 0}
                                               onChange={onProjectInputChange}
                                               required/>
                                    </td>
                                </tr>
                                <tr>
                                    <td><b>Расход мес.</b></td>

                                    <td style={{padding: '0.15rem'}}>
                                        <input type="number" disabled
                                               className="form-control"
                                               style={{marginRight:10, float:'left',width: 70}}
                                               value={project?.expensePerMonth ?? 0}/>
                                        <input id="expensePerDay" name="expensePerMonth" type="number"
                                               className="form-control"
                                               style={{width: 70}}
                                               value={project?.expensePerMonth ?? 0}
                                               onChange={onProjectInputChange}
                                               required/>
                                    </td>
                                </tr>
                                <tr>
                                    <td><b>Окончание</b></td>

                                    <td style={{padding: '0.15rem'}}>
                                        <input id="ending" type="date"
                                               className="form-control"
                                               name="endingAt"
                                               style={{marginRight:10, float:'left',width: 150}}
                                               onChange={onProjectInputChange}
                                               value={new Date((project?.endingAt as unknown as string ?? 0)).toISOString().split('T')[0]}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td><b>Вычесть</b></td>

                                    <td style={{padding: '0.15rem'}}>
                                        <input type="number" disabled className="form-control"
                                               style={{marginRight:10, float:'left', width: 70}}
                                               value={project?.user.balance ?? 0}/>
                                        <input id="balance" name="balance"
                                               type="number"
                                               className="form-control"
                                               style={{width: 70}}
                                               value={project?.user.balance ?? 0}
                                               onChange={OnDeductInputChange}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td><b>Комент</b></td>
                                    <td className="col">
                                        <textarea
                                            onChange={onTaskInputChange}
                                            disabled={project?.lastTask?.status !== StatusEnum.Error}
                                            name="message" rows={3} cols={30} id="req">
                                            {project?.lastTask?.message}
                                        </textarea>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                            <br/>

                            <div className="text-right">
                                <a onClick={() => navigate('project')}
                                   className="btn btn-outline-primary take-btn"
                                   id="cancel"
                                   style={{margin: 10}}>
                                    Отмена</a>
                                <button type="submit"
                                        id="su"
                                        className="btn btn-primary">
                                    Сохранить
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default PFViewAdmin