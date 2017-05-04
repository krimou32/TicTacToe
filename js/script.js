'use strict'

const tiles = document.getElementsByClassName("tile");
const buttons = document.getElementsByClassName("button");

// State of tiles: 0 = not taken; 1 = computer; -1 = player
let state = [0,0,0,0,0,0,0,0,0];
let game = true;

let human = false;
let computer = true;

const humval = -1;
const comval = 1;

//All possible winning combinations
const winMatrix = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6],
]

function reset() {

  //Reset game to original state
  for (let i = 0; i < 9; i++) {
    tiles[i].style.background = "#fff";
    state[i] = 0;
  }

  //Reset bottom buttons style
  for (let i = 0; i < 2; i++) {
    buttons[i].style.width = "15.5vh";
    buttons[i].style.margin = "0.5vh";
    buttons[i].style.opacity = "1";
  }

  //Game is on again! Woo!
  game = true;
}

function claim(clicked) {

  //Nothing happens if the game has ended
  if(!game){
    return;
  }

  //Checks if the clicked tile has not already been taken.
  // If not, sets tile to player's color and calls AI to play
  for (let i = 0; i < 9; i++) {
    if (tiles[i] == clicked && state[i] === 0) {
      set(i, human);
      callAI();
    }
  }
}

function set(index, player) {

  //Nothing happens if the game has ended
  if(!game){
    return;
  }

  //Makes the "computer" button disappear
  if(state[index] === 0) {
    buttons[0].style.width = "0";
    buttons[0].style.margin = "0";
    buttons[0].style.opacity = "0";

    buttons[1].style.width = "32vh";

    if(player == human) {
      //If it's the human player's turn, the selected tile will turn blue
      tiles[index].style.background = "#22f";
      state[index] = humval;
    } else {
      //If it's the computer's turn, the selected tile will turn red
      tiles[index].style.background = "#f22";
      state[index] = comval;
    }

    //If somebody won, and by somebody I mean the computer, the game is over
    if(checkWin(state, player)) {
      game = false;
    }
  }
}

function checkWin(board, player) {

  //If the player is human, sets value to humval (-1). Otherwise set it to comval (1).
  var value = player == human ? humval : comval;

  for (let i = 0; i < 8; i++){

    let win = true;

    //Loops trhough all winning combinations to determine whether the last player who made a move won or not.
    for (let t = 0; t < 3; t++) {
      if(board[winMatrix[i][t]] != value) {
        win = false;
        break;
      }
    }

    if(win){
      return true;
    }
  }
  return false;
}

function checkFull(board) {
  for (let i = 0; i < 9; i++) {
    if(board[i] === 0) {
      return false;
    }
  }
  return true;
}

function callAI() {
  aiturn(state, 0, computer);
}

//Checks what the optimal next move is to win
function aiturn(board, depth, player){
  if(checkWin(board, !player)) {
    return -10 - depth;
  }

  if(checkFull(board)) {
    return 0;
  }

  let value = player == human ? humval : comval;

  let max = -Infinity;
  let index = 0;

  //Loops through every possible move to keep the best one
  for(let i = 0; i < 9; i++) {
    if(board[i] === 0){
      let newboard = board.slice();
      newboard[i] = value;

      let moveval = -aiturn(newboard, depth + 1, !player);

      if(moveval > max){
        max = moveval;
        index = i;
      }
    }
  }
  if (depth == 0){
    set(index, computer);
  }
  return max;
}
