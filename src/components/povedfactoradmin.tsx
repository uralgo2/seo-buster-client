import React, {useEffect, useState} from "react";
import {formatNumber, IPagination, IProject} from "../utils.types";
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import {Api} from "../api";

function PovedFactorAdmin() {
    const [data, setData] = useState<IPagination<IProject>>({
        count: 0,
        data: []
    })

    const [searchParams] = useSearchParams()

    const page = Number(searchParams.get('page') || 1)

    const navigate = useNavigate()

    const fetchProjects = async () => {
        const projects = await Api.GetProjectsPagination()

        if(!("error" in projects)) {
            console.log(projects)
            setData(projects)
        }
    }

    useEffect(() => {
        fetchProjects()
    }, [])

    return (
        <>
            <div className="row">
                <div className="col-sm-4 col-3">
                    <h4 className="page-title">Поведенческие Факторы</h4>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <div className="table-responsive" style={{overflowX: 'unset'}}>
                        <table id="s" className="table table-striped custom-table tasks">
                            <thead>
                            <tr>
                                <th style={{width: 116, paddingLeft: 10}}>Время</th>
                                <th style={{width: 231}}>Сайт</th>
                                <th style={{width: 90}}>Город</th>
                                <th style={{width: 90}}>Cтраниц</th>
                                <th style={{width: 90}}>Пользователь</th>
                                <th style={{width: 90}}>Запросы</th>
                                <th style={{width: 90}}>Кликов\день</th>
                                <th style={{width: 90}}>Расход\день</th>
                                <th style={{width: 90}}>Тариф</th>
                                <th style={{width: 100}}>Расход мес.</th>
                                <th style={{width: 151}}>Задача</th>
                                <th style={{width: 90}}>Окончание</th>
                                <th>Статус</th>
                            </tr>
                            </thead>
                            <tbody>
                            {data?.data.slice(page * 10 - 10, page * 10).map((project =>

                                    <tr className="s" key={project._id}
                                        onClick={
                                            () => navigate(`/pf/${project._id}/view`, {
                                                replace: true
                                            })
                                        }>
                                        <td style={{paddingLeft: 10}}>
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
                                        <td>{project.site}</td>
                                        <td style={{paddingLeft: 10}}>{project.city}</td>
                                        <td style={{paddingLeft: 10}}>{project.pages}</td>
                                        <td style={{paddingLeft: 10}}>{project.user.login}</td>
                                        <td style={{paddingLeft: 10}}>{project.queries}</td>
                                        <td style={{paddingLeft: 10}}>{project.clicksPerDay}</td>
                                        <td style={{paddingLeft: 10}}>{formatNumber(project.expensePerDay, 0)}</td>
                                        <td style={{paddingLeft: 10}}>{formatNumber(project.tariff)}</td>
                                        <td style={{paddingLeft: 10}}>{project.expensePerMonth}</td>
                                        <td>{project.lastTask!.type}</td>
                                        <td>{new Date(project.endingAt).toLocaleDateString('ru-RU', {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit',

                                        })
                                            .split('.')
                                            .reverse()
                                            .join('-')
                                        }</td>
                                        <td>{project.lastTask!.status}</td>
                                    </tr>
                            ))}
                            </tbody>
                        </table>

                    </div>
                </div>
            </div>
            <div>
                {   (data?.count ?? 0) > 10 &&
                    Array.from({length: Math.ceil(data!.count/10)},
                        (_, i) => <Link key={i} to={`?page=${i+1}`}>{' '}{i+1}{' '}</Link>
                    )
                }
            </div>
        </>
    )
}

export default PovedFactorAdmin