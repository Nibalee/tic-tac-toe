const Cell = () =>{
    let value = ' ';
    let row = -1;
    let col = -1;
    return {value, row, col};
}


const gameBoard = ()=>{
    let board  = [];

    for( let i = 0; i<3 ;i++){
        board[i] = [];
        for(let j=0; j<3 ;j++){
            board[i].push(Cell());
            board[i][j].row = i;
            board[i][j].col = j;
        }
    }

    const getBoard = ()=>board;

    const emptyBoard = ()=>{
        for(let i=0; i<3; i++){
            for(let j=0; j<3; j++){
                board[i][j].value = ' ';
            }
        }
    };

    const addToken = (cell, player)=>{
        if(cell.value !== ' ') return false;
        
        cell.value = player.getToken();
        return true;
    };



    return{getBoard, addToken, emptyBoard};
};


const Player = (name, token) =>{

    getName = ()=> name;
    getToken = ()=>token;

    return{getName, getToken};
};

const gameControl = ()=>{
    let board = gameBoard();

    //Make a function to automatically choose the token for the players after one token has been specified
    let player1 = Player('Player1', 'X');
    let player2 = Player('Player2', 'O');

    let activePlayer = player1;

    const getActivePlayer = () =>{
        return activePlayer;
    }

    const switchPlayer = ()=>{
        return (activePlayer === player1)? player2: player1; 
    };


    const playRound = (cell, player)=>{
        let checkTokenPlacement = board.addToken(cell,  player);
        if(!checkTokenPlacement){
            return;
        }
        else{
            activePlayer = switchPlayer();
        }
    };

    return{
        playRound, 
        getActivePlayer,
        getBoard: board.getBoard,
        emptyBoard: board.emptyBoard
    };
};


const displayControl = (()=>{

    const game = gameControl();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');
    
    let aiMode = false;
    const changeAiMode = ()=>{
        if(!aiMode){
            aiMode = true;
            return;
        }
    };

    const updateScreen = ()=>{
        let player = game.getActivePlayer();
        const board = game.getBoard();

        //DISPLAY playNewRound() msg to the screen
        playerTurnDiv.textContent = `${player.getName()}'s turn...`;

        boardDiv.textContent = "";

        //Display the Board 
        board.forEach(row =>{
            row.forEach(cell=>{

                const cellDiv = document.createElement("div");
                //We should add style HERE
                cellDiv.classList.add("cell")
                cellDiv.textContent = cell.value;
                cellDiv.dataset.row= cell.row;
                cellDiv.dataset.col = cell.col;

        
                boardDiv.appendChild(cellDiv);


                //Ai Mode is off
                //Event Listener for the cellDiv in case a click action occurs
                if(!aiMode){
                    cellDiv.addEventListener('click', () =>{
                        game.playRound(cell, player);
                        updateScreen();
    
                        if(isFull(board)){
                            if(checkWin(game.getBoard(), cell)){
                                popMessage(`${player.getName()} wins!`);
                                return;
                            } 
                            popMessage("DRAW !")
                        }
                        else if(checkWin(game.getBoard(), cell)){
                            popMessage(`${player.getName()} wins!`);
                            return;
                            } 
                    });
                }
                else{
                    cellDiv.addEventListener('click', () =>{

                        game.playRound(cell, player);

                        //Check win condition after placement
                        if(checkWin(game.getBoard(), cell)){
                            updateScreen();
                            popMessage(`${player.getName()} wins!`);
                            return;
                        }

                        if(isFull(board)){
                            popMessage("DRAW !");
                            return;
                        }


                        //Making Sure the random cell we choose is empty
                        let randomRow;
                        let randomCol;

                        //Infinite loop when there is only one slot left
                        do{
                            randomRow = Math.floor(Math.random()*3);
                            randomCol = Math.floor(Math.random()*3);

                        }while(board[randomRow][randomCol].value !== ' ');

                        player = game.getActivePlayer();
                        game.playRound(board[randomRow][randomCol], player);
                        updateScreen();
    
                        if(isFull(board)){
                            popMessage("DRAW !");
                            return;
                        }
                        else if(checkWin(game.getBoard(), board[randomRow][randomCol])){
                            popMessage(`${player.getName()} wins!`);
                            return;
                        }
                        
                    });
                }

            });
        });
    };

    const checkWin = (b, c)=>{

        let value = c.value;
        let row = c.row;
        let col = c.col;

        //Check win 
        if((value === b[row][0].value && value === b[row][1].value && value === b[row][2].value)
            ||(value === b[0][col].value && value === b[1][col].value && value === b[2][col].value)){
                return true;
            }
        else if(value === b[1][1].value){
            if((value === b[0][0].value && value === b[2][2].value)
                || (value === b[0][2].value && value === b[2][0].value)){
                    return true;
                }
        }

    };

    const popMessage = (msg)=>{
        //COMPLETE THIS ONE
        startMenu.innerHTML = "";
        popUp.style.display = "flex";

        const message = document.createElement("h2");
        const restartIcon = document.createElement('i');

        restartIcon.classList.add('fa-solid','fa-arrow-rotate-left', 'restart');
        startMenu.style.flexDirection = "column";
        message.textContent=  msg;

        startMenu.appendChild(message);
        startMenu.appendChild(restartIcon);


        restartIcon.addEventListener('click', ()=>{
            game.emptyBoard();
            updateScreen();
            popUp.style.display = "none";
            startMenu.style.flexDirection = "row";

        });

    };

    const isFull = (b)=>{
        for(let i=0; i<3; i++){
            for(let j=0; j<3; j++){
                if(b[i][j].value === ' '){
                    return false;
                }
            }
        }
        return true;
    };


    return{
        changeAiMode,
        updateScreen
    };
})();



//Main function
displayControl;

//UI manipulation
const humanBtn = document.querySelector('#HH-btn');
const aiBtn = document.querySelector("#HA-btn");
const btnGrp = document.querySelector(".btn-grp");
const startMenu = document.querySelector(".start-menu");
const popUp = document.querySelector(".pop-up");

humanBtn.onclick = ()=>{
    humanStartMenu();
    //YOU HAVE TO DO SOMETHING TO ACTIVATE THE AI 
};

aiBtn.onclick = ()=>{
    displayControl.changeAiMode();
    displayControl.updateScreen();
    popUp.style.display = "none";
};

function humanStartMenu(){
    startMenu.innerHTML = "";

    //DONT FORGET TO ADD CSS ATTRIBUTES TO YOUR NEWLY CREATED ELEMENTS

    //player 1
    const p1Label = document.createElement("label");
    const p1P = document.createElement("p");
    const p1Input = document.createElement("input");
    const labelGrp = document.createElement("div");

    labelGrp.classList.add("label-grp");

    p1Label.setAttribute("for", "p1-name");

    p1Input.setAttribute("type", "text");
    p1Input.setAttribute("id", "p1-name");
    p1Input.setAttribute("value", "Player 1");

    p1P.textContent = "P1:";

    p1Label.appendChild(p1P);
    p1Label.appendChild(p1Input);
    
    labelGrp.appendChild(p1Label);



    //player2
    const p2Label = document.createElement("label");
    const p2P = document.createElement("p");
    const p2Input = document.createElement("input");

    p2Label.setAttribute("for", "p2-name");

    p2Input.setAttribute("type", "text");
    p2Input.setAttribute("id", "p2-name");
    p2Input.setAttribute("value", "Player 2");

    p2P.textContent = "P2:";

    p2Label.appendChild(p2P);
    p2Label.appendChild(p2Input);
    
    labelGrp.appendChild(p2Label);


    //submit button
    const submitBtn = document.createElement("button");
    submitBtn.setAttribute("type","submit");
    submitBtn.textContent="Submit";
    //submitBtn.id = " submit-btn"

    submitBtn.addEventListener('click', ()=>{
        displayControl.updateScreen();
        popUp.style.display = "none";
    });

    startMenu.appendChild(labelGrp);
    startMenu.appendChild(submitBtn);
}



//PROBLEM TO SOLVE!  THE FIRST AI MODE ! ONLY AFTER THE SECOND ATTEMPT THE 
// THE AI START WORKING 
