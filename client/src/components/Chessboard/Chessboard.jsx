import React, { useRef, useState } from 'react';
import './Chessboard.css';
import Tile from '../Tile/Tile';
import { VERTICAL_AXIS, HORIZONTAL_AXIS, GRID_SIZE } from '../../Constants';
import { Position } from '../../models';

export default function Chessboard({ playMove, pieces }) {
    const [activePiece, setActivePiece] = useState(null);
    const [grabPosition, setGrabPosition] = useState({ x: -1, y: -1 });

    const chessboardRef = useRef(null);
    let board = [];

    const grabPiece = (e) => {
        const element = e.target;
        const chessboard = chessboardRef.current;
        if (element.classList.contains("chess-piece") && chessboard) {
            const grabX = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
            const grabY = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 500) / GRID_SIZE));
            setGrabPosition({ x: grabX, y: grabY });

            const x = e.clientX - GRID_SIZE / 2;
            const y = e.clientY - GRID_SIZE / 2;
            element.style.position = "absolute";
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;

            setActivePiece(element);
        }

    }

    const movePiece = async (e) => {
        const chessboard = chessboardRef.current;
        if (activePiece && chessboard) {
            const minX = chessboard.offsetLeft - 15;
            const minY = chessboard.offsetTop - 10;
            const maxX = chessboard.offsetLeft + chessboard.clientWidth - 50;
            const maxY = chessboard.offsetTop + chessboard.clientHeight - 53;

            const x = e.clientX - GRID_SIZE / 2;
            const y = e.clientY - GRID_SIZE / 2;

            let xValue = `${x}px`;
            let yValue = `${y}px`;

            // CHESSBOARD CONSTRAINTS
            if (x < minX) {
                xValue = `${minX}px`;
            } else if (x > maxX) {
                xValue = `${maxX}px`;
            }
            if (y < minY) {
                yValue = `${minY}px`;
            } else if (y > maxY) {
                yValue = `${maxY}px`;
            }

            activePiece.style.left = xValue;
            activePiece.style.top = yValue;
            activePiece.style.position = "absolute";
        }
    }

    const dropPiece = (e) => {
        const chessboard = chessboardRef.current;
        if (activePiece && chessboard) {
            const x = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
            const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 500) / GRID_SIZE));

            const currentPiece = pieces.find(p => p.samePosition(grabPosition));

            if (currentPiece) {
                const isValidMove = playMove(currentPiece.clone(), new Position(x, y)); 
                if (!isValidMove) {
                    // RESETS THE PIECE POSITION
                    activePiece.style.location = "relative";
                    activePiece.style.removeProperty('top');
                    activePiece.style.removeProperty('left');
                }
            }
        }

        setActivePiece(null);
    }

    for (let j = VERTICAL_AXIS.length - 1; j >= 0; j--) {
        for (let i = 0; i < HORIZONTAL_AXIS.length; i++) {
            const number = i + j;
            const piece = pieces.find(p => p.samePosition({ x: i, y: j }));
            const image = piece ? piece.image : undefined;
            const currentPiece = pieces.find(p => p.samePosition(grabPosition));
            let highlight;
            if (currentPiece && activePiece) highlight = currentPiece.possibleMoves ? currentPiece.possibleMoves.some(p => p.samePosition({ x: i, y: j })) : false;
            board.push(<Tile key={`${j}${i}`} number={number} image={image} highlight={highlight} />);
        }
    }
    return (
        <>
            <div
                onMouseMove={e => movePiece(e)}
                onMouseDown={e => grabPiece(e)}
                onMouseUp={e => dropPiece(e)}
                className='chessboard'
                ref={chessboardRef}
            >
                {board}
            </div>
        </>
    )
}
