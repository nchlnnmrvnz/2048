let board;
let score = 0;
let rows = 4;
let columns = 4;
let startX = 0;
let startY = 0;
let is2048Exist = false;

function setGame(){
	board = [
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
    ];

	for(let r = 0; r < rows; r++){
		for(let c = 0; c < columns; c++){
			let tile = document.createElement("div");
			tile.id = r.toString() + "-" + c.toString();
			let num = board[r][c];
			updateTile(tile, num);
			document.getElementById("board").append(tile);
		}
	}

	setTile();
	setTile();
}

function updateTile(tile, num){
	tile.innerText = "";
	tile.classList.value = "";
	tile.classList.add("tile");

	if(num > 0){
		tile.innerText = num.toString();
	
		if(num <= 4096){
			tile.classList.add("x" + num.toString());
		} else {
			tile.classList.add("x8192");
		}
	}

	if(num > 0){
		tile.innerText = num.toString();
	}
}

function handleSlide(event){
	console.log(event.code);

	if(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.code)){

		event.preventDefault();
		slideBoard(event);
		setTile();
	}

	hasWon();
	if (hasLost() == true) {
		alert("Game Over! You have lost the game.");
		restartGame();
		alert("Click any arrow key to restart");
	}

	document.getElementById("score").innerText = score;
}

document.addEventListener("keydown", handleSlide);

function slideBoard(event) {
    let isHorizontal = (event.code === "ArrowLeft" || event.code === "ArrowRight");
    let isVertical = (event.code === "ArrowUp" || event.code === "ArrowDown");
    let originalRow = [];
    let originalColumn = [];
    let changeIndices = [];

    if (isHorizontal) {
        for (let r = 0; r < rows; r++) {
            let row = board[r].slice();
            originalRow[r] = row.slice();

            if (event.code === "ArrowRight") {
                row = slide(row.reverse()).reverse();
            } else {
                row = slide(row);
            }

            board[r] = row;
        }
    }

    if (isVertical) {
        for (let c = 0; c < columns; c++) {
            let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
            originalColumn[c] = col.slice();

            if (event.code === "ArrowDown") {
                col = slide(col.reverse()).reverse();
            } else {
                col = slide(col);
            }

            for (let r = 0; r < rows; r++) {
                if (originalColumn[c][r] !== col[r]) {
                    changeIndices.push(r);
                }
                board[r][c] = col[r];
            }
        }
    }

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(`${r}-${c}`);
            let num = board[r][c];

            if (isHorizontal && originalRow[r] && originalRow[r][c] !== num && num !== 0) {
                if (event.code === "ArrowLeft") {
                    tile.style.animation = "slide-from-right 0.3s";
                } else if (event.code === "ArrowRight") {
                    tile.style.animation = "slide-from-left 0.3s";
                }
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }

            if (isVertical && changeIndices.includes(r) && num !== 0) {
                if (event.code === "ArrowUp") {
                    tile.style.animation = "slide-from-bottom 0.3s";
                } else if (event.code === "ArrowDown") {
                    tile.style.animation = "slide-from-top 0.3s";
                }
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }

            updateTile(tile, num);
        }
    }
}

function filterZero(row){
	return row.filter(num => num != 0);
}

function slide(row){
	row = filterZero(row); 
	for(let i = 0; i < row.length - 1; i++){
		
		if(row[i] == row[i + 1]){ 
			row[i] *= 2
			row[i + 1] = 0;
			score += row[i];
		}
	}

	while(row.length < columns){
		row.push(0);
	}

	return row;
}

function hasEmptyTile(){
	for(let r = 0; r < rows; r++){
		for(let c = 0; c < columns; c++){
			if(board[r][c] == 0){
				return true;
			}
		}
	}
	return false;
}

function setTile(){
	if(hasEmptyTile() == false){
		return;
	}

	let found = false;
	while(!found){
		let r = Math.floor(Math.random() * rows);
		let c = Math.floor(Math.random() * columns);

		if(board[r][c] == 0){
			board[r][c] = 2
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			tile.innerText = "2";
			tile.classList.add("x2");

			found = true;
		}
	}

}

function hasWon() {
	for(let r = 0; r < rows; r++){
		for(let c = 0; c < columns; c++){
			if(board[r][c] == 2048 && is2048Exist == false){
				alert("You Win! You got 2048" );
				is2048Exist = true;
			}
		}
	}
}

function hasLost(){
    
    for(let r=0; r < rows; r++){
        for(let c=0; c < columns; c++){

            if(board[r][c]==0){
                return false;
            }

            const currentTile = board[r][c];

            if(r > 0 && board[r-1][c] === currentTile ||
                r < rows - 1 && board[r+1][c] === currentTile ||
                c > 0 && board[r][c-1] === currentTile ||
                c < columns - 1 && board[r][c+1] === currentTile
            ){
                return false;
            }
        }
    }

    return true;

}

function restartGame() {
    for(let r = 0; r < rows; r++){
	    for(let c = 0; c < columns; c++){
	        board[r][c] = 0;
	    }
	}
	score = 0;
	setTile();
}

window.onload = function(){
	setGame();
}

document.addEventListener('touchstart', (event) => {
	startX = event.touches[0].clientX;
	startY = event.touches[0].clientY;
});

document.addEventListener('touchend', (event) => {
	if(!event.target.className.includes("tile")){
		return;
	}

    let endX = event.changedTouches[0].clientX;
    let endY = event.changedTouches[0].clientY;

    let diffX = startX - endX;
    let diffY = startY - endY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) {
            slideBoard({ code: "ArrowLeft" });
        } else {
            slideBoard({ code: "ArrowRight" });
        }
    } else {
        if (diffY > 0) {
            slideBoard({ code: "ArrowUp" });
        } else {
            slideBoard({ code: "ArrowDown" });
        }
    }

    setTile();
    document.getElementById("score").innerText = score;

    hasWon();

    if(hasLost() == true){
        alert("Game Over! You have lost the game. Game will restart");
        restartGame();
        alert("Click any arrow key to restart");
    }
});