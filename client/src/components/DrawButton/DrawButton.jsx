import React, { useState } from 'react'

export default function DrawButton({setDrawOffer}) {
    const [drawClick, setDrawClick] = useState(false);
    function onDraw () {
        setDrawOffer(true);
        setDrawClick(false)
    }

    return (
        <>
            {
                drawClick && 
                <div className='confirm-alert'>
                    <p>Do you want to offer draw?</p>
                    <div className='confirm-buttons'>
                        <button onClick={() => onDraw()}>Yes</button><button onClick={() => setDrawClick(false)}>No</button>
                    </div>
                </div>
            }
            <button onClick={() => setDrawClick(true)}>Draw</button>
        </>
    )
}
