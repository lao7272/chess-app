const GRID_SIZE = 62.5; //3.90625

const VERTICAL_AXIS = ['1', '2', '3', '4', '5', '6', '7', '8'];
const HORIZONTAL_AXIS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

const samePosition = (p1, p2) => {
    return p1.x === p2.x && p1.y === p2.y;
}

const INITIAL_CHESSBOARD_STATE = [
    {
        image: './assets/images/black-rook.png',
        position: {
            x: 0,
            y: 7
        },
        type: 'ROOK',
        team: 'black'
    },
    {
        image: './assets/images/black-rook.png',
        position: {
            x: 7,
            y: 7
        },
        type: 'ROOK',
        team: 'black'
    },
    {
        image: './assets/images/black-knight.png',
        position: {
            x: 1,
            y: 7
        },
        type: 'KNIGHT',
        team: 'black'
    },
    {
        image: './assets/images/black-knight.png',
        position: {
            x: 6,
            y: 7
        },
        type: 'KNIGHT',
        team: 'black'
    },
    {
        image: './assets/images/black-bishop.png',
        position: {
            x: 2,
            y: 7
        },
        type: 'BISHOP',
        team: 'black'
    },
    {
        image: './assets/images/black-bishop.png',
        position: {
            x: 5,
            y: 7
        },
        type: 'BISHOP',
        team: 'black'
    },
    {
        image: './assets/images/black-queen.png',
        position: {
            x: 3,
            y: 7
        },
        type: 'QUEEN',
        team: 'black'
    },
    {
        image: './assets/images/black-king.png',
        position: {
            x: 4,
            y: 7
        },
        type: 'KING',
        team: 'black'
    },
    {
        image: './assets/images/white-rook.png',
        position: {
            x: 0,
            y: 0
        },
        type: 'ROOK',
        team: 'white'
    },
    {
        image: './assets/images/white-rook.png',
        position: {
            x: 7,
            y: 0
        },
        type: 'ROOK',
        team: 'white'
    },
    {
        image: './assets/images/white-knight.png',
        position: {
            x: 1,
            y: 0
        },
        type: 'KNIGHT',
        team: 'white'
    },
    {
        image: './assets/images/white-knight.png',
        position: {
            x: 6,
            y: 0
        },
        type: 'KNIGHT',
        team: 'white'
    },
    {
        image: './assets/images/white-bishop.png',
        position: {
            x: 2,
            y: 0
        },
        type: 'BISHOP',
        team: 'white'
    },
    {
        image: './assets/images/white-bishop.png',
        position: {
            x: 5,
            y: 0
        },
        type: 'BISHOP',
        team: 'white'
    },
    {
        image: './assets/images/white-queen.png',
        position: {
            x: 3,
            y: 0
        },
        type: 'QUEEN',
        team: 'white'
    },
    {
        image: './assets/images/white-king.png',
        position: {
            x: 4,
            y: 0
        },
        type: 'KING',
        team: 'white'
    },
    {
        image: './assets/images/black-pawn.png',
        position: {
            x: 0,
            y: 6
        },
        type: 'PAWN',
        team: 'black'
    },
    {
        image: './assets/images/white-pawn.png',
        position: {
            x: 0,
            y: 1
        },
        type: 'PAWN',
        team: 'white'
    },
    {
        image: './assets/images/black-pawn.png',
        position: {
            x: 1,
            y: 6
        },
        type: 'PAWN',
        team: 'black'
    },
    {
        image: './assets/images/white-pawn.png',
        position: {
            x: 1,
            y: 1
        },
        type: 'PAWN',
        team: 'white'
    },
    {
        image: './assets/images/black-pawn.png',
        position: {
            x: 2,
            y: 6
        },
        type: 'PAWN',
        team: 'black'
    },
    {
        image: './assets/images/white-pawn.png',
        position: {
            x: 2,
            y: 1
        },
        type: 'PAWN',
        team: 'white'
    },
    {
        image: './assets/images/black-pawn.png',
        position: {
            x: 3,
            y: 6
        },
        type: 'PAWN',
        team: 'black'
    },
    {
        image: './assets/images/white-pawn.png',
        position: {
            x: 3,
            y: 1
        },
        type: 'PAWN',
        team: 'white'
    },
    {
        image: './assets/images/black-pawn.png',
        position: {
            x: 4,
            y: 6
        },
        type: 'PAWN',
        team: 'black'
    },
    {
        image: './assets/images/white-pawn.png',
        position: {
            x: 4,
            y: 1
        },
        type: 'PAWN',
        team: 'white'
    },
    {
        image: './assets/images/black-pawn.png',
        position: {
            x: 5,
            y: 6
        },
        type: 'PAWN',
        team: 'black'
    },
    {
        image: './assets/images/white-pawn.png',
        position: {
            x: 5,
            y: 1
        },
        type: 'PAWN',
        team: 'white'
    },
    {
        image: './assets/images/black-pawn.png',
        position: {
            x: 6,
            y: 6
        },
        type: 'PAWN',
        team: 'black'
    },
    {
        image: './assets/images/white-pawn.png',
        position: {
            x: 6,
            y: 1
        },
        type: 'PAWN',
        team: 'white'
    },
    {
        image: './assets/images/black-pawn.png',
        position: {
            x: 7,
            y: 6
        },
        type: 'PAWN',
        team: 'black'
    },
    {
        image: './assets/images/white-pawn.png',
        position: {
            x: 7,
            y: 1
        },
        type: 'PAWN',
        team: 'white'
    }
];

export {
    HORIZONTAL_AXIS,
    VERTICAL_AXIS, 
    INITIAL_CHESSBOARD_STATE,
    GRID_SIZE,
    samePosition
}