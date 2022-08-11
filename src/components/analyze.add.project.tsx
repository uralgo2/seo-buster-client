import React, {useEffect, useState} from "react"
import {ICity} from "../utils.types"

function AnalyzeAddProject (){
    const [cities, setCities] = useState<ICity[]>()

    const useSelectize = () => {
        // @ts-ignore
        $('#select').selectize({
            sortField: 'text'
        });
    }

    useEffect(useSelectize)

    return (
        <div className="col-md-6">
            <div className="card-box">
                <h4 className="card-title">Новый сайт</h4>

                <form action="/" method="post">
                    <div className="form-group">
                        <label>Название задачи</label>
                        <input name="job_name" type="text" className="form-control"/>
                    </div>
                    <div className="form-group">
                        <label>Адрес сайта</label>
                        <input name="site" type="text" className="form-control"/>
                    </div>
                    <div className="form-group">
                        <label>Город</label>

                        <select id="select" name="city" placeholder="Нажмите для поиска">
                            <option value="">Select a state...</option>
                            {
                                cities?.map(city =>  <option value={city.id}>{city.name}</option>)
                            }
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Запросы </label>
                        <textarea name="keywords" className="form-control" rows={15} style={{}}/>
                    </div>
                    <input type="hidden" name="add" value="site"/>
                    <div className="text-right">
                        <button type="submit" className="btn btn-primary">Добавить сайт</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AnalyzeAddProject