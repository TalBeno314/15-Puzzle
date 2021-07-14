let size = 4;
let cellSize, board, selectSize, shuffle, timer;
let time = 0;
let started = false;
let second;
let isFinished = false;

function setup() {
    createCanvas(600, 600).position(windowWidth / 2 - 300, windowHeight / 2 - 300);
    board = createBoard(size);
    scramble();
    cellSize = width / size;

    let title = createElement('h1', '15 Puzzle');

    timer = createP(`Time: ${time}s`);
    timer.position(windowWidth / 2 - 300, windowHeight / 2 - 400);
    timer.id('timer');

    selectSize = createSelect()
    selectSize.option('Select Size');
    selectSize.size(200, 50);
    selectSize.option('3x3');
    selectSize.option('4x4');
    selectSize.option('5x5');
    selectSize.option('6x6');
    selectSize.position(windowWidth / 2 + 100, windowHeight / 2 + 330);
    selectSize.changed(ChangeSize);

    shuffle = createButton('scramble');
    shuffle.size(200, 50);
    shuffle.position(windowWidth / 2 - 300, windowHeight / 2 + 330)
    shuffle.mousePressed(scramble);
}

function draw() {
    background(0, 150, 240);
    fill(0, 150, 240);
    stroke(255);
    strokeWeight(3);
    square(0, 0, width)
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j] != 0) {
                fill(0);
                square(j * cellSize, i * cellSize, cellSize);

                fill(255);
                textAlign(CENTER);
                textSize(cellSize / 2);
                text(board[i][j], j * cellSize, i * cellSize + cellSize / 4, cellSize, cellSize);
            }
        }
    }

    finished();
}

function mousePressed() {
    if (!isFinished) {
        let j = floor(mouseX / cellSize);
        let i = floor(mouseY / cellSize);
        for (let di = -1; di <= 1; di++) {
            for (let dj = -1; dj <= 1; dj++) {
                if (i + di >= 0 && i + di < size && j + dj >= 0 && j + dj < size && (di == 0 || dj == 0)) {
                    if (board[i + di][j + dj] == 0) {
                        board[i + di][j + dj] = [board[i][j], (board[i][j] = board[i + di][j + dj])][0];
                        if (!started) {
                            second = setInterval(() => {
                                time++;
                                $('#timer')[0].innerText = `Time: ${time}s`
                            }, 1000);
                            started = true;
                        }
                    }
                }
            }
        }
    }
}

function createBoard(size) {
    let board = new Array(size);
    for (let i = 0; i < size; i++) {
        board[i] = new Array(size);
        for (let j = 0; j < size; j++) {
            if (!(i == j && i == size - 1)) {
                board[i][j] = i * size + j + 1;
            } else {
                board[i][j] = 0;
            }
        }
    }
    return board;
}

function scramble() {
    let moves = 50 * size ** 2;
    while (moves > 0) {
        let i = floor(random(0, size));
        let j = floor(random(0, size));
        if (board[i][j] != 0) {
            for (let di = -1; di <= 1; di++) {
                for (let dj = -1; dj <= 1; dj++) {
                    if (i + di >= 0 && i + di < size && j + dj >= 0 &&
                        j + dj < size &&
                        (di == 0 || dj == 0)
                    ) {
                        if (board[i + di][j + dj] == 0) {
                            board[i + di][j + dj] = [board[i][j], (board[i][j] = board[i + di][j + dj])][0];
                            moves--;
                        }
                    }
                }
            }
        }
    }

    if (started) {
        started = false;
        isFinished = false;
        time = 0;
        clearInterval(second);
        $('#timer')[0].innerText = `Time: 0s`;
    }
}

function ChangeSize() {
    let newSize = parseInt(selectSize.value().split("")[0]);
    console.log(newSize);
    if (newSize > 0) {
        size = newSize;
        board = createBoard(size);
        scramble(board);
        cellSize = width / size;

        if (started) {
            started = false;
            isFinished = false;
            time = 0;
            clearInterval(second);
            $('#timer')[0].innerText = `Time: 0s`;
        }
    }
}

function finished() {
    let finished = true;
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (!(i == j && i == size - 1)) {
                if (board[i][j] != i * size + j + 1) {
                    finished = false;
                }
            } else {
                if (board[i][j] != 0) {
                    finished = false;
                }
            }
        }
    }

    if (finished) {
        isFinished = true;
        clearInterval(second);
    }
}