import React, {ChangeEvent, FormEvent, useEffect, useState} from "react"
import {formatNumber, IProject, ITask, IUpdateProps, Nullable, StatusEnum, TaskEnum,} from "../utils.types";
import {useNavigate, useParams} from "react-router-dom";
import {Api} from "../api";

function PFViewAdmin ({update} : IUpdateProps){
    const [project, setProject] = useState<Nullable<IProject>>(null)
    const [oldProject, setOldProject] = useState<Nullable<IProject>>(null)
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

    const onTaskInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value

        const newTask = structuredClone(task)

        newTask.message = value

        setTask(newTask)
    }

    const onStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const newTask = structuredClone(task)

        newTask.status = e.target.selectedOptions.item(0)!.value

        setTask(newTask)
    }

    const OnDeductInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value

        const num = Number(value)

        setDeduct(Number.isNaN(num) ? null : num)
    }

    const onFactorChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const newProject = structuredClone(project)

        newProject.factor = Number(e.target.selectedOptions.item(0)!.value)

        setProject(newProject as IProject)
    }

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const safe: Partial<IProject> = structuredClone(project)

        delete safe.user
        delete safe.lastTask
        delete safe.lastTaskCreationDate
        delete safe._id
        delete safe.notificatedAboutExpires
        delete safe.notificatedAboutExpired

        const resProjectUpdate = await Api.PutProject(project!._id, safe)

        if('error' in resProjectUpdate)
            return alert(resProjectUpdate.message)

        const resTaskUpdate = await Api.PutTask(project!._id, task!._id, {
            status: task?.status,
            message: task?.message
        })

        if('error' in resTaskUpdate)
            return alert(resTaskUpdate.message)

        if(deduct) {
            const resDeduct = await Api.DeductFromUserBalance(project!.user._id, deduct)

            if('error' in resDeduct)
                return alert(resDeduct.message)
        }

        navigate('../../pf')
    }

    const params = useParams()

    const fetchProject = async () => {
        const res = await Api.GetTaskAndProjectById(params.id!)

        if('error' in res)
            return navigate('../../pf')

        const {task, project} = res

        setTask(task)
        setProject(project)
        setOldProject(project)
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
                                    <td>{task?.type === TaskEnum.ChangeFactor
                                        ? (TaskEnum.ChangeFactor + ' на ' + formatNumber(task.factorToChange!, 1, 1))
                                        : (task?.type ?? '')}</td>

                                </tr>
                                <tr>
                                    <td><b>Файл</b></td>
                                    <td>
                                        <a href={`http://seobuster.ru/${task?.filePath}`} download="">
                                            {task?.fileName??''}
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
                                            name="factor"
                                            value={project?.factor}
                                        >
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
                                </tr>
                                <tr>
                                    <td><b>Статус</b></td>
                                    <td>
                                        <select name="status" id="kof"
                                                onChange={onStatusChange}
                                                value={task?.status}
                                        >
                                            <option value={StatusEnum.Execute}>Выполнить</option>
                                            <option value={StatusEnum.Done}>Готово</option>
                                            <option value={StatusEnum.Error}>Ошибка</option>
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
                                               value={oldProject?.pages ?? 0}/>
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
                                               value={oldProject?.queries ?? 0}/>
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
                                               value={oldProject?.clicksPerDay ?? 0}/>
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
                                               value={oldProject?.expensePerDay ?? 0}/>
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
                                               value={oldProject?.tariff ?? 0}/>
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
                                               value={oldProject?.expensePerMonth ?? 0}/>
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
                                               value={deduct ?? ''}
                                               onChange={OnDeductInputChange}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td><b>Комент</b></td>
                                    <td className="col">
                                        <textarea
                                            onChange={onTaskInputChange}
                                            disabled={task?.status !== StatusEnum.Error}
                                            name="message" rows={3} cols={30} id="req"
                                            value={task?.message ?? ''}
                                            defaultValue=''
                                        />
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                            <br/>

                            <div className="text-right">
                                <a onClick={() => navigate('../../pf')}
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