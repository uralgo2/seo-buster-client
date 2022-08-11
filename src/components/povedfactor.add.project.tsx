import React, {FormEvent, useEffect, useState} from 'react'
import {ICity, Nullable} from "../utils.types";
import {Api} from "../api";
import {useNavigate} from "react-router-dom";

function PovedFactorAddProject(){
    const [cities, setCities] = useState<ICity[]>([])
    const [error, setError] = useState<Nullable<string>>(null)
    const navigate = useNavigate()

    const startupSelectize = () => {
        // @ts-ignore
        const selectizedCities = $('#select').selectize({
            sortField: 'name',
            labelField: 'name',
            searchField: 'name',
        })[0].selectize

        selectizedCities.blur()

        selectizedCities.clearOptions()

        selectizedCities.addOption(cities.map((city) => ({value: city.name, name: city.name})))

        selectizedCities.refreshOptions()


    }

    const onSubmitForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const file = (document.querySelector('#xlsxFileSite') as HTMLInputElement).files?.item(0)

        if(!file)
            return setError('Файл не прикреплен')

        const factor = (document.querySelector('#kof') as HTMLSelectElement).selectedOptions.item(0)!.value

        const city = (document.querySelector('#select') as HTMLSelectElement).selectedOptions.item(0)!.value

        if(!city)
            return setError('Город не выбран')

        const site = (document.querySelector('#site') as HTMLInputElement).value

        if(!site)
            return setError('Не указан адрес сайта')

        const uploadedFile = await Api.UploadFile(file)

        console.log(uploadedFile)

        if('error' in uploadedFile)
            return setError(uploadedFile.message)

        const result = await Api.CreateProject(file.name, uploadedFile.uploadPath, {
            city: city,
            site: site,
            factor: Number(factor)
        })

        if(!("error" in result))
            navigate('pf')
        else
            alert(JSON.stringify(result))
    }

    const fetchCities = async () => {
        const cities = await Api.GetCities()

        if(!('error' in cities)) {

            setCities(cities)
        }
    }

    useEffect(() => {
        fetchCities()
    }, [])

    useEffect(startupSelectize, [cities])
    return (
        <div className="col-md-6">
            <div className="card-box">
                <h4 className="card-title">Новый сайт</h4>
                <form onSubmit={onSubmitForm} acceptCharset='utf8'>
                    <div className="form-group">
                        <label>Адрес сайта</label>
                        <input name="site" type="text" id="site" className="form-control"/>
                    </div>
                    <div className="form-group">
                        <label>Режим кф.</label>
                        <select style={{marginLeft: 5}} name="rezim" id="kof" data-id="" data-type="rezim">
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
                    </div>

                    <div className="form-group">
                        <label>Город</label>

                        <select id="select" name="city" placeholder="Нажмите для поиска">
                            <option value="">Select a state...</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Укажите подготовленный эксель файл</label>
                        <input name="file" type="file" className="form-control" id="xlsxFileSite"
                               accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"/>
                    </div>
                    {
                        error &&
                        <p style={{textAlign: 'center', color: 'red'}}>{error}</p>
                    }
                    <div className="text-right">
                        <button type="submit" className="btn btn-primary">Добавить сайт</button>
                    </div>
                </form>

            </div>
        </div>
    )
}

export default PovedFactorAddProject