import React, { useRef, useState } from 'react';
import './Chessboard.css';
import Tile from '../Tile/Tile';
import { VERTICAL_AXIS, HORIZONTAL_AXIS, GRID_SIZE } from '../../Constants';
import { Position } from '../../models';

export default function Chessboard({ playMove, pieces, turn }) {
    const [activePiece, setActivePiece] = useState(null);
    const [grabPosition, setGrabPosition] = useState({ x: -1, y: -1 });

    const chessboardRef = useRef(null);
    let board = [];

    const grabPiece = (e) => {
        const element = e.target;
        const chessboard = chessboardRef.current;
        if (element.classList.contains("chess-piece") && chessboard) {
            const grabX = turn === 'white' ? Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE) : Math.abs(Math.ceil((e.clientX - chessboard.offsetLeft - 500) / GRID_SIZE));
            const grabY = turn === 'white' ? Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 500) / GRID_SIZE)) : Math.floor((e.clientY - chessboard.offsetTop) / GRID_SIZE);
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
            const x = turn === 'white' ? Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE) : Math.abs(Math.ceil((e.clientX - chessboard.offsetLeft - 500) / GRID_SIZE));
            const y = turn === 'white' ? Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 500) / GRID_SIZE)) : Math.floor((e.clientY - chessboard.offsetTop) / GRID_SIZE);
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
    

    if (turn === 'white') {
        for (let i = VERTICAL_AXIS.length - 1; i >= 0; i--) {
            for (let j = 0; j < HORIZONTAL_AXIS.length; j++) {
                const number = j + i;
                const piece = pieces.find(p => p.samePosition({ x: j, y: i }));
                const image = piece ? piece.image : undefined;
                const currentPiece = pieces.find(p => p.samePosition(grabPosition));
                let highlight;
                if (currentPiece && activePiece) highlight = currentPiece.possibleMoves ? currentPiece.possibleMoves.some(p => p.samePosition({ x: j, y: i })) : false;
                board.push(<Tile key={`${j}${i}`} number={number} image={image} highlight={highlight} />);
                
            }
        }
    } else {
        for (let i = 0; i < VERTICAL_AXIS.length; i++) {
            for (let j = HORIZONTAL_AXIS.length - 1; j >= 0 ; j--) {
                const number = j + i;
                const piece = pieces.find(p => p.samePosition({ x: j, y: i }));
                const image = piece ? piece.image : undefined;
                const currentPiece = pieces.find(p => p.samePosition(grabPosition));
                let highlight;
                if (currentPiece && activePiece) highlight = currentPiece.possibleMoves ? currentPiece.possibleMoves.some(p => p.samePosition({ x: j, y: i })) : false;
                board.push(<Tile key={`${i}${j}`} number={number} image={image} highlight={highlight} />);
            }
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
