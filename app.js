document.addEventListener('DOMContentLoaded', () => {

function createGrid() {
    let gridcells = "";
    let takencells = "";
    let grid = document.getElementById("grid");

    for (let i = 0; i < 200; i++) {
      gridcells += "<div class='grid-item'></div>";
    }

    for (let j = 0; j < 10; j++) {
        takencells += "<div class='taken'></div>"
    }

    grid.innerHTML = gridcells + takencells;
}

createGrid();

function createMiniGrid() {
    let gridcells = "";
    let grid = document.getElementById("mini-grid");

    for (let k = 0; k < 16; k++) {
        gridcells += "<div class='mini-grid-item'></div>";
      }

    grid.innerHTML = gridcells;
}

createMiniGrid();

const gridcontainer = document.querySelector("#grid");
let gridcells = Array.from(document.querySelectorAll(".grid-item")).concat(Array.from(document.querySelectorAll(".taken")));
const scoreDisplay = document.querySelector("#score");
const playBtn = document.querySelector("#play-button");
const width = 10;

const lTetromino = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
]

const slTetromino = [
    [0, 1, width+1, width*2+1],
    [width, width*2, width+1, width+2],
    [1, width+1, width*2+1, width*2+2],
    [width, width+1, width+2, 2]
]

const zTetromino = [
    [0, width, width+1, width*2+1],
    [width+1, width+2, width*2, width*2+1],
    [0, width, width+1, width*2+1],
    [width+1, width+2, width*2, width*2+1]
]

const szTetromino = [
    [1, width+1, width, width*2],
    [width, width+1, width*2+1, width*2+2],
    [1, width+1, width, width*2],
    [width, width+1, width*2+1, width*2+2]
]

const tTetromino = [
    [1, width, width+1, width+2],
    [1, width+1, width+2, width*2+1],
    [width, width+1, width+2, width*2+1],
    [1, width, width+1, width*2+1]
]

const oTetromino = [
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1]
]

const iTetromino = [
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3],
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3]
]

const tetrominoes = [lTetromino, slTetromino, zTetromino, szTetromino, tTetromino, oTetromino, iTetromino]

let timerId;
let score = 0;
let currentPosition = 4;
let currentRotation = 0;
let random = Math.floor(Math.random()*tetrominoes.length);
let current = tetrominoes[random][currentRotation];
let nextRandom = 0;
const colors = [
    'blue',
    'orange',
    'green',
    'red',
    'purple',
    'yellow',
    'lightblue'
]

function draw() {
    current.forEach(index => {
        gridcells[currentPosition + index].classList.add('tetromino');
        gridcells[currentPosition + index].style.backgroundColor = colors[random];
    });
}

function undraw() {
    current.forEach(index => {
        gridcells[currentPosition + index].classList.remove('tetromino');
        gridcells[currentPosition + index].style.backgroundColor = "";
    })
}

function control(e) {
    if(e.keyCode === 65 || e.keyCode === 37) {
        moveLeft();
    } else if (e.keyCode === 87|| e.keyCode === 38) {
        rotate();
    } else if(e.keyCode === 68|| e.keyCode === 39) {
        moveRight();
    } else if (e.keyCode === 83|| e.keyCode === 40) {
        moveDown();
    }
}

document.addEventListener('keyup', control);

function moveDown() {
    undraw();
    currentPosition += width;
    draw();
    freeze();
}

function freeze() {
    if (current.some(index => gridcells[currentPosition + index + width].classList.contains('taken'))) {
        current.forEach(index => gridcells[currentPosition + index].classList.add('taken'));
        random = nextRandom;
        nextRandom = Math.floor(Math.random() * tetrominoes.length);
        current = tetrominoes[random][currentRotation];
        currentPosition = 4;
        draw();
        displayShape();
        addScore();
        endGame();
    }
}

function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);

    if (!isAtLeftEdge) {
        currentPosition -= 1;
    }

    if (current.some(index => gridcells[currentPosition + index].classList.contains('taken'))) {
        currentPosition +=1;
    }

    draw();
}

function moveRight() {
    undraw();
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === 9)

    if (!isAtRightEdge) {
        currentPosition += 1;
    }

    if (current.some(index => gridcells[currentPosition + index].classList.contains('taken'))) {
        currentPosition -=1;
    }

    draw();
}

function rotate() {
    undraw();

    currentRotation++;
    
    if (currentRotation === current.length) {
        currentRotation = 0;
    }

    current = tetrominoes[random][currentRotation];

    draw();
}

const miniGridCells = document.querySelectorAll(".mini-grid-item");
const displayWidth = 4;
const displayIndex = 0;

const upNextTetrominoes = [
    [1, displayWidth+1, displayWidth*2+1, 2], // l
    [0, 1, displayWidth+1, displayWidth*2+1], //sl
    [0, displayWidth, displayWidth+1, displayWidth*2+1], // z
    [1, displayWidth+1, displayWidth, displayWidth*2], //sz
    [1, displayWidth, displayWidth+1, displayWidth+2], // t
    [0, 1, displayWidth, displayWidth+1], // o
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] // i
];

function displayShape() {
    miniGridCells.forEach(cell => {
        cell.classList.remove('tetromino');
        cell.style.backgroundColor = "";
    });

    upNextTetrominoes[nextRandom].forEach(index => {
        miniGridCells[displayIndex + index].classList.add('tetromino');
        miniGridCells[displayIndex + index].style.backgroundColor = colors[nextRandom];
    });
}

playBtn.addEventListener('click', () => {
    if (timerId) {
    }
    else {
        draw();
        timerId = setInterval(moveDown, 1000);
        nextRandom = Math.floor(Math.random()*tetrominoes.length);
        displayShape();
    };
})

function addScore() {
    for (let l = 0; l < 199; l += width) {
        const row = [l, l+1, l+2, l+3, l+4, l+5, l+6, l+7, l+8, l+9]

        if (row.every(index => gridcells[index].classList.contains('taken'))) {
            score += 10;
            scoreDisplay.innerHTML = score;
            row.forEach(index => {
                gridcells[index].classList.remove('taken');
                gridcells[index].classList.remove('tetromino');
                gridcells[index].style.backgroundColor = "";
            });

            const cellsRemoved = gridcells.splice(l, width);
            gridcells = cellsRemoved.concat(gridcells);
            gridcells.forEach(cell => gridcontainer.appendChild(cell));
        };
    };
}

function endGame() {
    if (current.some(index => gridcells[currentPosition + index].classList.contains('taken'))) {
        clearInterval(timerId);
        alert('Game Over');
    };
}

})