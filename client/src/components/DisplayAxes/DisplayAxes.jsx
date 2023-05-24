import React from 'react';
import { VERTICAL_AXIS, HORIZONTAL_AXIS } from '../../Constants';
import "./DisplayAxes.css"

export default function DisplayAxis({ turn }) {
    const axes = [];
    const vertical = [...VERTICAL_AXIS].reverse();
    for (let i = -1; i < 2; i += 2) {
        const axis = i === -1 ? HORIZONTAL_AXIS : vertical;
        for (let j = -1; j < 2; j += 2) {
            const axisVar = j === -1 ? "a" : "b";
            const axisClass = [
                i === -1 ? "horizontal" : "vertical",
                i === -1 ? `h-${axisVar}` : `v-${axisVar}`,
                turn === "white" ? "" : i === -1 ? "h-reverse" : "v-reverse"  
            ].join(" ");

            axes.push(<div key={`${i}${j}`} className={axisClass}>{
                axis.map(a => <p key={`${a}${j}`}>{a}</p>)
            }</div>)
        }
    }
    return axes;
}
