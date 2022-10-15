const game = {
   cubeSize: 100,
   playerPosition: {
      X: 0,
      Y: 0
   },
   target: {
      selector: '.target',
      X: 0,
      Y: 0
   },
   screen: {
      width: document.body.clientWidth,
      height: document.body.clientHeight
   },
   garden: {
      element: document.querySelector(".garden"),
      width() {
         return game.garden.columns() * game.cubeSize;
      },
      height() {
         return game.garden.rows() * game.cubeSize;
      },
      columns() {
         return Math.floor(game.screen.width / game.cubeSize);
      },
      rows() {
         return Math.floor((game.screen.height - 100) / game.cubeSize);
      }
   },
   createGarden(width, height) {
      //Create Divs for the garden
      for (i = 1; i <= height; i++) {
         for (j = 1; j <= width; j++) {
            let cubeElem = document.createElement('div');
            cubeElem.classList.add('cube');
            game.garden.element.appendChild(cubeElem);
         }
      }
   },
   createHole(X, Y) {
      let cubeElem = document.createElement('div');
      cubeElem.classList.add('cube', 'cube-hole');
      cubeElem.style.left = `${X}px`;
      cubeElem.style.bottom = `${Y}px`;
      game.garden.element.appendChild(cubeElem);

   },
   initEventListener() {
      document.addEventListener("keyup", handleKeyboardAndButton);
   }
}




function handleKeyboardAndButton(event) {
   if (event.key === 'ArrowUp') {
      console.log("UP");
      game.playerPosition.Y += game.cubeSize;
      player.style.bottom = game.playerPosition.Y + "px";
   } else if (event.key === 'ArrowDown') {
      console.log("DOWN");
      game.playerPosition.Y -= game.cubeSize;
      player.style.bottom = game.playerPosition.Y + "px";
   } else if (event.key === 'ArrowLeft') {
      console.log("LEFT");
      game.playerPosition.X -= game.cubeSize;
      player.style.left = game.playerPosition.X + "px";
   } else if (event.key === 'ArrowRight') {
      console.log("Right");
      game.playerPosition.X += game.cubeSize;
      player.style.left = game.playerPosition.X + "px";
   }else {
      console.log(event);
   }
}


document.querySelector('.garden').style.gridTemplateColumns = `repeat(${game.garden.columns()}, ${game.cubeSize}px)`    //grid-template-columns: repeat(3, 1fr);
game.createGarden(game.garden.columns(), game.garden.rows());
game.initEventListener();
const player = document.querySelector('#player');

//console.log(game.randomPosition('X'));






