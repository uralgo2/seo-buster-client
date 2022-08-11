import React, {ChangeEvent, Dispatch, FormEvent, SetStateAction, useState} from "react"
import {formatNumber, ICalculatedResult, ICalculatedResultRow, IDefaults, IXLSXRow, Nullable} from "../utils.types";

// @ts-ignore
import * as XLSX from 'ts-xlsx'
import {Api} from "../api";

interface ICalculatorProps {
    _defaults: IDefaults
    _setDefaults: Dispatch<SetStateAction<IDefaults>>
}

function Calculator({_defaults, _setDefaults}: ICalculatorProps) {

    const [defaults, setDefaults] = useState<IDefaults>(_defaults)
    const [file, setFile] = useState<Nullable<File>>(null)
    const [calculatedResult, setCalculatedResult] = useState<Nullable<ICalculatedResult>>(null)
    const [error, setError] = useState<Nullable<string>>(null)

    const onFormInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name
        const value = e.target.value

        const _defaults = structuredClone(defaults)

        _defaults[name] = value

        setDefaults(_defaults as IDefaults)
    }

    const onFormSaveDefaults = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        await Api.SaveDefaults(defaults)

        _setDefaults(defaults)
    }

    const onFormCalculate = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if(!file) return

        const reader = new FileReader();
        reader.onload = (e) => {
            const bStr = e.target?.result;
            const wb = XLSX.read(bStr, {type:'binary'});

            const wsName = wb.SheetNames[0];
            const ws = wb.Sheets[wsName];

            const data = XLSX.utils.sheet_to_json(ws, {
                header: [
                    'url', 'query', 'frequency'
                ]
            }) as IXLSXRow[];

            if(Object.keys(data[0]).length !== 3)
                return setError('Должно быть три столбца. < Урл. Запроc. Частотность. >')

            let rows: ICalculatedResultRow[] = []
            let dataAsString: string = ''
            let uniquePages: Set<string> = new Set<string>()
            let totalSum: number = 0

            const magicPkfA = [
                [0.05,-5.1,7,0.142857143],
                [0.1,-4.1,6,0.166666666],
                [0.2,-3.1,5,0.2],
                [0.3,-2.1,4,0.25],
                [0.45,-1.1,3,0.33333333],
                [0.7001,0.1,2,0.5],
            ]

            let sumOfFrequency = 0

            for(const row of data) {
                if(!uniquePages.has(row.url))
                    uniquePages.add(row.url)

                if(!row.frequency)
                    continue

                sumOfFrequency += Number(row.frequency)

                const day = row.frequency / 30
                const factorPerDay = row.frequency / 30 * defaults.factor

                let total = 0

                let magicSpec = true

                for(const magicPkf of magicPkfA){
                    if(factorPerDay < magicPkf[0]){
                        total = magicPkf[1]
                        totalSum += magicPkf[3]

                        magicSpec = false

                        break
                    }
                }

                if(magicSpec)
                    totalSum += total = Math.round(factorPerDay)

                const paste = `${row.url};${row.query 
                    + (defaults.pristavka1 ? '|' + defaults.pristavka1 : '')
                    + (defaults.pristavka2 ? '|' + defaults.pristavka2 : '')
                    + (defaults.pristavka3 ? '|' + defaults.pristavka3 : '')
                };${total.toLocaleString('ru-RU')};${defaults.sclick};&lr=${defaults.geo};`

                dataAsString += paste + '\n'

                const calculatedRow: ICalculatedResultRow = {
                    day: day,
                    factorPerDay: factorPerDay,
                    paste: paste,
                    query: row.query,
                    total: total,
                    url: row.url
                }

                rows.push(calculatedRow)
            }

            const clicksPerDay = Math.round(totalSum)
            const accounts = Math.round(clicksPerDay * defaults.accountsFactor)
            const proxies = Math.round(clicksPerDay / defaults.proxies)
            const price = Math.round(proxies * defaults.price)

            console.log(sumOfFrequency)
            const myClickPerDay = Math.ceil(sumOfFrequency / 30 * 0.5)

            const tariff = clicksPerDay < 75 ? 0.110
                : clicksPerDay < 125 ? 0.102
                    : clicksPerDay < 200 ? 0.082
                        : clicksPerDay < 250 ? 0.073
                            : clicksPerDay < 350 ? 0.066
                                : clicksPerDay < 450 ? 0.059
                                    : 0.055

            const pricePerDay = tariff * myClickPerDay


            setCalculatedResult({
                accounts: accounts,
                clicksPerDay: clicksPerDay,
                dataAsString: dataAsString,
                proxies: proxies,
                queriesCount: data.length,
                rows: rows,
                uniquePagesCount: uniquePages.size,
                price: price,
                tariff: tariff,
                pricePerDay: pricePerDay
            })
        };

        reader.readAsBinaryString(file);
    }

    const onChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
        setFile(e.target.files?.item(0) as Nullable<File>)
    }


    return (
        <>
            <h4 className="page-title">Калькулятор</h4>
            {
                error &&
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                    {error}
                    <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true" onClick={() => setError(null)}>
                            ×
                        </span>
                    </button>
                </div>
            }
            <div className="card-box">
                <h4 className="card-title">Параметры</h4>
                <form className="pars" id="pars_form" onSubmit={onFormSaveDefaults}>
                    <div className="form-group">
                        <input name="factor" type="number" className="form-control" value={defaults.factor} onChange={onFormInputChange}/>
                        <label>Кф </label>
                    </div>
                    <div className="form-group">
                        <input name="accountsFactor" type="number" className="form-control" value={defaults.accountsFactor} onChange={onFormInputChange}/>
                        <label>x Аккаунтов </label>
                    </div>
                    <div className="form-group">
                        <input name="proxy" type="number" className="form-control" value={defaults.proxies} onChange={onFormInputChange}/>
                        <label>Прокси </label>
                    </div>
                    <div className="form-group">
                        <input name="price" type="number" className="form-control" value={defaults.price} onChange={onFormInputChange}/>
                        <label>Стоимость в месяц </label>
                    </div>
                    <div className="form-group">
                        <input name="geo" type="number" className="form-control" value={defaults.geo} onChange={onFormInputChange}/>
                        <label>Гео </label>
                    </div>
                    <div className="form-group">
                        <input name="sclick" type="number" className="form-control" value={defaults.sclick} onChange={onFormInputChange}/>
                        <label>Склик </label>
                    </div>
                    <div className="form-group">
                        <input name="pristavka1" type="text" className="form-control" value={defaults.pristavka1} onChange={onFormInputChange}/>
                        <label>Приставка1 </label>
                    </div>
                    <div className="form-group">
                        <input name="pristavka2" type="text" className="form-control" value={defaults.pristavka2} onChange={onFormInputChange}/>
                        <label>Приставка2 </label>
                    </div>
                    <div className="form-group">
                        <input name="pristavka3" type="text" className="form-control" value={defaults.pristavka3} onChange={onFormInputChange}/>
                        <label>Приставка3 </label>
                    </div>
                    <div className="text-right">
                        <button type="submit" className="btn btn-primary">Сохранить как дефолтные</button>
                    </div>
                </form>
            </div>
            <div className="card-box">
                {
                    calculatedResult &&
                    <h3 className="">Цена: <span>{calculatedResult.price} руб.</span></h3>
                }
                <form id="calc_form" onSubmit={onFormCalculate}>
                    <input type="file" name="filename" accept=".xlsx" id="filename" className="form-control filename" onChange={onChangeFile}/>
                    <div className="text-right">
                        <button type="submit"
                                className="btn btn-primary">Рассчитать
                        </button>
                    </div>
                </form>

            </div>
            {
                calculatedResult &&
                <div className="col-md-12 admin-table">
                    <h4>Кликов\день: <span className="usc"> {calculatedResult.clicksPerDay} </span></h4>
                    <h4>Стоимость\день: <span className="usc"> {formatNumber(calculatedResult.pricePerDay, 0)} </span></h4>
                    <h4>Тариф: <span className="usc"> {formatNumber(calculatedResult.tariff)} </span></h4>
                    <h4>Аккаунтов: <span className="usc"> {calculatedResult.accounts} </span></h4>
                    <h4>Прокси: <span className="usc"> {calculatedResult.proxies} </span></h4>
                    <h4>Колличество запросов: <span className="usc"> {calculatedResult.queriesCount} </span></h4>
                    <h4>Колличество уникальных страниц: <span className="usc"> {calculatedResult.uniquePagesCount} </span></h4>
                    <textarea autoComplete="off" rows={10} style={{width: '100%'}} value={calculatedResult.dataAsString} />
                    <div className="table-responsive" style={{overflowX: 'unset'}}>
                        <table className="table table-striped custom-table">
                            <thead>
                            <tr>
                                <th>Урл</th>
                                <th>Запрос</th>
                                <th>Итого</th>
                                <th>День Кф</th>
                                <th>День</th>
                                <th>Вставка</th>
                            </tr>
                            </thead>

                            <tbody>
                            {
                                calculatedResult.rows.map(row =>
                                    <tr>
                                        <td>{row.url}</td>
                                        <td>{row.query}</td>
                                        <td>{row.total}</td>
                                        <td>{formatNumber(row.factorPerDay, 2, 2)}</td>
                                        <td>{formatNumber(row.day, 2, 2)}</td>
                                        <td>{row.paste}</td>
                                    </tr>
                                )
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
            }
        </>
    )
}

export default Calculator