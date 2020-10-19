// the "output" variables
var canvas;
var context;

// the game variables
var state = 0; // game state
var TILESIZE; // size of the tiles, just to draw on the screen
var pieces; // the snake
var apple; // the apple
var keyUp, keyRight, keyDown, keyLeft; // keys pressed or released
var UP, DOWN, LEFT, RIGHT; // snake direction
var velX, velY; // axle speed
var collision; // indicates head collision with some part of the snake
var mapWidth, mapHeight; // "map" dimension

// the images
var imgApple;
var imgPiece;
var imgHead;

function loadImage(imgUrl) {
  var img = new Image();
  img.src = imgUrl;
  return img;
}

function Piece(x, y, dir) {
  this.id = -1;
  this.x = x || 0;
  this.y = y || 0;
  this.dir = dir || 0;
}

Piece.prototype = {
  setPos: function (x, y) {
    this.x = x;
    this.y = y;
  },

  randomPos: function () {
    var repeat;
    var newPos = { x: 0, y: 0 };

    do {
      repeat = false;
      newPos.x = Math.floor(Math.random() * mapWidth);
      newPos.y = Math.floor(Math.random() * mapHeight);
      for (var i = 0; i < pieces.length; i++)
        if (
          pieces[i].id == this.id ||
          (pieces[i].x == newPos.x && pieces[i].y == newPos.y)
        )
          repeat = true;
    } while (repeat);

    this.x = newPos.x;
    this.y = newPos.y;
  },

  draw: function (img) {
    context.drawImage(img, this.x * TILESIZE, this.y * TILESIZE);
  },
};

function keyboardDown(event) {
  var ev = event || window.event;

  switch (ev.keyCode) {
    case 37: // left arrow
      keyLeft = true;
      break;
    case 38: // up arrow
      keyUp = true;
      break;
    case 39: // right arrow
      keyRight = true;
      break;
    case 40: // down arrow
      keyDown = true;
      break;
    case 80: // p key = pause game
      velX = velY = 0;
      break;
    default:
      break;
  }
}

function keyboardUp(event) {
  var ev = event || window.event;

  switch (ev.keyCode) {
    case 37: // left arrow
      keyLeft = false;
      break;
    case 38: // up arrow
      keyUp = false;
      break;
    case 39: // right arrow
      keyRight = false;
      break;
    case 40: // down arrow
      keyDown = false;
      break;
    default:
      break;
  }
}

function gameInit() {
  TILESIZE = 32;
  mapWidth = 20;
  mapHeight = 15;
  canvas = document.getElementById('canvas');
  context = canvas.getContext('2d');
  canvas.width = mapWidth * TILESIZE;
  canvas.height = mapHeight * TILESIZE;

  imgPiece = loadImage('piece.png');
  imgApple = loadImage('apple.png');
  imgHead = loadImage('head.png');
  pieces = new Array(new Piece(), new Piece(), new Piece());
  apple = new Piece();
  apple.id = -10;
  velX = velY = 0;
  collision = false;
  // directions to follow
  UP = 0;
  RIGHT = 1;
  DOWN = 2;
  LEFT = 3;

  // initializing part A - the head
  pieces[2].id = 2;
  pieces[2].x = 3;
  pieces[2].y = 3;
  pieces[2].dir = RIGHT;

  // initializing part B
  pieces[1].id = 1;
  pieces[1].x = 2;
  pieces[1].y = 3;
  pieces[1].dir = RIGHT;

  // initializing part C - the tail
  pieces[0].id = 0;
  pieces[0].x = 1;
  pieces[0].y = 3;
  pieces[0].dir = RIGHT;

  // choose the coordinates of the apple
  apple.randomPos();

  // finally set the state to 1
  state = 1;

  // updates the current size on the HTML page
  document.getElementById('currSize').innerHTML = pieces.length;
  // updates the previous size on the HTML page
  document.getElementById('lastSize').innerHTML = 0;
}

function gameReset() {
  // updates the previous size on the HTML page
  document.getElementById('lastSize').innerHTML = pieces.length;

  // remove excess elements leaves only 3 to restart
  while (pieces.length > 3) pieces.pop();

  velX = velY = 0;
  collision = false;

  // resetting the parts
  // initializing part A - the head
  pieces[2].id = 2;
  pieces[2].x = 3;
  pieces[2].y = 3;
  pieces[2].dir = RIGHT;

  // initializing part B
  pieces[1].id = 1;
  pieces[1].x = 2;
  pieces[1].y = 3;
  pieces[1].dir = RIGHT;

  // initializing part C - the tail
  pieces[0].id = 0;
  pieces[0].x = 1;
  pieces[0].y = 3;
  pieces[0].dir = RIGHT;

  apple.randomPos();
  // updates the current size on the HTML page
  document.getElementById('currSize').innerHTML = pieces.length;
}

function gameLoop() {
  if (keyLeft) {
    if (pieces[pieces.length - 1].dir != RIGHT) {
      velX = -1;
      velY = 0;
      pieces[pieces.length - 1].dir = LEFT;
    }
  } else if (keyUp) {
    if (pieces[pieces.length - 1].dir != DOWN) {
      velX = 0;
      velY = -1;
      pieces[pieces.length - 1].dir = UP;
    }
  } else if (keyRight) {
    if (pieces[pieces.length - 1].dir != LEFT) {
      velX = 1;
      velY = 0;
      pieces[pieces.length - 1].dir = RIGHT;
    }
  } else if (keyDown) {
    if (pieces[pieces.length - 1].dir != UP) {
      velX = 0;
      velY = 1;
      pieces[pieces.length - 1].dir = DOWN;
    }
  }

  // updates the positions of the pieces if you are moving
  if (velX != 0 || velY != 0) {
    for (var i = 0; i < pieces.length - 1; i++) {
      pieces[i].x = pieces[i + 1].x;
      pieces[i].y = pieces[i + 1].y;
      pieces[i].dir = pieces[i + 1].dir;
    }
  }

  if (
    pieces[pieces.length - 1].x == apple.x &&
    pieces[pieces.length - 1].y == apple.y
  ) {
    pieces.push(new Piece());
    pieces[pieces.length - 1].x = apple.x;
    pieces[pieces.length - 1].y = apple.y;
    pieces[pieces.length - 1].dir = pieces[pieces.length - 2].dir;
    pieces[pieces.length - 1].id = pieces.length - 1;
    apple.randomPos();

    // updates the current size on the HTML page
    document.getElementById('currSize').innerHTML = pieces.length;
  }

  // now move your head
  pieces[pieces.length - 1].x += velX;
  pieces[pieces.length - 1].y += velY;

  // after moving the head limits the movement on the canvas
  // For the X axis
  if (pieces[pieces.length - 1].x >= mapWidth) {
    pieces[pieces.length - 1].x = 0;
  } else if (pieces[pieces.length - 1].x < 0) {
    pieces[pieces.length - 1].x = mapWidth - 1;
  }

  // Para o Y axis
  if (pieces[pieces.length - 1].y >= mapHeight) {
    pieces[pieces.length - 1].y = 0;
  } else if (pieces[pieces.length - 1].y < 0) {
    pieces[pieces.length - 1].y = mapHeight - 1;
  }

  // if it collided with any part of the snake
  if (collision) {
    gameReset();
  }

  // checks if it collided with any part of the snake
  for (var i = 0; i < pieces.length - 2 && !collision; i++)
    if (
      pieces[pieces.length - 1].x == pieces[i].x &&
      pieces[pieces.length - 1].y == pieces[i].y
    )
      collision = true;

  context.fillStyle = '#FFFFFF';
  context.fillRect(0, 0, canvas.width, canvas.height);

  // draws the snake's body (without the head)
  for (var i = 0; i < pieces.length - 1; i++) pieces[i].draw(imgPiece);
  // draw the apple
  apple.draw(imgApple);
  // draw the head
  pieces[pieces.length - 1].draw(imgHead);
}

function gameMain() {
  switch (state) {
    case 0:
      gameInit();
      break;
    case 1:
      gameLoop();
      break;
    default:
      state = 0;
      break;
  }
}
