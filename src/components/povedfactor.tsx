import React, {useEffect, useState} from "react"
import {IProject, Nullable, StatusEnum, TaskEnum} from "../utils.types";
import {Link, useNavigate} from "react-router-dom";
import {Api} from "../api";

function PovedFactor () {
    const [data, setData] = useState<IProject[]>([])

    const [modalLink, setModalLink] = useState<Nullable<string>>(null)

    const navigate = useNavigate()

    const onClickExpandDescription = () => {
        const arrow = document.querySelector('#descriptionArrow') as HTMLElement
        const text = document.querySelector('.descriptionText') as HTMLElement

        arrow.classList.toggle('expanded')

        text.classList.toggle('no-visible')

        text.focus()

        text.classList.toggle('expandedDescriptionText')
    }

    const onBlur = () => {
        const arrow = document.querySelector('#descriptionArrow') as HTMLElement
        const text = document.querySelector('.descriptionText') as HTMLElement

        arrow.classList.remove('expanded')
        text.classList.add('no-visible')
    }

    const openModal = (id: string) => {
        return () => {
            document.querySelectorAll('.modal-elem')
                .forEach(elem => elem.classList.remove('no-visible'))
            setModalLink(id)
        }
    }

    const closeModal = () => {
        document.querySelectorAll('.modal-elem')
            .forEach(elem => elem.classList.add('no-visible'))

        setModalLink(null)
    }

    const fetchProjects = async () => {
        const projects = await Api.GetMyProjects()

        if(!("error" in projects))
            setData(projects)
    }

    useEffect(() => {
        document.getElementById('closeModal')!.onclick = closeModal
    }, [])

    useEffect(() => {
        fetchProjects()
    }, [])

    return (
        <>
            {
                modalLink &&
                <div id='videoPlayerModal'>
                    <iframe style={{position: "fixed", top: '20vh', left: '30vw'}} id="player" width="640" height="360"
                        src={`https://www.youtube.com/embed/${modalLink}/?enablejsapi=1&origin=https://seobuster.ru`}
                        frameBorder="0"/>
                </div>
            }
            <div className="row">
                <div className="col-sm-4 col-3">
                    <h4 className="page-title">Поведенческие Факторы</h4>
                </div>
                <div className="col-9 m-b-20 description">
                    <div id='descriptionArrow'>↓</div>
                    <a id='descriptionLink' onClick={onClickExpandDescription}>
                        Описание
                    </a>
                    <div /*onBlur={onBlur}*/ className='no-visible descriptionText' id='tooltip' role='tooltip'>
                        <h5>Как добавить задачу</h5>
                        <>Необходимо нажать кнопку “Добавить сайт”.</><br/>
                        <>В открывшемся меню, выберите:</><br/>
                        <ol>
                            <li>
                                <>режим (кф - коэффициент):</><br/>
                                <ul>
                                    <li>0,1 - если у вас сайт моложе 3 месяцев или у него нет видимости в топ-100</li>
                                    <li>0,5 - во всех остальных случаях.</li>
                                </ul>
                            </li>
                            <li>Выберите город из списка</li>
                            <li>
                                <>Добавьте файл в виде Ексель, внутри которого должны быть следующие столбцы:</><br/>
                                <ol>
                                    <li>адрес страницы</li>
                                    <li>запрос</li>
                                    <li>частота в кавычках по нужному городу (“запрос”)</li>
                                </ol>
                            </li>
                            <li>Нажмите на кнопку “добавить сайт”.</li>
                        </ol>

                        <>Как добавить запросы или убрать</><br/>
                        <ul>
                            <li>Нажмите на название сайта. Перейдете в режим настройки.</li>
                            <li>Нажмите на кнопку “плюс” или “минус”, чтобы выбрать файл Эксель. Который состоит из 2-х столбцов (страница, запрос).</li>
                            <li>При удалении, вам нужно указать только то, что нужно убрать (с заполнением 2-х столбцов в файле).</li>
                        </ul>

                        <p>По всем вопросам пишите в <Link to='/support'>поддержку</Link>.</p>

                        <>Видео-инструкции:</><br/>
                        <ul>
                            <li><a href='#' onClick={openModal('0Rr8X764fYY')}>Как добавить сайт на сервис</a></li>
                            <li><a href='#' onClick={openModal('S97z_9qnoIE')}>Как добавить запросы или удалить</a></li>
                        </ul>

                        <div id="arrow" data-popper-arrow/>
                    </div>
                </div>
                <div className="col-9 m-b-20">
                    <Link to="/pf/add/project" className="btn btn btn-primary btn-rounded">
                        <i className="fa fa-plus"/>
                        {"    "}Добавить Сайт
                    </Link>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <div className="table-responsive" style={{overflowX: 'unset'}}>
                        <table id="s" className="table table-striped custom-table tasks" /*style={{width: 1040}}*/>
                            <thead>
                            <tr>
                                <th style={{paddingLeft: 10, width: 116}}>Время</th>
                                <th style={{width: 231}}>Сайт</th>
                                <th style={{width: 90}}>Город</th>
                                <th style={{width: 90}}>Cтраниц</th>
                                <th style={{width: 90}}>Запросы</th>
                                <th style={{width: 90}}>Кликов\день</th>
                                <th style={{width: 90}}>Расход\день</th>
                                <th style={{width: 90}}>Тариф</th>
                                <th style={{width: 100}}>Расход мес.</th>
                                <th style={{width: 101}}>Режим кф.</th>
                                <th style={{width: 90}}>Окончание</th>
                                <th style={{width: 141}}>Статус</th>
                                <th style={{width: 121}}/>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                data.map(project => {
                                        const redirectToView = () => navigate(`/pf/${project._id}/view`, {
                                            replace: true
                                        })
                                        return (
                                            <tr className="s" key={project._id}>
                                                <td onClick={redirectToView} style={{paddingLeft: 10}}>
                                                    {
                                                        new Date(project.createdAt)!.toLocaleString('ru-RU',
                                                            {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                                day: '2-digit',
                                                                month: 'short'
                                                            })
                                                            .split(',')
                                                            .reverse()
                                                            .join(' ')
                                                    }
                                                </td>
                                                <td onClick={redirectToView} style={{paddingLeft: 10}}>
                                                    {project.site}
                                                </td>
                                                <td onClick={redirectToView} style={{paddingLeft: 10}}>
                                                    {project.city}
                                                </td>
                                                <td onClick={redirectToView} style={{paddingLeft: 10}}>
                                                    {project.pages}
                                                </td>
                                                <td onClick={redirectToView} style={{paddingLeft: 10}}>
                                                    {project.queries}
                                                </td>
                                                <td onClick={redirectToView} style={{paddingLeft: 10}}>
                                                    {project.clicksPerDay}
                                                </td>
                                                <td onClick={redirectToView} style={{paddingLeft: 10}}>
                                                    {project.expensePerDay!.toLocaleString('ru-RU', {
                                                        maximumFractionDigits: 3
                                                    })}
                                                </td>
                                                <td onClick={redirectToView} style={{paddingLeft: 10}}>
                                                    {project.tariff!.toLocaleString('ru-RU', {
                                                        minimumFractionDigits: 3
                                                    })}
                                                </td>
                                                <td onClick={redirectToView} style={{paddingLeft: 10}}>
                                                    {project.expensePerMonth!.toLocaleString('ru-RU', {
                                                        maximumFractionDigits: 3
                                                    })}
                                                </td>
                                                <td onClick={redirectToView}>{project.factor!.toLocaleString('ru-RU')}</td>
                                                <td onClick={redirectToView} style={{paddingLeft: 10}}>
                                                    {new Date(project.endingAt).toLocaleDateString('ru-RU', {
                                                        year: 'numeric',
                                                        month: '2-digit',
                                                        day: '2-digit',

                                                    })
                                                        .split('.')
                                                        .reverse()
                                                        .join('-')
                                                    }
                                                </td>
                                                <td style={{width: 110}}>{
                                                    project.lastTask?.status === StatusEnum.Execute ? 'Обработка'
                                                        : project.lastTask?.status === StatusEnum.Done ? 'Крутится'
                                                            : project.lastTask?.status === StatusEnum.Error ?
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
                                                                            <div style={{paddingLeft: 9}}>{project.lastTask?.message}<br/>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                                : ''
                                                }
                                                </td>
                                                <td onClick={async () => {
                                                    await Api.DeleteProject(project._id)
                                                    await fetchProjects()
                                                }} className="site-delete">Удалить
                                                    сайт
                                                </td>
                                            </tr>
                                        )
                                    }
                                )
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PovedFactor