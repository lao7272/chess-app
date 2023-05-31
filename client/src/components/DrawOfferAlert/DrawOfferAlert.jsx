import React from 'react'
import './DrawOfferAlert.css'

export default function drawOfferAlert({ setDrawOfferReq, setDrawOfferRes }) {
    function onAccept () {
        setDrawOfferReq(null);
        setDrawOfferRes(true);
    }
    return (
        <div className='offer-alert'>
            <h4>Accept Draw?</h4>
            <div className='offer-alert-buttons'>
                <button onClick={() => onAccept()}>&#10004;</button>
                <button onClick={() => setDrawOfferReq(null)}>&#10006;</button>
            </div>
        </div>
    )
}
