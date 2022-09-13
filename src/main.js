const mainHeader = () => {
    const headerDiv = document.createElement("div");
    const headerText = document.createElement("h4");
    headerText.textContent = "Tic Tac Toe";
    headerDiv.id = "header";
    headerDiv.appendChild(headerText);
    return headerDiv;
}

const selectButtons = () => {
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
        for (const buttonClass of buttonHeaderClasses){
            playerHeader.classList.add(buttonClass);
            botHeader.classList.add(buttonClass);
        }

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

const gameBoard = () => {
    const boardWidth = 3;
    const boardLength = boardWidth;
    const gameBoard = document.createElement("div");
    gameBoard.id = "game";

    for (let col = 0; col < boardWidth; col++){
        for (let row = 0; row < boardLength; row++){
            const gameCell = document.createElement("div");
            const cellClassList = ["row" + (row%boardWidth), "col" +(col%boardLength), "cell", "invertColor", "darkHover"];
            for (const className of cellClassList)
                gameCell.classList.add(className);    
            gameBoard.appendChild(gameCell);
        }
    }

    const infoPanel = document.createElement("div");
    const infoPanelText = document.createElement("h3");
    infoPanelText.textContent = "Start Game";
    infoPanel.id = "infoPanel";
    infoPanel.classList.add("invertColor");
    infoPanel.appendChild(infoPanelText);
    gameBoard.appendChild(infoPanel);
    return gameBoard;
}

function createDom(){
    const mainDiv = document.createElement("div");
    mainDiv.id = "mainDiv";
    mainDiv.classList.add("frostedGlassBackground");

    const elements = [mainHeader(), selectButtons(), gameBoard()]

    for (const element of elements)
        mainDiv.appendChild(element);

    document.body.appendChild(mainDiv);
    return true;
}

function main(){
    if (!createDom())
        throw 'Dom was not successfully created';
}

window.addEventListener("load", ()=> main());