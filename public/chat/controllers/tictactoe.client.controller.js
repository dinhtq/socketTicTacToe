angular.module('chat').controller('TicTacToeController', ['Socket','$rootScope', '$scope', 'Authentication', '$location', '$window', 'modals',
  function(Socket, $rootScope, $scope, Authentication, $location, $window, modals){

  $scope.authentication = Authentication;
  $scope.joined = false;
  $scope.connectedPlayers = [];
  $scope.gameStarted = false;
  $scope.roomJoined = 0;
  $scope.gameOver = false;

  $scope.clientTurn = false;

  if($scope.authentication.user){
    $scope.clientName = $scope.authentication.user.username;
  }
  

  $scope.RoomData = {
    "1": {
      "Players": []
    },
    "2": {
      "Players": []
    },
    "3": {
      "Players": []
    }
  };

  $scope.GlobalRoomData = {
    "1": {
      "Players": []
    },
    "2": {
      "Players": []
    },
    "3": {
      "Players": []
    }
  };


  $scope.playAgain = function(){
    console.log("playAgain");

    var playAgainMessage = {
      room: $scope.roomJoined
    };

    //console.log(playAgainMessage);

    //send playAgainMessage
    Socket.emit('playAgain', playAgainMessage);

    //add / remove click event listener 
    if($scope.RoomData[$scope.roomJoined].Players[0] == $scope.clientName){
      //add click listner
      console.log('addEventListener');
      stage.addEventListener("click", stageClickHandler, false);
    }else{
      //remove click listener
      console.log('removeEventListener');
      stage.removeEventListener("click", stageClickHandler, false);
    }
  };

  Socket.on('playAgain', function(playAgainMessage){
    //console.log("socket on playAgain");

    resetEverything();

    //add click listener
    stage.addEventListener("click", stageClickHandler, false);

    var updateClassObj = {
      player1Class: "active",
      player2Class: "",
      room: $scope.roomJoined
    };

    updatePlayersActiveClass(updateClassObj);

        //add / remove click event listener 
    if($scope.RoomData[$scope.roomJoined].Players[0] == $scope.clientName){
      //add click listner
      console.log('addEventListener');
      stage.addEventListener("click", stageClickHandler, false);
    }else{
      //remove click listener
      console.log('removeEventListener');
      stage.removeEventListener("click", stageClickHandler, false);
    }

  });

  function resetEverything(){
    //console.log("resetEverything()");
    $scope.gameOver = false;
    //reset stage
    resetStage();
    //clear room outputs
    var updateObj = {
      room: $scope.roomJoined,
      playerNumber: 0,
      playerName: "",
      tie: false, //players tie score
      win: false, //player score
      label: false, //player name
      status: $scope.RoomData[$scope.roomJoined].Players[0] + ' turn!',
      gameStart: true
    };
    updateRoomOutput(updateObj);
    //clear players symbolPositions and won status
    Player1.symbolPositions = [];
    Player1.won = false;
    Player2.symbolPositions = [];
    Player2.won = false;
    usedCells = [];

    //console.log(Player1);
    //console.log(Player2);
    //console.log(usedCells);

    //reset game variables
    counterTurns = 0;
    gameOver = false;
    cat = false;


  }


  //initialize room outputs
  $scope.outputResultRoom1 = "";
  $scope.outputPlayer1Room1 = "";
  $scope.outputPlayer2Room1 = "";
  $scope.outputPlayer1WinsRoom1 = 0;
  $scope.outputPlayer2WinsRoom1 = 0;
  $scope.outputTiesRoom1 = 0;

  $scope.outputResultRoom2 = "";
  $scope.outputPlayer1Room2 = "";
  $scope.outputPlayer2Room2 = "";
  $scope.outputPlayer1WinsRoom2 = 0;
  $scope.outputPlayer2WinsRoom2 = 0;
  $scope.outputTiesRoom2 = 0;

  $scope.outputResultRoom3 = "";
  $scope.outputPlayer1Room3 = "";
  $scope.outputPlayer2Room3 = "";
  $scope.outputPlayer1WinsRoom3 = 0;
  $scope.outputPlayer2WinsRoom3 = 0;
  $scope.outputTiesRoom3 = 0;

  //the active css
  $scope.outputPlayer1Room1Class = '';
  $scope.outputPlayer2Room1Class = '';
  $scope.outputPlayer1Room2Class = '';
  $scope.outputPlayer2Room2Class = '';
  $scope.outputPlayer1Room3Class = '';
  $scope.outputPlayer2Room3Class = '';


  //updates room output
  function updateRoomOutput(updateObj){
    /* ex:
      updateObj = {
        room: int,
        playerNumber: int,
        playerName: string,
        tie: bool, //players tie score
        win: bool, //player score
        label: bool, //player name
        status: string,
        gameStart: bool
      }
    */

    var strRoom = "";
    var strPlayerNumber = "";
    var strPlayerName = "";

    if (updateObj.room) {
      strRoom = updateObj.room.toString();
    }

    if (updateObj.playerNumber) {
      strPlayerNumber = updateObj.playerNumber.toString();
    }

    if(updateObj.playerName){
      strPlayerName = updateObj.playerName;
    }


    if (updateObj.tie === true) {
      //update room tie
      $scope["outputTiesRoom" + strRoom] = $scope["outputTiesRoom" + strRoom] + 1;
    }
    else{
        //update player name labels?
        if(updateObj.label === true){
          $scope["outputPlayer" + strPlayerNumber +  "Room" + strRoom] = strPlayerName;
        }
        else{
            //update gameStart?
            if (updateObj.gameStart === true) {
              $scope["outputResultRoom" + strRoom] = updateObj.status;

            }
            else{
                //update status
                if(updateObj.playerNumber == 0){
                  //output general status
                  $scope["outputResultRoom" + strRoom] = updateObj.status;
                }
                else{
                    //announce player win
                    //get player username
                    var playerWonUsername = getPlayerUsername(updateObj.playerNumber, updateObj.room);
                    $scope["outputResultRoom" + strRoom] = playerWonUsername + " " + updateObj.status;
                    $scope["outputPlayer" + strPlayerNumber + "WinsRoom" + strRoom] = $scope["outputPlayer" + strPlayerNumber + "WinsRoom" + strRoom] + 1;
                }

            }

        }
    }


  };

  //update player's active class to highlight which player is active (who's turn it is)
  function updatePlayersActiveClass(updateClassObj){
    console.log('updatePlayersActiveClass');
    /* ex:
    updateClassObj = {
      player1Class: string,
      player2Class: string,
      room: int
    }
    */

    var strRoom = updateClassObj.room.toString();

    $scope["outputPlayer1Room" + strRoom + "Class"] = updateClassObj.player1Class;
    $scope["outputPlayer2Room" + strRoom + "Class"] = updateClassObj.player2Class;

    //console.log("Room :" + strRoom + " player 1 class: " + $scope["outputPlayer1Room" + strRoom + "Class"]);
    //console.log("Room :" + strRoom + " player 2 class: " + $scope["outputPlayer2Room" + strRoom + "Class"]);



  }


  //returns an integer representing the player number based on the player username and room
  function getPlayerNumber(username, room){
      //look for username in RoomData
      var indexUsername = $scope.RoomData[room].Players.indexOf(username);
      if (indexUsername == 0) {
        return 1;
      }else{
        return 2;
      }
  }

  //returns the player username based on the player number and room
  function getPlayerUsername(playerNumber, room){
    // return player username in RoomData
    if (playerNumber == 1) {
      return $scope.RoomData[room].Players[0];
    }else{
      return $scope.RoomData[room].Players[1];
    }
  }



  $scope.getRoomCount = function(room){
    return $scope.RoomData[room].Count;
  };



  $scope.join = function(room){
    console.log('client $scope.join and room is: ' + room);
    //update clientRoomData
    //RoomData[room].Players.push($scope.authentication.username);
    $scope.joined = true;

    //show modal
    //$('#myModal').show();


    $scope.roomJoined = room;
    //emit join message
    var roomToJoin = {
      "room": room
    };

    Socket.emit('join', roomToJoin);
  };

  Socket.on('joinMessage', function(joinMessage){
    console.log('socket on joinMessage');

    ////console.log($scope.RoomData);

    //update RoomData
    $scope.RoomData = joinMessage.roomData;

    //console.log($scope.RoomData);
    //console.log(joinMessage.roomJoined);

    //update player 1 name label
    var updateObj = {
      room: $scope.roomJoined,
      playerNumber: 1,
      playerName: $scope.RoomData[$scope.roomJoined].Players[0],
      tie: false,
      win: false,
      label: true,
      status: ""
    };

    //outputPlayer1.innerHTML = $scope.RoomData[joinMessage.roomJoined].Players[0];

    updateRoomOutput(updateObj);

    if ($scope.RoomData[$scope.roomJoined].Players.length > 1) {
      //edit updateObj for player 2
      updateObj.playerNumber = 2;
      updateObj.playerName = $scope.RoomData[$scope.roomJoined].Players[1];

      updateRoomOutput(updateObj);
      //outputPlayer2.innerHTML = $scope.RoomData[joinMessage.roomJoined].Players[1];
    }

    console.log($scope.RoomData);

    //if not enough players, then show modal
    if($scope.RoomData[$scope.roomJoined].Players.length < 2){
      console.log("Not enough players");
      $scope.alertSomething();

    }else{
      console.log("Enough players");
      $rootScope.$emit( "modals.close" );

      //update players active class
      var updateClassObj = {
        player1Class: "active",
        player2Class: "",
        room: $scope.roomJoined
      };

      updatePlayersActiveClass(updateClassObj);

      //check if its this client turn

      
     
      //if client name is in the first element of RoomData, then add click listener
      var arRoomPlayers = $scope.RoomData[$scope.roomJoined].Players;
      console.log('arRoomPlayers[0] : ' + arRoomPlayers[0]);
      if(arRoomPlayers[0] == $scope.clientName){
        stage.addEventListener("click", stageClickHandler, false);
      } 
    }

    //update room output status
    var updateObj = {
      room: $scope.roomJoined,
      playerNumber: 0,
      playerName: "",
      tie: false, //players tie score
      win: false, //player score
      label: false, //player name
      status: $scope.RoomData[$scope.roomJoined].Players[0] + " turn!",
      gameStart: false
    };

    updateRoomOutput(updateObj);


  });

  Socket.on('joinMessageGlobal', function(joinMessage){
    ////console.log('someone joined a room');
    ////console.log($scope.GlobalRoomData);
    $scope.GlobalRoomData = joinMessage.roomData;


  });

  $scope.leave = function(){
    console.log('$scope.leave()');
    $scope['outputPlayer1WinsRoom' + $scope.roomJoined] = 0;
    $scope['outputPlayer2WinsRoom' + $scope.roomJoined] = 0;
    $scope['outputTiesRoom' + $scope.roomJoined] = 0;
    //close modal
    //console.log("emitted modals.close event");
    $rootScope.$emit( "modals.close" );
    $scope.joined = false;
    // create disConnnectMessage obj
    var disconnectMessage = {
      username: $scope.authentication.username,
      room: $scope.roomJoined
    };
    Socket.emit('disconnectMessage', disconnectMessage);


    var leaveMessage = {
      room: $scope.roomJoined
    };
    //resetEverything
    resetEverything();
    Socket.emit('leaveMessage', leaveMessage);

    console.log('removing player from RoomData');
    //remove player from RoomData
    var indexPlayerInRoomData = $scope.RoomData[leftRoomMessage.room].Players.indexOf(leftRoomMessage.player);
    //update output player names status
    var updateObj = {
      room: $scope.roomJoined,
      playerNumber: 0,
      playerName: "",
      tie: false,
      win: false,
      label: true,
      status: ""
    };
    if (indexPlayerInRoomData == 0) {
      //outputPlayer1.innerHTML = "Player 1";
      updateObj.playerNumber = 1;
      updateObj.playerName = "Player 1";
      updateRoomOutput(updateObj);
    }else{
      //outputPlayer2.innerHTML = "Player 2";
      updateObj.playerNumber = 2;
      updateObj.playerName = "Player 2";
      updateRoomOutput(updateObj);
    }


    $scope.roomJoined = 0;

    stage.removeEventListener("click", stageClickHandler, false);


  };

  Socket.on('leftRoomMessage', function(leftRoomMessage){
    console.log("socket on leftRoomMessage");
    //remove player from RoomData
    var indexPlayerInRoomData = $scope.RoomData[leftRoomMessage.room].Players.indexOf(leftRoomMessage.player);
    //update output player names status
    var updateObj = {
      room: $scope.roomJoined,
      playerNumber: 0,
      playerName: "",
      tie: false,
      win: false,
      label: true,
      status: ""
    };
    if (indexPlayerInRoomData == 0) {
      //outputPlayer1.innerHTML = "Player 1";
      updateObj.playerNumber = 1;
      updateObj.playerName = "Player 1";
      updateRoomOutput(updateObj);
    }else{
      //outputPlayer2.innerHTML = "Player 2";
      updateObj.playerNumber = 2;
      updateObj.playerName = "Player 2";
      updateRoomOutput(updateObj);
    }





    //update RoomData
    $scope.RoomData[$scope.roomJoined].Players.splice(indexPlayerInRoomData,1);

    //console.log(leftRoomMessage.player + ' just left');

    //resetEverything
    resetEverything();

    //open modal
    console.log('try open modal');
    $scope.alertSomething();

    stage.removeEventListener("click", stageClickHandler, false);

    $scope['outputPlayer1WinsRoom' + $scope.roomJoined] = 0;
    $scope['outputPlayer2WinsRoom' + $scope.roomJoined] = 0;
    $scope['outputTiesRoom' + $scope.roomJoined] = 0;


  });

  Socket.on('leftRoomMessageGlobal', function(leftRoomMessage){
    //console.log("socket on leftRoomMessageGlobal");
    //console.log('someone left a room');
    //console.log('leftRoomMessage.roomData');


    $scope.GlobalRoomData = leftRoomMessage.roomData;

    //console.log(leftRoomMessage);

    //console.log("$scope.roomJoined: " + $scope.roomJoined);

    //update output player name
    var updateObj = {
      room: $scope.roomJoined,
      playerNumber: 0,
      playerName: "",
      tie: false,
      win: false,
      label: true,
      status: ""
    };

    if($scope.GlobalRoomData[$scope.roomJoined].Players.length == 0){
      //update player 1
      updateObj.playerNumber = 1;
      updateObj.playerName = "Player 1";
      updateRoomOutput(updateObj);
      //update player 2
      updateObj.playerNumber = 2;
      updateObj.playerName = "Player 2";
      updateRoomOutput(updateObj);

    }else if($scope.GlobalRoomData[$scope.roomJoined].Players.length == 1){
      //update player 1
      updateObj.playerNumber = 1;
      updateObj.playerName = $scope.GlobalRoomData[$scope.roomJoined].Players[0];
      updateRoomOutput(updateObj);
      //update player 2
      updateObj.playerNumber = 2;
      updateObj.playerName = "Player 2";
      updateRoomOutput(updateObj);
    }else{
      //update player 1
      updateObj.playerNumber = 1;
      updateObj.playerName = $scope.GlobalRoomData[$scope.roomJoined].Players[0];
      updateRoomOutput(updateObj);
      //update player 2
      updateObj.playerNumber = 2;
      updateObj.playerName = $scope.GlobalRoomData[$scope.roomJoined].Players[1];
      updateRoomOutput(updateObj);
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

  //var output = document.querySelector('#output');
  //var outputPlayer1 = document.querySelector('#tableStatus td:first-child');
  //var outputPlayer2 = document.querySelector('#tableStatus td:nth-child(2)');


  $scope.load = function(){
    loadStage();
  }





  //////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////



  //////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////




  //called when enough players are in the game
  function loadStage(){
    console.log("loadStage()");
    //render the game stage
    render();
    startGame();

  }


  function startGame(){
    console.log("startGame()");
    //add click event listener to stage
    //stage.addEventListener("click", stageClickHandler, false);
    //console.log("added click listener");
  }


  function stageClickHandler(e){
    ////console.log("stageClickHandler()");
    //single cell clicked handler
    if (e.target !== e.currentTarget) {

          var clickedCellID = e.target.id;
          ////console.log("Hello " + clickedCellID);
          ////console.dir(usedCells);
          if (usedCells.indexOf(clickedCellID) > -1) {
            //update room output
            var updateObj = {
              room: $scope.roomJoined,
              playerNumber: 0,
              tie: false,
              win: false,
              label: false,
              status: "Cell taken!"
            };
            updateRoomOutput(updateObj)
            //output.innerHTML = "Cell taken!";

          }else{
            ////console.log("here");
            //update player position
            if(counterTurns % 2 == 0){
              //update player 1 symbol position
              //Player1.symbolPositions.push(clickedCellID);
              ////console.log("Player1 position: " + Player1.symbolPositions[Player1.symbolPositions.length - 1]);

              //configure and send socket message

              var messagePlayer = {
                player: 1,
                clickedCellID: clickedCellID,
                room: $scope.roomJoined
              };
              Socket.emit('tictactoe', messagePlayer);

            }else{
              //update player 2 symbol position
              //Player2.symbolPositions.push(clickedCellID);
              ////console.log("Player2 position: " + Player2.symbolPositions[Player2.symbolPositions.length - 1]);

              //configure and send socket message
              var messagePlayer = {
                player: 2,
                clickedCellID: clickedCellID,
                room: $scope.roomJoined
              };
              Socket.emit('tictactoe', messagePlayer);
            }


          }



      }//end single cell clicked handler
      e.stopPropagation();
  }


  Socket.on('tictactoe', function(messagePlayer){
    //////console.log("socket on tictactoe");
    var intPlayerNext = 0;
    //update player position
    if (messagePlayer.player == 1) {
      Player1.symbolPositions.push(messagePlayer.clickedCellID);
      intPlayerNext = 2;

    }else{
      Player2.symbolPositions.push(messagePlayer.clickedCellID);
      intPlayerNext = 1;

    }

    usedCells.push(messagePlayer.clickedCellID);
    counterTurns++;

    render();

    //check if anyone won yet
    //////console.log("Player1 position: " + Player1.symbolPositions);
    //////console.log("Player2 position: " + Player2.symbolPositions);
    checkWhoWon();

    if (gameOver) {
      gameEnds();
    }


    //endGame if maximumTurns reached
    if (counterTurns == 9 && gameOver == false) {
      cat = true;
      gameEnds();
    }

    //if game is still going
    if(!gameOver){
      //update room output status
      var updateObj = {
        room: $scope.roomJoined,
        playerNumber: 0,
        playerName: "",
        tie: false, //players tie score
        win: false, //player score
        label: false, //player name
        status: $scope.RoomData[$scope.roomJoined].Players[intPlayerNext - 1] + " turn!",
        gameStart: false
      };

      updateRoomOutput(updateObj);

      //add / remove click listeners
      var realPlayerTurnName = $scope.RoomData[$scope.roomJoined].Players[intPlayerNext - 1];
      if (realPlayerTurnName == $scope.clientName) {
        //add click listener
        stage.addEventListener("click", stageClickHandler, false);
      }else{
        //remove click listener
        stage.removeEventListener("click", stageClickHandler, false);
      }
    }



  });


  function render(){
    console.log("render()");
    //clear the child nodes from previous turn
    if (stage.hasChildNodes()) {
      ////console.log("hasChildNodes");
      for(var i = 0; i < ROWS * COLUMNS; i++){
        if(stage.firstChild){
          stage.removeChild(stage.firstChild);
          ////console.log("remove stage.firstChild");
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

    //render gameState - players turns - highlight which player turn it is
    if (counterTurns % 2 == 0) {
      //Player 1 turn
      //outputPlayer1.className = "active";
      //outputPlayer2.className = "";
      var updateClassObj = {
        player1Class: "active",
        player2Class: "",
        room: $scope.roomJoined
      };

      updatePlayersActiveClass(updateClassObj);




    }else{
      //Player 2 turn
      var updateClassObj = {
        player1Class: "",
        player2Class: "active",
        room: $scope.roomJoined
      };

      updatePlayersActiveClass(updateClassObj);
      
      
      
    }

    ////console.log("**************************done render()**************************");
  };//end render



  function resetStage(){
    ////console.log("render()");
    //clear the child nodes from previous turn
    if (stage.hasChildNodes()) {
      ////console.log("hasChildNodes");
      for(var i = 0; i < ROWS * COLUMNS; i++){
        if(stage.firstChild){
          stage.removeChild(stage.firstChild);
          ////console.log("remove stage.firstChild");
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

    //console.log("done reset stage");

  };//end resetStage


  function checkWhoWon(){
    //console.log("checkWhoWon()");
    var match = 0;
    //check if min turns reached
    if (counterTurns > 4) {
      ////console.log("min turns reached");
      //check if player1 won
      if (counterTurns % 2 > 0) {
        ////console.log("check if Player1 won");
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
                  ////console.log("player1 won");
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
        ////console.log("check if Player2 won");
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
                  ////console.log("player2 won");
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
    $scope.gameOver = true;

    //update room status output
    var updateObj = {
      room: $scope.roomJoined,
      playerNumber: 0,
      tie: false,
      win: false,
      label: false,
      status: ""
    };

    if (cat) {
      updateObj.status = "CAT!";
      updateRoomOutput(updateObj);
      //output.innerHTML = "CAT!";
    }

    if (Player1.won) {
      updateObj.playerNumber = 1;
      updateObj.status = "Wins!";
      updateRoomOutput(updateObj);
      //output.innerHTML = "Player 1 Wins!";
    }
    else if (Player2.won){
      updateObj.playerNumber = 2;
      updateObj.status = "Wins!";
      updateRoomOutput(updateObj);
      //output.innerHTML = "Player 2 Wins!";
    }
    else{
      updateObj.status = "CAT!";
      updateRoomOutput(updateObj);
      //output.innerHTML = "CAT!";
    }

    //remove event listener for stage
    stage.removeEventListener("click", stageClickHandler, false);

  }




  function log(str){
    //console.log(str);
  }


  $scope.$on('$destroy', function(){
    //console.log("scope on $destroy");
    Socket.removeListener('tictactoe');
  });

  // I open an Alert-type modal.
  $scope.alertSomething = function() {
      // The .open() method returns a promise that will be either
      // resolved or rejected when the modal window is closed.
      var promise = modals.open(
          "alert",
          {
              message: "Waiting for another player..."
          }
      );
      promise.then(
          function handleResolve( response ) {
              console.log( "Alert resolved." );
          },
          function handleReject( error ) {
              console.warn( "Alert rejected!" );
          }
      );
  };
  // I open a Confirm-type modal.
  $scope.confirmSomething = function() {
      // The .open() method returns a promise that will be either
      // resolved or rejected when the modal window is closed.
      var promise = modals.open(
          "confirm",
          {
              message: "Are you sure you want to taste that?!"
          }
      );
      promise.then(
          function handleResolve( response ) {
              //console.log( "Confirm resolved." );
          },
          function handleReject( error ) {
              //console.warn( "Confirm rejected!" );
          }
      );
  };
  // I open a Prompt-type modal.
  $scope.promptSomething = function() {
      // The .open() method returns a promise that will be either
      // resolved or rejected when the modal window is closed.
      var promise = modals.open(
          "prompt",
          {
              message: "Who rocks the party the rocks the body?",
              placeholder: "MC Lyte."
          }
      );
      promise.then(
          function handleResolve( response ) {
              //console.log( "Prompt resolved with [ %s ].", response );
          },
          function handleReject( error ) {
              //console.warn( "Prompt rejected!" );
          }
      );
  };



}]);


















//
