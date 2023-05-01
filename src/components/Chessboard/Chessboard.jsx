import React, {  useRef, useState } from 'react';
import './Chessboard.css';
import Tile from '../Tile/Tile';
import Referee from '../../referee/referee'
import {VERTICAL_AXIS, HORIZONTAL_AXIS, INITIAL_CHESSBOARD_STATE, GRID_SIZE, samePosition} from '../../Constants';

export default function Chessboard() {
    const [activePiece, setActivePiece] = useState(null);
    const [pawnPromotion, setpawnPromotion] = useState();
    const [grabPosition, setGrabPosition] = useState({x: -1, y: -1});
    const [pieces, setPieces] = useState(INITIAL_CHESSBOARD_STATE);

    const referee = new Referee();
    const chessboardRef = useRef(null);
    const promoteRef = useRef(null);
    let board = [];


const grabPiece = (e) => {
    const element = e.target;
    const chessboard = chessboardRef.current;
    if (element.classList.contains("chess-piece") && chessboard){
        const grabX = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
        const grabY = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 500) / GRID_SIZE));
        setGrabPosition({x: grabX, y: grabY});

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
        const minX = chessboard.offsetLeft - 15 ;
        const minY = chessboard.offsetTop - 10;
        const maxX = chessboard.offsetLeft + chessboard.clientWidth - 50;
        const maxY = chessboard.offsetTop + chessboard.clientHeight - 53;

        const x = e.clientX - GRID_SIZE / 2;
        const y = e.clientY - GRID_SIZE / 2;

        let xValue = `${x}px`;
        let yValue = `${y}px`;

        // CHESSBOARD CONSTRAINTS
        if(x < minX) {
            xValue = `${minX}px`;
        } else if(x > maxX) {
            xValue = `${maxX}px`;
        } 
        if(y < minY) {
            yValue = `${minY}px`;
        } else if(y > maxY) {
            yValue = `${maxY}px`;
        } 

        activePiece.style.left = xValue;
        activePiece.style.top = yValue;
        activePiece.style.position = "absolute"; 
    }
}

const dropPiece = (e) => {
    const chessboard = chessboardRef.current;
    if(activePiece){
        const x = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
        const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 500) / GRID_SIZE));
        
        const currentPiece = pieces.find(p => samePosition(p.position, grabPosition));
        
        if (currentPiece) {
            const validMove = referee.isValidMove(
                grabPosition,
                {x, y}, 
                pieces,
                currentPiece.team, 
                currentPiece.type, 
                );
            
            const isEnPassantCapture = referee.isEnPassantCapture(
                grabPosition,
                {x, y}, 
                pieces,
                currentPiece.team, 
                currentPiece.type,
                );
            const pawnDirection = currentPiece.team === 'white' ? 1 : -1;
            if(isEnPassantCapture) {
                const updatedPieces = pieces.reduce((result, piece) => {
                    if (samePosition(piece.position, grabPosition)) {
                        piece.enPassant = false;
                        piece.position.x = x;
                        piece.position.y = y;
                        result.push(piece)
                    } else if (!samePosition(piece.position, {x, y: y - pawnDirection})) {
                        if(piece.type === "PAWN") {
                            piece.enPassant = false;
                        }
                        result.push(piece);
                    }
                    return result
                }, []);
                setPieces(updatedPieces)
            } else if (validMove) {
                // UPDATES THE PIECE POSITION AND CAPTURES
                const updatedPieces = pieces.reduce((result, piece) =>{
                    if (samePosition(piece.position, grabPosition)) {
                        // Special pawn move
                        piece.enPassant = Math.abs(grabPosition.y - y) === 2 && piece.type === 'PAWN';
                        
                        piece.position.x = x;
                        piece.position.y = y;
                        const promotion = piece.team === "white" ? 7 : 0;
                        if(y === promotion && piece.type === "PAWN"){
                            promoteRef.current.classList.remove("hidden");
                            setpawnPromotion(piece);
                        }
                        result.push(piece);
                    } else if(!samePosition(piece.position, {x,y})) {
                        if(piece.type === "PAWN") {
                            piece.enPassant = false;
                        }
                        result.push(piece);
                    }
                    return result
                }, []);
                setPieces(updatedPieces)
            } else {
                // RESETS THE PIECE POSITION
                activePiece.style.location = "absolute";
                activePiece.style.removeProperty('top');
                activePiece.style.removeProperty('left');
            }
        }

        setActivePiece(null);
    }
}

function promotePawn (type) {
    if (!pawnPromotion) return;
    let imageType = '';
    switch (type) {
        case 'QUEEN':
            imageType = 'queen';
            break
        case 'KNIGHT':
            imageType = 'knight';
            break
        case 'ROOK':
            imageType = 'rook';
            break
        case 'BISHOP':
            imageType = 'bishop';
            break
        default:
            imageType = '';
    }
    const imageTeam = pawnPromotion.team === "white" ? "white" : "black";
    promoteRef.current.classList.add('hidden')
    const updatedPieces = pieces.reduce((result, piece) => {
        if (samePosition(pawnPromotion.position, piece.position)) {
            piece.type = type;
            piece.image = `./assets/images/${imageTeam}-${imageType}.png`;
        }
        result.push(piece);
        return result;
    }, []);
    setPieces(updatedPieces);
}

function setPromotionTeam () {
    if (!pawnPromotion) return "white";
    return pawnPromotion.team === "white" ? "white" : "black";
}

    for (let j = VERTICAL_AXIS.length - 1; j >= 0; j--) {
        for (let i = 0; i < HORIZONTAL_AXIS.length; i++){
            const number = i + j;
            const piece = pieces.find(p => samePosition(p.position, {x: i, y: j}));
            const image = piece ? piece.image : undefined;
            board.push(<Tile key={`${j}${i}`} number={number} image={image}/>);
        }
    }
    return (
        <>

            <div className='pawn-promotion-container hidden' ref={promoteRef}>
                <div className='pawn-promotion-body'>
                    <div onClick={() => promotePawn("QUEEN")} className='piece-promotion-option'><img src={`../assets/images/${setPromotionTeam()}-queen.png`} alt="Queen" /></div>
                    <div onClick={() => promotePawn("KNIGHT")} className='piece-promotion-option'><img src={`../assets/images/${setPromotionTeam()}-knight.png`} alt="Knight" /></div>
                    <div onClick={() => promotePawn("BISHOP")} className='piece-promotion-option'><img src={`../assets/images/${setPromotionTeam()}-bishop.png`} alt="Bishop" /></div>
                    <div onClick={() => promotePawn("ROOK")} className='piece-promotion-option'><img src={`../assets/images/${setPromotionTeam()}-rook.png`} alt="Rook" /></div>
                </div>
            </div>
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
