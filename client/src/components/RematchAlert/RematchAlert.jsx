import React from 'react'

export default function RematchAlert({setRematchRes, setRematchReq}) {
    function onRematch() {
        setRematchReq(null);
        setRematchRes(true);
    }
    return (
        <div className='offer-alert'>
            <h4>Accept Rematch?</h4>
            <div className='offer-alert-buttons'>
                <button onClick={() => onRematch()}>&#10004;</button>
                <button onClick={() => setRematchReq(null)}>&#10006;</button>
            </div>
        </div>
    )
}
