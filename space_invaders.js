// Buttons numbers used for navigation
const LEFT_ARROW_ID        = 37;
const RIGHT_ARROW_ID       = 39;
const SPACE_ID             = 32;

const SCREEN_WIDTH         = 100;
const SCREEN_HEIGHT        = 100;

const UPDATE_FREQUENCY     = 23;

// Bullets related variables
const BULLET_CONTAINER     = 'bulletContainer';
const BULLET_POSITION_TOP  = 10; // Starting top position to fit the ship properly
const BULLET_POSITION_LEFT = 3;  // Starting left position to fir the ship properly
const BULET_TYPE_BASIC     = 'bullet';
const BULLET_ID_NAME       = 'shot_';
var objShots               = {};
var totalShotNumber        = 0;
var _nBulletPositionUpdate = 0.2;
var _nBulletHealth         = 1;
var _nBulletSpeed          = 1;
var _nBulletHeight         = 1;
var _nBulletWidth          = 1;


// Enemies related variables
const ENEMIES_CONTAINER    = 'enemiesContainer';
const ENEMY_ID_NAME        = 'enemy_';
const ENEMY_CLASS          = 'enemy';
const ENEMY_TYPE_BASIC     = 'enemy';
var objEnemies             = {};
var _sEnemyColor            = 'red';
var _nEnemiesNumberTotal    = 20;
var _nEnemiesInRowTotal     = 6;
var _nEnemyHeight           = 3;
var _nEnemyWidth            = 1;
var _nEnemySpeed            = 1;
var _nEnemyHealthBasic      = 100;

// Ship related variables
const SHIP_POSITION_UPDATE = 1;
const SHIP_TYPE            = 'ship';
const SHIP_CLASS           = 'ship';
var objShip                = {};
var _sShipColor            = 'black';
var _nShipHeight           = 3;
var _nShipWidth            = 5;
var _nShipSpeed            = 1;
var _nShipBasicHealth      = 100;

// Ship movement variables
var bMoveShipLeft          = false;
var bMoveShipRight         = false;


// On page load generate ship and enemies
$(document).ready(function () {
  createShip();
  createEnemies();
});

// Function creates user's ship
function createShip() {
  let ship     = $('.' + SHIP_CLASS);
  let position = ship.position();

  objShip = {
    type: SHIP_TYPE,
    color: _sShipColor,
    position: {
      top: parseInt(position.top / $(ship).parent().height() * SCREEN_WIDTH),
      left: parseInt(position.left / $(ship).parent().width() * SCREEN_WIDTH),
    },
    height: _nShipHeight,
    width: _nShipWidth,
    speed: _nShipSpeed,
    health: _nShipBasicHealth,
  };
}

// Function creates enemies. Number of enemies may change according to constants defined
function createEnemies() {
  container         = $('#' + ENEMIES_CONTAINER);
  var nEnemyCounter = 0;

  for(var nRow = 0; nEnemyCounter < _nEnemiesNumberTotal; nRow++) {
    for(var nEnemyInRow = 0; nEnemyInRow < _nEnemiesInRowTotal; nEnemyInRow++) {
      // Calculate enemies' positions
      var nLeftPosition = SCREEN_WIDTH - (SCREEN_WIDTH - 20 - (10 * nEnemyInRow));
      var nTopPosition  = SCREEN_HEIGHT - (SCREEN_HEIGHT - 10 - (nRow * 10));

      // Main object that contains data about all enemies
      objEnemies[nEnemyCounter] = {
        type: ENEMY_TYPE_BASIC,
        color: _sEnemyColor,
        position: {
          top: nTopPosition,
          left: nLeftPosition
        },
        height: _nEnemyHeight,
        width: _nEnemyWidth,
        speed: _nEnemySpeed,
        health: _nEnemyHealthBasic,
      };

      var ID = ENEMY_ID_NAME + nEnemyCounter;

      // Add enemy markup
      container.append('<div id=' + ID + ' class="' + ENEMY_CLASS + '"><p>III</p></div>');
      $('#' + ID).css({
        top: objEnemies[nEnemyCounter].position.top + "%",
        left: objEnemies[nEnemyCounter].position.left + "%"
      });

      nEnemyCounter++;
      if (nEnemyCounter >= _nEnemiesNumberTotal) {
        break;
      }
    }
  }
}

// Let's move that ship!
// On keydown we will start moving the ship, on key up it will be stopped
$(document).keydown(function(e) {
    switch(e.which) {
      case LEFT_ARROW_ID: // Go left
        bMoveShipLeft = true;
        // $('.' + SHIP_CLASS).css({left: objShip.position.left - SHIP_POSITION_UPDATE + "%"});
        // objShip.position.left -= SHIP_POSITION_UPDATE;

        break;

      case RIGHT_ARROW_ID: // Go right
        bMoveShipRight = true;
        // $('.' + SHIP_CLASS).css({left: objShip.position.left + SHIP_POSITION_UPDATE + "%"});
        // objShip.position.left += SHIP_POSITION_UPDATE;

        break;

      case SPACE_ID: // space FIRE !!!
        fire();

        break;

        default: return; // exit this handler for other keys
    }

    e.preventDefault(); // prevent the default action (scroll / move caret)
}).keyup(function(e) {
  switch(e.which) {
    case LEFT_ARROW_ID: // Go left
      bMoveShipLeft = false;

      break;

    case RIGHT_ARROW_ID: // Go right
      bMoveShipRight = false;

      break;
  }

  e.preventDefault(); // prevent the default action (scroll / move caret)
});


function fire() {
  let sName = BULLET_ID_NAME + totalShotNumber;

  objShots[totalShotNumber] = {
    type: BULET_TYPE_BASIC,
    color: "black",
    position: {
      top: objShip.position.top - BULLET_POSITION_TOP + "%",
      left: objShip.position.left - BULLET_POSITION_LEFT + "%",
    },
    height: _nBulletHeight,
    width: _nBulletWidth,
    speed: _nBulletSpeed,
    health: _nBulletHealth,
  };

  $('#' + BULLET_CONTAINER).append("<div id=" + sName + " class='vertical-transform'><p>BANG!!!</p></div>");
  $('#' + sName).css({
    left: objShots[totalShotNumber].position.left,
    top: objShots[totalShotNumber].position.top,
  });

  totalShotNumber++;
}

// Function updates the position of bullet with given if by value defined in constants
function updateBulletsPosition(nBulletIndex, bullet) {
  objShots[nBulletIndex].position.top = parseInt(objShots[nBulletIndex].position.top) - _nBulletPositionUpdate + "%";
  bullet.css({
    top: parseInt(objShots[nBulletIndex].position.top) + "%"
  });
}

// Function checks if any enemy was hitted by bullet with given ID number. If yes it removes both the bullet and the enemy ship
function enemyHitted(nBulletIndex, bullet) {
  $.each(objEnemies, function(nEnemyIndex, arrEnemyData) {
    // First check if given bullet still exists (it could hit the enemy already)
    if (typeof objShots[nBulletIndex] !== 'undefined') {
      nEnemyPositionTop  = parseInt(objEnemies[nEnemyIndex].position.top);
      nEnemyPositionLeft = parseInt(objEnemies[nEnemyIndex].position.left);

      nShotPositionTop   = parseInt(objShots[nBulletIndex].position.top);
      nShotPositionLeft  = parseInt(objShots[nBulletIndex].position.left);

      if (nShotPositionTop == nEnemyPositionTop &&
        nShotPositionLeft > (nEnemyPositionLeft - (4 * _nEnemyWidth)) &&
        nShotPositionLeft < (nEnemyPositionLeft - _nEnemyWidth)) {

        // Delete enemy
        delete objEnemies[nEnemyIndex];
        $("#" + ENEMY_ID_NAME + nEnemyIndex).remove();

        // Delete bullet
        deleteBullet(nBulletIndex, bullet);
      } else {
      }
    }
  });
}

// Function checks if bullet with given ID is out of screen. If so it removes it's markup and destroys it's object
function removeMissedBullets(nBulletIndex, bullet) {
  if (typeof objShots[nBulletIndex] !== 'undefined' && parseInt(objShots[nBulletIndex].position.top) < 1) {
    deleteBullet(nBulletIndex, bullet);
  }
}

// Delete the bullet and it's markup
function deleteBullet(nBulletIndex, bullet) {
  delete objShots[nBulletIndex];
  bullet.remove();
}

// Function does all actions related to bullets - updates positions, check if it's out of screen, if it hits the target
// and does proper action
function bulletsUpdate() {
  $.each(objShots, function(nBulletIndex, arrBulletData) {
    bullet = $('#' + BULLET_ID_NAME + nBulletIndex);

    // Update position of the bullets
    updateBulletsPosition(nBulletIndex, bullet);

    // Check if enemy was hit
    enemyHitted(nBulletIndex, bullet);

    // Check if bullet is out of screen and if so delete it
    removeMissedBullets(nBulletIndex, bullet);
  });
}

// Basing on global variables function checks if ship should be moved right or left
function moveShip() {
  let shipMarkup = $('.' + SHIP_CLASS);

  // Move ship left
  if (bMoveShipLeft && !bMoveShipRight) {
    shipMarkup.css({left: objShip.position.left - SHIP_POSITION_UPDATE + "%"});
    objShip.position.left -= SHIP_POSITION_UPDATE;
  }

  // Move ship right
  if (bMoveShipRight && !bMoveShipLeft) {
    shipMarkup.css({left: objShip.position.left + SHIP_POSITION_UPDATE + "%"});
    objShip.position.left += SHIP_POSITION_UPDATE;
  }
}

setInterval(function() {
  // Deal with bullets
  bulletsUpdate();

  // Move the ship
  moveShip();
}, UPDATE_FREQUENCY);
