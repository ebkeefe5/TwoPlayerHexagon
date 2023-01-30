//update below with address of server
//ioClient = io('https://35.238.40.176:8080',{secure: true});

ioClient.on("init", (playerNumber) => handleInit(playerNumber));
ioClient.on("update", (gameState) => updateGameState(gameState));
ioClient.on('gameCode', (gameCode) => handleGameCode(gameCode));
ioClient.on('unknownCode', handleUnknownCode);
ioClient.on('disconnected', handleDisconnected);
ioClient.on('tooManyPlayers', handleTooManyPlayers);

const gameScreen = document.getElementById('gameScreen');
const initialScreen = document.getElementById('initialScreen');
const newGameBtn = document.getElementById('newGameButton');
const joinGameBtn = document.getElementById('joinGameButton');
const gameCodeInput = document.getElementById('gameCodeInput');
const gameCodeDisplay = document.getElementById('gameCodeDisplay');
const restartGameBtn = document.getElementById('restartGameButton');

newGameBtn.addEventListener('click', newGame);
joinGameBtn.addEventListener('click', joinGame);
restartGameBtn.addEventListener('click', restartGame);

const notAllowedPiece = '#696969';
//unclaimedPiece, player1Piece, player2Piece, player1PieceWon, player2PieceWon
const colors = ['#A9A9A9', '#E42217', '#7690ac', '#800000', '#000080'];

let playerNumber;

function newGame() {
  ioClient.emit('newGame');
  restartGameBtn.style.display = "none";
  init();
  console.log("started new game");
}

function joinGame() {
  const code = gameCodeInput.value;
  ioClient.emit('joinGame', code);
  restartGameBtn.style.display = "none";
  init();
}

function restartGame()
{
  restartGameBtn.style.display = "none";
  ioClient.emit('restartGame');
  console.log("restarted game");
}

function drawBoard(boardModel)
{
  var boardElement = document.getElementById("board");
  var boardHtml = '<svg width="' + BOARD_WIDTH + '" height="' + BOARD_HEIGHT + '">';

  //border
  boardHtml += topBorderHtml();

  //main board
  for (row = 0; row < boardModel.length; row++)
	{
    for (col = 0; col < boardModel[row].length; col ++)
    {
      boardHtml += getHexagonHtml(row, col, boardModel[row][col]);
    }
	}
  boardHtml += '</svg>'
  boardElement.innerHTML = boardHtml;
}

function topBorderHtml()
{
  //top border
  var x1 = TOP_LEFT_HEXAGON_CENTER_X - Math.sqrt(3)*HEXAGON_EDGE_LENGTH/2;
  var x2 = TOP_LEFT_HEXAGON_CENTER_X - Math.sqrt(3)*HEXAGON_EDGE_LENGTH;
  var x3 = TOP_LEFT_HEXAGON_CENTER_X + Math.sqrt(3)* (BOARD_DIMENSION - 0.83) * HEXAGON_EDGE_LENGTH;
  var x4 = TOP_LEFT_HEXAGON_CENTER_X + Math.sqrt(3)* (BOARD_DIMENSION - 0.25) * HEXAGON_EDGE_LENGTH;

  var y1 = TOP_LEFT_HEXAGON_CENTER_y - 1/2 * HEXAGON_EDGE_LENGTH;
  var y2 = TOP_LEFT_HEXAGON_CENTER_y - HEXAGON_EDGE_LENGTH;
  var y3 = TOP_LEFT_HEXAGON_CENTER_y - 3/2 * HEXAGON_EDGE_LENGTH;

  var fillLine = 'fill=" ' + colors[1] + '"/>';
  var html = '<path d="M' + x1 + " " + y1 +
               'L' + x2 + " " + y2 +
               'L' + x1 + " " + y3 +
               'L' + x4 + " " + y3 +
               'L' + x3 + " " + y1 +
               'L' + x1 + " " + y1 +
               'Z"' +
               fillLine;

    //right border
    var x5 = TOP_LEFT_HEXAGON_CENTER_X + BOARD_DIMENSION * Math.sqrt(3) * HEXAGON_EDGE_LENGTH + Math.sqrt(3)*HEXAGON_EDGE_LENGTH/2 * (BOARD_DIMENSION - 2);
    var x6 = TOP_LEFT_HEXAGON_CENTER_X + BOARD_DIMENSION * Math.sqrt(3) * HEXAGON_EDGE_LENGTH + Math.sqrt(3)*HEXAGON_EDGE_LENGTH/2* (BOARD_DIMENSION - 1);
    var x7 = TOP_LEFT_HEXAGON_CENTER_X + BOARD_DIMENSION * Math.sqrt(3) * HEXAGON_EDGE_LENGTH + Math.sqrt(3)*HEXAGON_EDGE_LENGTH/2* (BOARD_DIMENSION);

    var y4 = TOP_LEFT_HEXAGON_CENTER_y + (BOARD_DIMENSION * 3/2 - 1) * HEXAGON_EDGE_LENGTH;
    var y5 = TOP_LEFT_HEXAGON_CENTER_y + (BOARD_DIMENSION * 3/2 - 0.5) * HEXAGON_EDGE_LENGTH;

    var fillLine = 'fill=" ' + colors[2] + '"/>';
    html += '<path d="M' + x3 + " " + y1 +
                 'L' + x4 + " " + y3 +
                 'L' + x7 + " " + y4 +
                 'L' + x6 + " " + y5 +
                 'L' + x5 + " " + y4 +
                 'L' + x3 + " " + y1 +
                 'Z"' +
                 fillLine;

     //bottom border
     var x8 = TOP_LEFT_HEXAGON_CENTER_X + Math.sqrt(3)*HEXAGON_EDGE_LENGTH/2*BOARD_DIMENSION - 0.5 * Math.sqrt(3) * HEXAGON_EDGE_LENGTH;
     var x9 = TOP_LEFT_HEXAGON_CENTER_X + Math.sqrt(3)*HEXAGON_EDGE_LENGTH/2*BOARD_DIMENSION - 1.13 * Math.sqrt(3) * HEXAGON_EDGE_LENGTH;

     var y6 = TOP_LEFT_HEXAGON_CENTER_y + (BOARD_DIMENSION * 3/2) * HEXAGON_EDGE_LENGTH;

     var fillLine = 'fill=" ' + colors[1] + '"/>';
     html += '<path d="M' + x5 + " " + y4 +
                  'L' + x6 + " " + y5 +
                  'L' + x5 + " " + y6 +
                  'L' + x9 + " " + y6 +
                  'L' + x8 + " " + y4 +
                  'L' + x5 + " " + y4 +
                  'Z"' +
                  fillLine;

    //left border
    var x10 = TOP_LEFT_HEXAGON_CENTER_X - Math.sqrt(3)*HEXAGON_EDGE_LENGTH * 1.5
    var y7 = TOP_LEFT_HEXAGON_CENTER_y - 0.5 * HEXAGON_EDGE_LENGTH;

    var fillLine = 'fill=" ' + colors[2] + '"/>';
    html += '<path d="M' + x1 + " " + y1 +
                 'L' + x2 + " " + y2 +
                 'L' + x10 + " " + y7 +
                 'L' + x9 + " " + y6 +
                 'L' + x8 + " " + y4 +
                 'L' + x1 + " " + y1 +
                 'Z"' +
                 fillLine;

    return html;
}

function getHexagonHtml(row, col, state)
{
	var cx = TOP_LEFT_HEXAGON_CENTER_X + col * Math.sqrt(3) * HEXAGON_EDGE_LENGTH + Math.sqrt(3)*HEXAGON_EDGE_LENGTH/2*row;
	var cy = TOP_LEFT_HEXAGON_CENTER_y + row * 3/2 * HEXAGON_EDGE_LENGTH;

	var x1 = cx - Math.sqrt(3)*HEXAGON_EDGE_LENGTH/2;
	var x2 = cx;
	var x3 = cx + Math.sqrt(3)*HEXAGON_EDGE_LENGTH/2;

	var y1 = cy - 1/2 * HEXAGON_EDGE_LENGTH;
	var y2 = cy - HEXAGON_EDGE_LENGTH;
	var y3 = cy + 1/2 * HEXAGON_EDGE_LENGTH;
	var y4 = cy + HEXAGON_EDGE_LENGTH;

  var fillLine = 'fill="';
  if (state == -1)
    fillLine += notAllowedPiece + '"/>';
  else
    fillLine += colors[state] + '"/>';
  var firstLine = '<a onclick=handleClick(' + row + ',' + col + ')>';
  return firstLine +
      '<path d="M' + x1 + " " + y1 +
               'L' + x2 + " " + y2 +
               'L' + x3 + " " + y1 +
               'L' + x3 + " " + y3 +
               'L' + x2 + " " + y4 +
               'L' + x1 + " " + y3 +
               'L' + x1 + " " + y1 +
               'Z"' +
               'stroke="black"' +
               fillLine +
    '</a>';
}

function handleClick(row, col)
{
  console.log("clicked: " + row + " " + col);
  ioClient.emit('hexagonClicked', {row, col})
}

function init()
{
	initialScreen.style.display = "none";
	gameScreen.style.display = "block";

	BOARD_DIMENSION = 11; //must be an odd number
	HEXAGON_EDGE_LENGTH = Math.floor(window.screen.height/(BOARD_DIMENSION*3.6));
	TOP_LEFT_HEXAGON_CENTER_X = HEXAGON_EDGE_LENGTH * 2.5;
	TOP_LEFT_HEXAGON_CENTER_y = HEXAGON_EDGE_LENGTH * 2.5;
  HEXAGON_WIDTH = Math.sqrt(3)*HEXAGON_EDGE_LENGTH;
	BOARD_WIDTH = HEXAGON_WIDTH * (BOARD_DIMENSION + 1.5) * 1.5;
  BOARD_HEIGHT = HEXAGON_EDGE_LENGTH * (BOARD_DIMENSION + 1.5) * Math.sqrt(3);
}

function handleInit(number) {
  playerNumber = number;
  if (number == 1)
  	player.innerText = "red";
  else
  	player.innerText = "blue";
}

function updateGameState(gameState)
{
	updateTurnView(gameState.data.turn);
	drawBoard(gameState.data.gameBoard);
}

function handleGameCode(gameCode) {
  gameCodeDisplay.innerText = gameCode;
}

function handleUnknownCode() {
  reset();
  alert('Unknown Game Code')
}

function handleTooManyPlayers() {
  reset();
  alert('This game is already in progress');
}

function handleDisconnected()
{
	alert('Your oppenent disconnected!');
	reset();
}

function reset() {
  playerNumber = null;
  gameCodeInput.value = '';
  initialScreen.style.display = "block";
  gameScreen.style.display = "none";
}

function updateTurnView(turn)
{
	if (turn == 1)
		document.getElementById('playerTurn').innerHTML = "Red's Move!";
	else if(turn == 2)
		document.getElementById('playerTurn').innerHTML = "Blue's Move!";
	else if (turn == 3)
  {
  	document.getElementById('playerTurn').innerHTML = "Game Over: Red Wins!";
  }
	else
  {
   document.getElementById('playerTurn').innerHTML = "Game Over: Blue Wins!";
  }
  if (turn >=3 && playerNumber == 1)
  {
    restartGameBtn.style.display = "block";
    restartGameBtn.style.margin = "auto";
  }
}