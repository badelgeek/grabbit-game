//================================================================================
// GRABBIT GAME
//================================================================================
// TODO
// improve game.score.update
// max width
// timer
//================================================================================

// Html Toolbox Object
const html = {
   createElement(type, parent, content = '') {
      let element = document.createElement(type);
      element.textContent = content;
      parent.appendChild(element);
      return element;
   }
}


// Game Object (with all parameters and functions)
const game = {
   round: 0,
   squareSize: 100,
   timeout: 3,
   theme: [
      {
         name: 'bunny',
         playerImage: 'images/bunny.png',
         targetImage: 'images/carotte.png'
      },
      {
         name: 'explorer',
         playerImage: 'images/explorer.png',
         targetImage: 'images/moai.png'
      },
      {
         name: 'explorer-woman',
         playerImage: 'images/explorer-woman.png',
         targetImage: 'images/moai.png'
      }
   ],
   player: {
      element: document.querySelector("#player"),
      X: 0,
      Y: 0,
      setPosition(X, Y) {
         if (X !== null && X >= 0 && X <= game.garden.width() - game.squareSize) {
            game.player.X = X;
            game.player.element.style.left = `${X}px`;
         }
         if (Y !== null && Y >= 0 && Y <= game.garden.height() - game.squareSize) {
            game.player.Y = Y;
            game.player.element.style.bottom = `${Y}px`;
         }
      },

   },
   score: {
      total: {
         value: 0,
         element: document.querySelector(".header-total-value")
      },
      totem: {
         value: 0,
         element: document.querySelector(".header-totem-value")
      },
      update(score, scoreElement) {
         scoreElement.value = score;
         scoreElement.element.textContent = score;
      }
   },
   target: {
      selector: '.target',
      maxTarget: 0,
      totalFound: 0,
      X: [],
      Y: [],
      setMaxTarget(value) {
         game.target.maxTarget = value;
      },
      mission() {
         if (game.target.maxTarget <= 4) {
            if (game.round <= game.target.maxTarget) {
               return game.round;
            } else {
               return game.target.maxTarget;
            }
         }

         if (game.round > 5) {
            return 5;
         } else {
            return game.round;
         }
      }
   },
   screen: {
      width: document.body.clientWidth,
      height: document.body.clientHeight
   },
   garden: {
      element: document.querySelector(".garden"),
      width() {
         return game.garden.columns() * game.squareSize;
      },
      height() {
         return game.garden.rows() * game.squareSize;
      },
      columns() {
         return Math.floor(game.screen.width / game.squareSize);
      },
      rows() {
         return Math.floor((game.screen.height - 100) / game.squareSize);
      },
      totalSquare() {
         return game.garden.columns() * game.garden.rows();
      },
      removeSquare() {
         let elements = document.querySelectorAll('.square-border, .square-hole, .target');
         for (let element of elements) {
            element.remove();
         }

      }
   },
   createGarden(width, height) {
      // Set Grid config
      document.querySelector('.garden').style.gridTemplateColumns = `repeat(${game.garden.columns()}, ${game.squareSize}px)`
      //Create Divs for the garden
      for (i = 1; i <= height; i++) {
         for (j = 1; j <= width; j++) {
            let squareElem = document.createElement('div');
            squareElem.classList.add('square', 'square-border');
            game.garden.element.appendChild(squareElem);
         }
      }
   },
   createHole(X, Y) {
      let squareElem = document.createElement('div');
      squareElem.id = "hole";
      squareElem.classList.add('square', 'square-hole');
      squareElem.style.left = `${X}px`;
      squareElem.style.bottom = `${Y}px`;
      game.garden.element.appendChild(squareElem);
   },
   deleteAllElements(selector) {
      for (const hole of document.querySelectorAll(selector)) {
         hole.remove();
      }
   },
   initEventListener() {
      document.addEventListener("keyup", game.handleKeyboardAndButton);
      game.garden.element.addEventListener("click", game.handleKeyboardAndButton);
   },
   initPlayerPosition() {
      game.player.setPosition(game.randomPosition('X'), game.randomPosition('Y'));
   },
   initTargetPosition() {
      game.round++;
      game.printRound();
      // Set n targets regarding the garden size
      let totalSquare = game.garden.totalSquare();
      let maxTarget = Math.ceil(totalSquare / 3);
      game.target.setMaxTarget(maxTarget);
      game.target.totalFound = 0;

      for (let i = 0; i < maxTarget; i++) {
         // DOM element creation 
         const targetElement = document.createElement('div');
         targetElement.id = `target-round${game.round}-${i}`;
         targetElement.classList.add('square', 'target');
         game.garden.element.appendChild(targetElement);

         // Update Array of Target
         game.target.X[i] = game.randomPosition('X');
         game.target.Y[i] = game.randomPosition('Y');
         document.querySelector(`#target-round${game.round}-${i}`).style.left = `${game.target.X[i]}px`;
         document.querySelector(`#target-round${game.round}-${i}`).style.bottom = `${game.target.Y[i]}px`;
      }
   },
   randomPosition(axis) {
      // minus 1 because axis start at 0
      let max = (axis === "X") ? game.garden.columns() - 1 : game.garden.rows() - 1;
      // toFixed(1)
      max = Math.round(Math.random().toFixed(1) * max * game.squareSize);
      // remove modulo to have "hundred" total
      max = max - max % 100;
      return max;
   },
   printRound() {
      const roundElem = document.createElement('p');
      roundElem.id = 'round';
      roundElem.classList.add('round');
      roundElem.textContent = `round ${game.round}`;
      game.garden.element.appendChild(roundElem);
   },
   popUp(action) {
      let popUpId = "popup";
      let popUpTextId = "popUpText";
      let popUpButtonId = "popUpButton";
      if (action === "start") {
         let popUpDiv = html.createElement('div', game.garden.element);
         popUpDiv.id = popUpId;
         
         let popUpText = html.createElement('p', popUpDiv, 'You can play with touchscreen, mouse or keyboard. Enjoy !');
         popUpText.id = popUpTextId;

         popUpDiv.classList.add('popup', 'popup-start');

         let startButton = html.createElement('button', popUpDiv, 'Start Game');
         startButton.id = popUpButtonId;
         startButton.classList.add('button', 'button-start');
         startButton.addEventListener("click", () => {
            this.hideElement(popUpDiv);
            //setTimeout(game.startGame, 1);
            setTimeout(game.chooseTheme, 1);
         });
      } else if (action === "showEndScore") {
         let popUpDiv = document.querySelector('#' + popUpId);
         let popUpText = document.querySelector('#' + popUpTextId);
         let popUpButton = document.querySelector('#' + popUpButtonId);
         popUpText.textContent = `Your score is : ${game.score.total.value}`; 
         popUpButton.textContent = "Play again";
         this.showElement(popUpDiv);
         
      }
   },

   hideElement(element) {
      element.style.zIndex = -1;
   },
   showElement(element) {
      element.style.zIndex = 99;
   },
   handleKeyboardAndButton(event) {
      if (event.type === 'click') {
         let X = event.target.offsetLeft;
         let Y = game.garden.height() - event.target.offsetTop - game.squareSize;
         game.player.setPosition(X, Y);
      } else if (event.key === 'ArrowUp' && game.player.Y < game.garden.height() - game.squareSize) {
         game.player.setPosition(null, game.player.Y + game.squareSize);
      } else if (event.key === 'ArrowDown' && game.player.Y > 0) {
         game.player.setPosition(null, game.player.Y - game.squareSize);
      } else if (event.key === 'ArrowLeft' && game.player.X > 0) {
         game.player.setPosition(game.player.X - game.squareSize, null);
      } else if (event.key === 'ArrowRight' && game.player.X < game.garden.width() - game.squareSize) {
         game.player.setPosition(game.player.X + game.squareSize, null);
      }

      if (event.key === 'Enter' || event.code === 'Space' || event.type === 'click') {
         let targetFound = false;
         // Determine if player position is on target or not
         for (let i = 0, max = game.target.maxTarget; i < max; i++) {
            if (game.player.X === game.target.X[i] && game.player.Y === game.target.Y[i]) {
               document.querySelector(`#target-round${game.round}-${i}`).style.zIndex = 98;
               game.score.update(game.score.total.value + 20, game.score.total);
               game.score.update(game.score.totem.value + 1, game.score.totem);
               document.querySelector(`#target-round${game.round}-${i}`).classList.add('target-found');
               document.querySelector(`#target-round${game.round}-${i}`).style.transform = `translate(${game.garden.width() / 2 - game.target.X[i]}px,${-Math.abs(game.garden.height() - game.target.Y[i])}px)`;
               game.target.X[i] = null;
               game.target.Y[i] = null;
               setTimeout((round, i) => { game.deleteAllElements(`#target-round${round}-${i}`) }, 1000, round = game.round, i);
               game.target.totalFound++;
               targetFound = true;
               //game.initTargetPosition();
            }
         }

         if (!targetFound) {
            game.score.update(game.score.total.value - 2, game.score.total);
         }

         game.createHole(game.player.X, game.player.Y);

         if (game.target.totalFound >= game.target.mission()) {
            game.deleteAllElements('#hole');
            for (let i = 0, max = game.target.maxTarget; i < max; i++) {
               setTimeout((round, i) => { game.deleteAllElements(`#target-round${round}-${i}`) }, 1000, round = game.round, i);
            }
            game.initTargetPosition();
            //game.initPlayerPosition();
         }
         targetFound = false;
      }
   },

   startTimer(timer) {
      let prefix = ""
      if (timer <= 9) {
         prefix = "0";
         if (timer <= 5) {
            document.querySelector('.timer-value').style.color = "red";
         }
      } else {
         document.querySelector('.timer-value').style.color = "white";
      }

      if (timer === 0) {
         document.querySelector('.timer-value').textContent = "TIME IS UP";
         this.PopUp("showEndScore");
         return;
      }

      document.querySelector('.timer-value').textContent = prefix + timer;

      setTimeout(() => {
         game.garden.element.removeEventListener('click', game.handleKeyboardAndButton);
         document.removeEventListener('keyup', game.handleKeyboardAndButton);
      }, 1000 * timer);

      console.log(timer);

      setTimeout(() => {
         game.startTimer(--timer)
      }, 1000);
   },

   chooseTheme() {



      // Choose Theme Div
      let popUpElem = document.createElement('div');
      popUpElem.id = "choose-theme";
      popUpElem.classList.add('choose-theme','popup');
      game.garden.element.appendChild(popUpElem);

      // Text 
      let textElem = document.createElement('p');
      textElem.classList.add('choose-theme--text');
      textElem.textContent = "Choose your Player";
      popUpElem.appendChild(textElem);

      
      // Theme Choices
      let i = 0;
      for (let theme of game.theme) {
         let name = theme.name;
         let themeElem = document.createElement('img');   
         themeElem.id = `img-${name}`;
         themeElem.alt = i;
         themeElem.src = theme.playerImage;
         themeElem.classList.add('button');
         popUpElem.appendChild(themeElem);
         popUpElem.addEventListener('click', game.handleThemeChoice);
         i++;
      }

   },

   handleThemeChoice(event) {      
      console.log(game.theme[parseInt(event.target.alt)].playerImage)
      document.documentElement.style.setProperty('--player-image', `url(../${game.theme[parseInt(event.target.alt)].playerImage})`);
      document.documentElement.style.setProperty('--target-image', `url(../${game.theme[parseInt(event.target.alt)].targetImage})`);
      game.hideElement(document.querySelector('#choose-theme'));
      setTimeout(game.startGame, 5);
   },

   startGame() {
      game.round = 0;
      game.score.update(0, game.score.total);
      game.score.update(0, game.score.totem);
      document.querySelector('#choose-theme').remove();
      game.garden.removeSquare();
      game.createGarden(game.garden.columns(), game.garden.rows());
      game.initEventListener();
      game.initPlayerPosition();
      game.initTargetPosition();
      game.startTimer(3);

   }
}

// MAIN
// popUp() => chooseTheme() => startGame()
game.popUp("start");







