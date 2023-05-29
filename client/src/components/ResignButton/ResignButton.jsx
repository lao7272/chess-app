import React, { useState } from 'react';
import './ResignButton.css';

export default function ResignButton({setResign}) {
    const [clickResign, setClickResign] = useState(false);
    function onResign () {
        setResign(true);
        setClickResign(false);
    }
    return (
        <>
            {clickResign && 
                <div className='confirmResign'>
                    <p>Are you sure you want to resign?</p>
                    <div className='confirmResignButton'>
                        <button onClick={() => onResign()}>Yes</button><button onClick={() => setClickResign(false)}>No</button>
                    </div>
                </div>
            }
            <button onClick={() => setClickResign(true)}>Resign</button>
        </>
    )
}
