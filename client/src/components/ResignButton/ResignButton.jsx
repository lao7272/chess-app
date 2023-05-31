import React, { useState } from 'react';

export default function ResignButton({setResign}) {
    const [clickResign, setClickResign] = useState(false);
    function onResign () {
        setResign(true);
        setClickResign(false);
    }
    return (
        <>
            {clickResign && 
                <div className='confirm-alert'>
                    <p>Are you sure you want to resign?</p>
                    <div className='confirm-buttons'>
                        <button onClick={() => onResign()}>Yes</button><button onClick={() => setClickResign(false)}>No</button>
                    </div>
                </div>
            }
            <button onClick={() => setClickResign(true)}>Resign</button>
        </>
    )
}
