import React, {ChangeEvent, FormEvent, useState} from "react";
import {formatNumber, IPriceCalculatedResult, Nullable} from "../utils.types";

function PriceCalculator () {

    const [frequency, setFrequency] = useState<number>(11300)
    const [prettyFrequency, setPrettyFrequency] = useState<string>('11 300')
    const [result, setResult] = useState<Nullable<IPriceCalculatedResult>>(null)

    const makePretty = (val: number) : string => {
            return val
                .toLocaleString('ru-RU')
    }

    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
                    .replaceAll(/[^0-9]/g, '')

        const asInt = Number.parseInt(value) || 0

        const pretty = makePretty(asInt)

        setFrequency(asInt)
        setPrettyFrequency(pretty)
    }

    const onCalculateButtonClick = function (e: FormEvent<HTMLButtonElement>) {
        const clicksPerDay = Math.ceil(frequency / 30 * 0.5)

        const tariff = clicksPerDay < 75 ? 0.110
                        : clicksPerDay < 125 ? 0.102
                        : clicksPerDay < 200 ? 0.082
                        : clicksPerDay < 250 ? 0.073
                        : clicksPerDay < 350 ? 0.066
                        : clicksPerDay < 450 ? 0.059
                        : 0.055

        const pricePerDay = tariff * clicksPerDay
        const pricePerMonth = pricePerDay * 30

        setResult({
            clicksPerDay: clicksPerDay,
            pricePerDay: pricePerDay,
            pricePerMonth: pricePerMonth,
            tariff: tariff
        })
    }

    return (
        <>
            <h4 className="page-title">Калькулятор Стоимости</h4>
            <p style={{
                width: '50vw',
                fontSize: 16,
                color: 'black',
                margin: 10
            }}>
                Для расчета стоимости, укажите в поле сумму "Частоты" в кавычках всех запросов по нужному городу и нажмите кнопку справа.
                <br/><br/>
                Важно: продвижение по одному запросу - не даст эффекта.
                <br/><br/>
                Должны быть собрана большая часть запросов для каждой из продвигаемых страниц, иначе система будет расширять самостоятельно, что станет не прогнозируемо для вас по цене.
            </p>
            <br/>
            <h4 style={{
                color: 'black'
            }}>Тарифы</h4>
            <br/>
            <table>
                <thead>
                    <tr className="calc-top">
                        <th><div>Кликов<br/> в день</div></th>
                        <th><div>до 75</div></th>
                        <th><div>до 125</div></th>
                        <th><div>до 200</div></th>
                        <th><div>до 250</div></th>
                        <th><div>до 350</div></th>
                        <th><div>до 450</div></th>
                        <th><div>Больше</div></th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="calc-down">
                        <td><div>Цена 1 клика</div></td>
                        <td><div>0,110 ₽</div></td>
                        <td><div>0,102 ₽</div></td>
                        <td><div>0,082 ₽</div></td>
                        <td><div>0,073 ₽</div></td>
                        <td><div>0,066 ₽</div></td>
                        <td><div>0,059 ₽</div></td>
                        <td><div>0,055 ₽</div></td>
                    </tr>
                </tbody>
            </table>
            <br/><br/>
            <div className="frequencyWrapper">
                <div className="row">
                    <input className="frequencyInput" type="text" value={prettyFrequency} onChange={onInputChange}/>
                    <button className="calculateButton" onClick={onCalculateButtonClick}>Рассчитать</button>
                </div>
                <div className="row">
                    <i className="frequencyInputLabel">Сумма "частоты" запросов</i>
                </div>
            </div>
            {
                result &&
                <div className="calculateResult">
                    <div className="row">
                        <p>Кликов в день</p>
                        <p>{result.clicksPerDay} кликов</p>
                    </div>

                    <div className="line"/>

                    <div className="row">
                        <p>Тариф</p>
                        <p>{formatNumber(result.tariff)} руб.</p>
                    </div>

                    <div className="line"/>

                    <div className="row">
                        <p>Стоимость в день</p>
                        <p>{formatNumber(result.pricePerDay)} руб.</p>
                    </div>

                    <div className="line"/>

                    <div className="row">
                        <p>Стоимость в месяц</p>
                        <p>{formatNumber(result.pricePerMonth)} руб.</p>
                    </div>
                </div>
            }
        </>
    )
}

export default PriceCalculator