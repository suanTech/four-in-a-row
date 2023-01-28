class Game {
  constructor() {
    this.board = new Board();
    this.players = this.createPlayers();
    this.ready = false;
  }

  get activePlayer() {
    return this.players.find((player) => player.active);
  }

  /**
   * Creates two player objects
   * @return  {array}    An array of two player objects.
   */
  createPlayers() {
    const players = [
      new Player("Player 1", 1, "#e15258", true),
      new Player("Player 2", 2, "#e59a13"),
    ];
    return players;
  }
  playToken() {
    const spaces = this.board.spaces;
    const activeToken = this.activePlayer.activeToken;
    const activeColumn = spaces[activeToken.columnLocation];
    let targetSpace = null;

    for (let space of activeColumn) {
      if (space.token === null) {
        targetSpace = space;
      }
    }
    if (targetSpace !== null) {
      game.ready = false;
      activeToken.drop(targetSpace, function(){
        game.updateGameState(activeToken, targetSpace)
      });
    }
  }
  handleKeydown(e) {
    if (this.ready) {
      switch (e.key) {
        case "ArrowLeft":
          this.activePlayer.activeToken.moveLeft();
          break;
        case "ArrowRight":
          this.activePlayer.activeToken.moveRight(this.board.columns);
          break;
        case "ArrowDown":
          this.playToken();
          break;
      }
    }
  }
  startGame() {
    this.board.drawHTMLBoard();
    this.activePlayer.activeToken.drawHTMLToken();
    this.ready = true;
  }
  checkForWin(target) {
    const owner = target.token.owner;
    let win = false;

    // vertical
    for (let x = 0; x < this.board.columns; x++) {
      for (let y = 0; y < this.board.rows - 3; y++) {
        if (
          this.board.spaces[x][y].owner === owner &&
          this.board.spaces[x][y + 1].owner === owner &&
          this.board.spaces[x][y + 2].owner === owner &&
          this.board.spaces[x][y + 3].owner === owner
        ) {
          win = true;
        }
      }
    }
    // horizontal
    for (let x = 0; x < this.board.columns - 3; x++) {
      for (let y = 0; y < this.board.rows; y++) {
        if (
          this.board.spaces[x][y].owner === owner &&
          this.board.spaces[x + 1][y].owner === owner &&
          this.board.spaces[x + 2][y].owner === owner &&
          this.board.spaces[x + 3][y].owner === owner
        ) {
          win = true;
        }
      }
    }
    // diagonal
    for (let x = 3; x < this.board.columns; x++) {
      for (let y = 0; y < this.board.rows - 3; y++) {
        
        if (
          this.board.spaces[x][y].owner === owner &&
          this.board.spaces[x - 1][y + 1].owner === owner &&
          this.board.spaces[x - 2][y + 2].owner === owner &&
          this.board.spaces[x - 3][y + 3].owner === owner
        ) {
          win = true;
        }
      }
    }
    for (let x = 3; x < this.board.columns; x++) {
      for (let y = 3; y < this.board.rows; y++) {
        if (
          this.board.spaces[x][y].owner === owner &&
          this.board.spaces[x - 1][y - 1].owner === owner &&
          this.board.spaces[x - 2][y - 2].owner === owner &&
          this.board.spaces[x - 3][y - 3].owner === owner
        ) {
          win = true;
        }
      }
    }
    return win;
  }
  switchPlayers() {
    this.players.map((player) => {
      player.active = player.active === true ? false : true;
    });
  }
  gameOver(message) {
    const gameOverHTML = document.getElementById("game-over");
    gameOverHTML.style.display = "block";
    gameOverHTML.textContent = message;
  }
  updateGameState(token, target) {
    target.mark(token);
    if (!this.checkForWin(target)) {
      this.switchPlayers();
      if (this.activePlayer.checkTokens()) {
        this.activePlayer.activeToken.drawHTMLToken();
        this.ready = true;
      } else {
        this.gameOver('No more tokens!');
      }
    } else {
      this.gameOver(`${target.owner.name} wins!`)
    }
  }
}
