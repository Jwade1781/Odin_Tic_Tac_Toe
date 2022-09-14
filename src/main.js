let gameControl;

const createMainHeader = () => {
    const headerDiv = document.createElement("div");
    const headerText = document.createElement("h4");
    headerText.textContent = "Tic Tac Toe";
    headerDiv.id = "header";
    headerDiv.appendChild(headerText);
    return headerDiv;
}

const createSelectButtons = () => {
    const createPlayerButtons = playerNumber => {
        const playerButtonDiv = document.createElement("div");
        const playerButtonHeader = document.createElement("h4");
        playerButtonHeader.textContent = `Player ${playerNumber}`;

        const createButton = (playerNumber, playerBot, buttonHeaderClasses) => {
            const buttonHeader = document.createElement("h4");
            playerBot ? buttonHeader.textContent = "Bot" : buttonHeader.textContent = "Player";
            for (const buttonClass of buttonHeaderClasses) buttonHeader.classList.add(buttonClass);

            buttonHeader.addEventListener("click", () => {
                const classQuery = `playerSelected${playerNumber}`;
                if (document.querySelector("." + classQuery)) document.querySelector("." + classQuery).classList.remove(classQuery);
                buttonHeader.classList.add(classQuery);
            });

            return buttonHeader;
        }

        const buttonHeaderClasses = ["playerSelectionType", "invertColor"];
        const playerButton = createButton(playerNumber, false, buttonHeaderClasses);
        const botButton = createButton(playerNumber, true, buttonHeaderClasses);

        playerButton.classList.add(`playerSelected${playerNumber}`);
        const innerDiv = document.createElement("div");
        innerDiv.appendChild(playerButton);
        innerDiv.appendChild(botButton);
        playerButtonDiv.appendChild(playerButtonHeader);
        playerButtonDiv.appendChild(innerDiv);
        return playerButtonDiv;
    }

    const selectButtonsDiv = document.createElement("div");
    selectButtonsDiv.id = "selectButtons";
    selectButtonsDiv.appendChild(createPlayerButtons(1));
    selectButtonsDiv.appendChild(createPlayerButtons(2));
    return selectButtonsDiv;
}

const createGameBoard = () => {
    const boardWidth = 3;
    const boardLength = boardWidth;
    const gameBoard = document.createElement("div");
    gameBoard.id = "game";

    let i = 0;
    for (let col = 0; col < boardWidth; col++) {
        for (let row = 0; row < boardLength; row++) {
            const gameCell = document.createElement("div");
            const cellNum = i;
            gameCell.id = i;

            gameCell.addEventListener("click", () => {
                if (gameControl.getGameActive() && !(gameCell.firstChild)) {
                    const playerMoveHeader = document.createElement("h1");
                    const playerMove = gameControl.move(cellNum)
                    if (playerMove) {
                        playerMoveHeader.textContent = playerMove;
                        gameCell.appendChild(playerMoveHeader);
                    }
                }
            })

            const cellClassList = ["row" + (row % boardWidth), "col" + (col % boardLength), "cell", "invertColor", "darkHover"];
            for (const className of cellClassList) gameCell.classList.add(className);
            gameBoard.appendChild(gameCell);
            i++;
        }
    }

    const infoPanel = document.createElement("div");
    const infoPanelText = document.createElement("h3");
    infoPanelText.textContent = "Start Game";
    infoPanel.addEventListener("click", () => {
        if (!gameControl.getGameActive()) gameControl.startGame();
    })

    infoPanel.id = "startGameButton";
    infoPanel.classList.add("invertColor");
    infoPanel.classList.add("infoPanel");
    infoPanel.appendChild(infoPanelText);
    gameBoard.appendChild(infoPanel);
    return gameBoard;
}

const createStartupDom = () => {
    const mainDiv = document.createElement("div");
    mainDiv.id = "mainDiv";
    mainDiv.classList.add("frostedGlassBackground");

    const elements = [createMainHeader(), createSelectButtons(), createGameBoard()]

    for (const element of elements) mainDiv.appendChild(element);

    document.body.appendChild(mainDiv);
    return { "createPass": true, "mainDiv": mainDiv };
}

const player = (playerNumber, moveChar, botBool) => {
    let moveSet = [];
    const addMove = (cellNum) => moveSet.push(cellNum);
    const getMoves = () => moveSet;
    const getPlayerNumber = () => playerNumber;
    const getMoveChar = () => moveChar;
    const getBotBool = () => botBool;
    return { getPlayerNumber, getMoveChar, getMoves, addMove, getBotBool };
}

const players = () => {
    const checkBot = playerNumber => { return document.querySelector(`.playerSelected${playerNumber}`).textContent === "Bot"; }

    const getPlayer1 = player(1, "X", checkBot(1));
    const getPlayer2 = player(2, "O", checkBot(2));
    return { getPlayer1, getPlayer2 };
}

const gameController = () => {
    let playerList;
    let currentPlayer;
    let gameActive;

    const getCurrentPlayer = () => currentPlayer;
    const toggleCurrentPlayer = () => {
        currentPlayer === playerList.getPlayer1 ? currentPlayer = playerList.getPlayer2 : currentPlayer = playerList.getPlayer1;
        checkBotMove();
    }
    const checkBotMove = () => { if (currentPlayer.getBotBool()) botMove(); }
    const botMove = () => {
        const botTimeoutMs = 50;
        setTimeout(() => {
            while (true && gameActive) {
                let randomMove = Math.floor(Math.random() * 9);
                const playerMoveHeader = document.createElement("h1");
                let gameCell = document.getElementById(randomMove);
                if (gameCell.hasChildNodes()) continue;

                let playerMove = move(randomMove);
                if (playerMove) {
                    gameCell = document.getElementById(randomMove);
                    playerMoveHeader.textContent = playerMove;
                    gameCell.appendChild(playerMoveHeader);
                    break;
                }
            }
        }, botTimeoutMs);
    }

    const getGameActive = () => gameActive;
    const toggleGameActive = () => { gameActive ? gameActive = false : gameActive = true };

    const writeGameButton = (string) => document.querySelector("#startGameButton").firstChild.textContent = string;
    const writePlayerTurn = () => writeGameButton(`Player ${currentPlayer.getPlayerNumber()}'s Turn:  ${currentPlayer.getMoveChar()}`);
    const writePlayerWin = () => { window.alert(`Player ${currentPlayer.getPlayerNumber()} Wins!`); }

    const writePlayerTie = () => {
        window.alert(`Tie!`);
    }
    const reset = () => {
        playerList = players();
        currentPlayer = playerList.getPlayer1;
        gameActive = false;

        writeGameButton("Start Game");
        let cells = document.querySelectorAll(".cell");
        for (cell of cells) {
            if (cell.lastElementChild) cell.removeChild(cell.lastElementChild);
        }
    }
    const checkWin = () => {
        const winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],  // Horizontal
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertical
            [0, 4, 8], [2, 4, 6]             // Diagonal
        ]

        for (let i = 0; i < winConditions.length; i++) {
            for (let j = 0; j < winConditions[i].length; j++) {
                if (!(currentPlayer.getMoves().includes(winConditions[i][j]))) break;
                if (j + 1 === winConditions[i].length) return true;
            }
        }
        return false;
    }

    const move = (cellNum) => {
        const playedMove = currentPlayer.getMoveChar();
        currentPlayer.addMove(cellNum);

        if (checkWin()) 
            writePlayerWin();


        else if (playerList.getPlayer1.getMoves().length + playerList.getPlayer2.getMoves().length === 9)
            writePlayerTie();

        else {
            toggleCurrentPlayer();
            writePlayerTurn();
            return playedMove;
        }

        toggleGameActive();
        reset();
        return false;
    }

    const startGame = () => {
        reset();
        toggleGameActive();
        checkBotMove();
        writePlayerTurn();
    }

    return { getGameActive, getCurrentPlayer, move, startGame };
}

const main = () => {
    gameControl = gameController();
    const startUpDom = createStartupDom();

    if (!startUpDom["createPass"]) throw 'Dom was not successfully created';
}

window.addEventListener("load", () => main());