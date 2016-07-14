angular.module('chat').controller('TicTacToeController', ['Socket', '$scope',
  function(Socket, $scope){

  $scope.connectedPlayers = [];

  $scope.username = "";
  $scope.gameStarted = false;
  $scope.EmptyUsername = false;

  $scope.play = function(){
    //check if username is empty
    if ($scope.username.length == 0) {
      $scope.EmptyUsername = true;
    }else{
      $scope.gameStarted = true;
      //emit signInMessage to server
      Socket.emit('signInMessage', $scope.username);
    }

  };

  $scope.disconnect = function(){
    console.log('disconnected');
    Socket.socket.disconnect($scope.username);
  };

  Socket.on('signInMessage', function(clientsConnected){
    console.log('on signInMessage client');


    for(var index in clientsConnected){
      console.log(clientsConnected[index] + ' connected');
    }

    if (clientsConnected[0]) {
      outputPlayer1.innerHTML = clientsConnected[0];
    }

    if (clientsConnected[1]) {
      outputPlayer2.innerHTML = clientsConnected[1];
    }

  });







    //the map
  var map =
    [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8]
    ];




  var ROWS = map.length;
  var COLUMNS = map[0].length;


  //symbol code
  var X = 1;
  var O = 2;

  //cell size
  var SIZE = 150;

  //player object
  var Player1 = {
    playerSymbol : X,
    symbolPositions: [],
    won: false
  }

  var Player2 = {
    playerSymbol : O,
    symbolPositions: [],
    won: false
  }

  var usedCells = [];

  //number of clicks
  var counterTurns = 0;
  var maximumTurns = 9;
  var gameState = "";
  var gameStarted = false;
  var gameOver = false;
  var cat = false;
  var possibleWins =
  [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [3, 4, 5],
    [6, 7, 8],
    [6, 4, 2]
  ];


  //get references to stage, output and players table
  var stage = document.querySelector("#stage");

  var output = document.querySelector('#output');
  var outputPlayer1 = document.querySelector('table td:first-child');
  var outputPlayer2 = document.querySelector('table td:nth-child(2)');

  //window.addEventListener("load", windowLoadHandler, false);
  $scope.load = function(){
    windowLoadHandler();
  };









  //////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////



  //////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////





  function windowLoadHandler(){

    playGame();
    //add click event listener to stage
    stage.addEventListener("click", stageClickHandler, false);

  }

  function playGame(){
    render();

  }



  function stageClickHandler(e){
    //single cell clicked handler
    if (e.target !== e.currentTarget) {
          var clickedCellID = e.target.id;
          //console.log("Hello " + clickedCellID);
          console.dir(usedCells);
          if (usedCells.indexOf(clickedCellID) > -1) {
            output.innerHTML = "Cell taken!";

          }else{

            //update player position
            if(counterTurns % 2 == 0){
              //update player 1 symbol position
              //Player1.symbolPositions.push(clickedCellID);
              //console.log("Player1 position: " + Player1.symbolPositions[Player1.symbolPositions.length - 1]);

              //configure and send socket message
              var messagePlayer = {
                player: 1,
                clickedCellID: clickedCellID
              }
              Socket.emit('tictactoe', messagePlayer);

            }else{
              //update player 2 symbol position
              //Player2.symbolPositions.push(clickedCellID);
              //console.log("Player2 position: " + Player2.symbolPositions[Player2.symbolPositions.length - 1]);

              //configure and send socket message
              var messagePlayer = {
                player: 2,
                clickedCellID: clickedCellID
              }
              Socket.emit('tictactoe', messagePlayer);
            }


          }



      }//end single cell clicked handler
      e.stopPropagation();
  }


  Socket.on('tictactoe', function(messagePlayer){
    //update player position
    if (messagePlayer.player == 1) {
      Player1.symbolPositions.push(messagePlayer.clickedCellID);
    }else{
      Player2.symbolPositions.push(messagePlayer.clickedCellID);
    }

    usedCells.push(messagePlayer.clickedCellID);
    counterTurns++;

    render();

    //check if anyone won yet
    //console.log("Player1 position: " + Player1.symbolPositions);
    //console.log("Player2 position: " + Player2.symbolPositions);
    checkWhoWon();

    if (gameOver) {
      gameEnds();
    }


    //endGame if maximumTurns reached
    if (counterTurns == 9 && gameOver == false) {
      cat = true;
      gameEnds();
    }

  });


  function render(){
    //console.log("render()");
    //clear the child nodes from previous turn
    if (stage.hasChildNodes()) {
      //console.log("hasChildNodes");
      for(var i = 0; i < ROWS * COLUMNS; i++){
        if(stage.firstChild){
          stage.removeChild(stage.firstChild);
          //console.log("remove stage.firstChild");
        }

      }
    }

    //render game by looping through map[]
    for (var row = 0; row < ROWS; row++) {
      //loop columns
      for (var column = 0; column < COLUMNS; column++) {

        //append a div with class cell as child of stage
        var cell = document.createElement("div");
        cell.className = "cell";

        //set cell width and height
        cell.style.width = SIZE + "px";
        cell.style.height = SIZE + "px";
        //set float left
        cell.style.float = "left";
        //customizing specific cells
        var styleBorder = "2px solid black";

        switch (map[row][column]) {
          case 0:

            cell.id = map[row][column];
            cell.style.borderRight = styleBorder;
            cell.style.borderBottom = styleBorder;
            break;
          case 1:
            cell.id = map[row][column];
            cell.style.borderRight = styleBorder;
            cell.style.borderBottom = styleBorder;
            break;
          case 2:
            cell.id = map[row][column];
            cell.style.borderBottom = styleBorder;
            break;
          case 3:
            cell.id = map[row][column];
            cell.style.clear = "both";
            cell.style.borderBottom = styleBorder;
            cell.style.borderRight = styleBorder;
            break;
          case 4:
            cell.id = map[row][column];
            cell.style.borderRight = styleBorder;
            cell.style.borderBottom = styleBorder;
            break;
          case 5:
            cell.id = map[row][column];
            cell.style.borderBottom = styleBorder;
            break;
          case 6:
            cell.id = map[row][column];
            cell.style.clear = "both";
            cell.style.borderRight = styleBorder;
            break;
          case 7:
            cell.id = map[row][column];
            cell.style.borderRight = styleBorder;
            break;
          case 8:
            cell.id = map[row][column];
            break;
          default:

        }//end customizing specific cells

        //log("Player1.symbolPositions: " + Player1.symbolPositions);
        //add player1 symbol
        if (Player1.symbolPositions.indexOf(map[row][column].toString()) > -1) {
          cell.innerHTML = "X";
        }
        //add player2 symbol
        if (Player2.symbolPositions.indexOf(map[row][column].toString()) > -1) {
          cell.innerHTML = "O";
        }


        //append cell node as child of stage
        stage.appendChild(cell);

        //change fontSize to animate the symbol entrance
        /*if (Player1.symbolPositions.indexOf(map[row][column].toString()) > -1) {
          cell.style.fontSize = '7em';
        }
        if (Player2.symbolPositions.indexOf(map[row][column].toString()) > -1) {
          cell.style.fontSize = '7em';
        }
        */


      }//next column

    }//next row

    //render gameState - players turns
    if (counterTurns % 2 == 0) {
      //output.innerHTML = "Player 1 turn!";
      outputPlayer1.className = "active";
      outputPlayer2.className = "";
    }else{
      //output.innerHTML = "Player 2 turn!";
      outputPlayer2.className = "active";
      outputPlayer1.className = "";
    }
    //console.log("**************************done render()**************************");
  };//end render


  function checkWhoWon(){
    //console.log("checkWhoWon()");
    var match = 0;
    //check if min turns reached
    if (counterTurns > 4) {
      //console.log("min turns reached");
      //check if player1 won
      if (counterTurns % 2 > 0) {
        //console.log("check if Player1 won");
        //find player1 symbolPositions[] in possibleWins[]
        for (var row = 0; row < possibleWins.length; row++) {
          for (var column = 0; column < COLUMNS; column++) {

            //check if possibleWins item is in player1 symbolPositions[]
            if (Player1.symbolPositions.indexOf(possibleWins[row][column].toString()) > -1) {
                //log("possibleWins[" + row + "," + column + "]" + " found in Player1 symbolPositions: " + Player1.symbolPositions);
                //if last column is found in player1.symbolPositions then player won
                match++;
                if (match == 3) {
                  gameOver = true;
                  Player1.won = true;
                  //console.log("player1 won");
                }
            }
            else{

            }
          }//end column loop
          match = 0;
          if (gameOver) {
            break;
          }
        }//end row loop
      }//end check if player1 won
      //check if player2 won
      else{
        //console.log("check if Player2 won");
        //find player2 symbolPositions[] in possibleWins[]
        for (var row = 0; row < possibleWins.length; row++) {
          for (var column = 0; column < COLUMNS; column++) {

            //check if possibleWins item is in player2 symbolPositions[]
            if (Player2.symbolPositions.indexOf(possibleWins[row][column].toString()) > -1) {
                //if last column is found in player2.symbolPositions then player won
                match++;
                if (match == 3) {
                  gameOver = true;
                  Player2.won = true;
                  //console.log("player2 won");
                }
            }
            else{
              //not found in player2 symbolPositions

            }
          }//end column loop
          match = 0;
          if (gameOver) {
            break;
          }
        }//end row loop

      }//end check if player2 won
    }//end check if min turns reached

  }






  function gameEnds(){
    //console.log("gameEnds()");
    if (cat) {
      output.innerHTML = "CAT!";
    }

    if (Player1.won) {
      output.innerHTML = "Player 1 Wins!";
    }
    else if (Player2.won){
      output.innerHTML = "Player 2 Wins!";
    }
    else{
      output.innerHTML = "CAT!";
    }

    //remove event listener for stage
    stage.removeEventListener("click", stageClickHandler, false);

  }


  function log(str){
    console.log(str);
  }


  $scope.$on('$destroy', function(){
    Socket.removeListener('tictactoe');
  });


}]);
