import React from "react"

function Footer(){
    return <footer>
        <div className='wrap'>
            <div>
                <a href='https://seobuster.ru/pc-oferta' target='_blank'>Пользовательское соглашение</a>
                <a href='https://seobuster.ru/policy' target='_blank'>Политика оплаты и возврата</a>
            </div>
            <div style={{
                marginLeft: 10,
                marginTop: 20
            }}>
                <span>@2022, seobuster.ru, info@seobuster.ru, +7-960-996-95-76</span>
            </div>
        </div>
    </footer>
}

export default Footer