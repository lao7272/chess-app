import React, { useEffect, useRef, useState } from 'react';
import './Chessboard.css';
import Square from '../Square/Square';
import { VERTICAL_AXIS, HORIZONTAL_AXIS } from '../../Constants';
import { Position } from '../../models';

export default function Chessboard({ playMove, pieces, turn }) {
    const [activePiece, setActivePiece] = useState(null);
    const [clickedPiece, setClickedPiece] = useState(null);
    const [grabPosition, setGrabPosition] = useState({ x: -1, y: -1 });
    const [chessboardLength, setChessboardLength] = useState(0);
    const [squareLength, setSquareLength] = useState(0);
    const chessboardRef = useRef(null);
    const board = [];
    useEffect(() => {
        const updateChessboardSize = () => {
            if (!chessboardRef.current) return;
            const getChessboardlength = chessboardRef.current.clientWidth;
            setChessboardLength(getChessboardlength);
            setSquareLength(getChessboardlength / 8);
        };
        window.addEventListener('resize', updateChessboardSize);
        updateChessboardSize();
        return () => {
            window.removeEventListener('resize', updateChessboardSize);
        };
    }, []);
    const grabPiece = (e) => {
        const element = e.target;
        const chessboard = chessboardRef.current;
        if (!element.classList.contains("chess-piece") || !chessboard) return;
        if(!element.classList.contains(turn)) return;
        const isTouch = e.touches ? true : false;
        const clientX = isTouch ? e.touches[0].pageX : e.clientX;
        const clientY = isTouch ? e.touches[0].pageY : e.clientY;

        const grabX = turn === 'white' ? Math.floor((clientX - chessboard.offsetLeft) / squareLength) : Math.abs(Math.ceil((clientX - chessboard.offsetLeft - chessboardLength) / squareLength));
        const grabY = turn === 'white' ? Math.abs(Math.ceil((clientY - chessboard.offsetTop - chessboardLength) / squareLength)) : Math.floor((clientY - chessboard.offsetTop) / squareLength);
        const calcCenter = squareLength / 2;
        const x = clientX - calcCenter;
        const y = clientY - calcCenter;

        element.style.position = "absolute";
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;

        setGrabPosition({ x: grabX, y: grabY });
        setActivePiece(element);
        setClickedPiece(element);
    }

    const movePiece = async (e) => {
        const chessboard = chessboardRef.current;
        if (!activePiece || !chessboard) return;
        const minX = chessboard.offsetLeft - 15;
        const minY = chessboard.offsetTop - 10;
        const maxX = chessboard.offsetLeft + chessboard.clientWidth - 50;
        const maxY = chessboard.offsetTop + chessboard.clientHeight - 53;
        const calcCenter = squareLength / 2;
        const isTouch = e.touches ? true : false;
        const x = (isTouch ? e.touches[0].pageX : e.clientX) - calcCenter;
        const y = (isTouch ? e.touches[0].pageY : e.clientY) - calcCenter;

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

    const dropPiece = (e, isGrabbed = true) => {
        const chessboard = chessboardRef.current;
        if (!chessboard) return;
        const isTouch = e.touches ? true : false;
        const clientX = isTouch ? e.changedTouches[0].pageX : e.clientX;
        const clientY = isTouch ? e.changedTouches[0].pageY : e.clientY;
        const x = turn === 'white' ? Math.floor((clientX - chessboard.offsetLeft) / squareLength) : Math.abs(Math.ceil((clientX - chessboard.offsetLeft - chessboardLength) / squareLength));
        const y = turn === 'white' ? Math.abs(Math.ceil((clientY - chessboard.offsetTop - chessboardLength) / squareLength)) : Math.floor((clientY - chessboard.offsetTop) / squareLength);
        const currentPiece = pieces.find(p => p.samePosition(grabPosition));
        if (currentPiece) {
            const isValidMove = playMove(currentPiece.clone(), new Position(x, y));
            dropElement(isValidMove, isGrabbed);
        }
    }
    const dropElement = (isValidMove, isAGrabbedPiece) => {
        const element = isAGrabbedPiece ? clickedPiece : activePiece;
        if (!isValidMove) {
            // RESETS THE PIECE POSITION
            element.style.location = "relative";
            element.style.removeProperty('top');
            element.style.removeProperty('left');
        }
        if(isAGrabbedPiece) setActivePiece(null)
        else setClickedPiece(null);
    }
    const displayBoard = (y, x, isWhiteTurn) => {
        const number = y + x;
        const position = { x, y };
        const piece = pieces.find(p => p.samePosition(position));
        const image = piece ? piece.image : undefined;
        const team = piece ? piece.team : "";
        const currentPiece = pieces.find(p => p.samePosition(grabPosition));
        let highlight = currentPiece && currentPiece.possibleMoves && currentPiece.possibleMoves.some(p => p.samePosition(position));
        let selected = currentPiece && currentPiece.samePosition(position);
        board.push(<Square key={`${x}${y}`} team={team} squareLength={squareLength} number={number} image={image} highlight={highlight} selected={selected} moveToSquare={dropPiece} turn={turn}/>);
    }
    if (turn === 'white') {
        for (let i = VERTICAL_AXIS.length - 1; i >= 0; i--) {
            for (let j = 0; j < HORIZONTAL_AXIS.length; j++) {
                displayBoard(i, j, true);
            }
        }
    } else {
        for (let i = 0; i < VERTICAL_AXIS.length; i++) {
            for (let j = HORIZONTAL_AXIS.length - 1; j >= 0; j--) {
                displayBoard(i, j, false);
            }
        }
    }
    return (
        <>
            <div
                onMouseMove={e => movePiece(e)}
                onMouseDown={e => grabPiece(e)}
                onMouseUp={e => dropPiece(e)}
                onTouchMove={e => movePiece(e)}
                onTouchStart={e => grabPiece(e)}
                onTouchEnd={e => dropPiece(e)}
                className='chessboard'
                ref={chessboardRef}>
                {board}
            </div>
        </>
    )
}
