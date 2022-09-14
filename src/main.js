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
        const innerDiv = document.createElement("div");
        const playerHeader = document.createElement("h4");
        playerHeader.textContent = "Player";
        playerHeader.id = `player${playerNumber}Select`;
        const botHeader = document.createElement("h4");
        botHeader.textContent = "Bot";

        const buttonHeaderClasses = ["playerSelectionType", "invertColor"];
        for (const buttonClass of buttonHeaderClasses) {
            playerHeader.classList.add(buttonClass);
            botHeader.classList.add(buttonClass);
        }
        playerHeader.classList.add("playerSelected");
        innerDiv.appendChild(playerHeader);
        innerDiv.appendChild(botHeader);
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
            for (const className of cellClassList)
                gameCell.classList.add(className);
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

    for (const element of elements)
        mainDiv.appendChild(element);

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
    const getPlayer1 = player(1, "X", false);
    const getPlayer2 = player(2, "O", false);
    return { getPlayer1, getPlayer2 };
}

const gameController = () => {
    let playerList;
    let currentPlayer;
    let gameActive;

    const getCurrentPlayer = () => currentPlayer;
    const toggleCurrentPlayer = () => currentPlayer === playerList.getPlayer1 ? currentPlayer = playerList.getPlayer2 : currentPlayer = playerList.getPlayer1;

    const getGameActive = () => gameActive;
    const toggleGameActive = () => { gameActive ? gameActive = false : gameActive = true };

    const writeGameButton = (string) => document.querySelector("#startGameButton").firstChild.textContent = string;
    const writePlayerTurn = () => writeGameButton(`Player ${currentPlayer.getPlayerNumber()}'s Turn:  ${currentPlayer.getMoveChar()}`);
    const writePlayerWin = () => {
        window.alert(`Player ${currentPlayer.getPlayerNumber()} Wins!`);
        writeGameButton("Start Game");
    }
    const reset = () => {
        playerList = players();
        currentPlayer = playerList.getPlayer1;
        gameActive = false;

        let cells = document.querySelectorAll(".cell");
        for (cell of cells) {
            if (cell.lastElementChild)
                cell.removeChild(cell.lastElementChild);
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
                if (!(currentPlayer.getMoves().includes(winConditions[i][j])))
                    break;

                if (j + 1 === winConditions[i].length)
                    return true;
            }
        }
        return false;
    }

    const move = (cellNum) => {
        const playedMove = currentPlayer.getMoveChar();
        currentPlayer.addMove(cellNum);
        if (checkWin()) {
            toggleGameActive();
            writePlayerWin();
            reset();
            return false;
        }

        else {
            toggleCurrentPlayer();
            writePlayerTurn();
            return playedMove;
        }
    }

    const startGame = () => {
        reset();
        toggleGameActive();
        writePlayerTurn();
    }

    return { getGameActive, getCurrentPlayer, move, startGame };
}

const main = () => {
    gameControl = gameController();
    const startUpDom = createStartupDom();

    if (!startUpDom["createPass"])
        throw 'Dom was not successfully created';

}

window.addEventListener("load", () => main());