//================================================================================
// GRABBIT GAME
//================================================================================
// TODO
// improve game.score.update
//================================================================================

//Game Object (with all parameters and functions)
const game = {
   round: 0,
   squareSize: 100,
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
               return game.target.maxTarget
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
      document.addEventListener("keyup", handleKeyboardAndButton);
      game.garden.element.addEventListener("click", handleKeyboardAndButton);
   },
   initTargetPosition() {
      game.round++;
      game.printRound();
      console.log("⏩ ~ initTargetPosition ~ game.round", game.round);
      // Set n targets regarding the garden size
      let totalSquare = game.garden.totalSquare();
      let maxTarget = Math.ceil(totalSquare / 3);
      game.target.setMaxTarget(maxTarget);
      game.target.totalFound = 0;

      for (let i = 0; i < maxTarget; i++) {
         // DOM element creation 
         const targetElement = document.createElement('div');
         targetElement.id = `target-round${game.round}-${i}`;
         console.log("⏩ ~ initTargetPosition ~ targetElement", targetElement);
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
      console.log("⏩ ~ randomPosition ~ max", axis, max);
      return max;
   },
   printRound() {
      const roundElem = document.createElement('p');
      roundElem.id = 'round';
      roundElem.classList.add('round');
      roundElem.textContent = `round ${game.round}`;
      game.garden.element.appendChild(roundElem);
   }
}




function handleKeyboardAndButton(event) {
   if (event.type === 'click') {
      console.log(event.target);
      let X = event.target.offsetLeft;
      console.log("⏩ ~ handleKeyboardAndButton ~ X", X);
      let Y = game.garden.height() - event.target.offsetTop - game.squareSize;
      console.log("⏩ ~ handleKeyboardAndButton ~ Y", Y);
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
      }
      targetFound = false;
   }
}


    //grid-template-columns: repeat(3, 1fr);
game.createGarden(game.garden.columns(), game.garden.rows());
game.initEventListener();
game.initTargetPosition();







