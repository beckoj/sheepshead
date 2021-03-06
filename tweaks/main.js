var module = (function () { // nothing should be before this line
  var deck = [];
  var tricks = [];
  var deckDealPosition = 0;
  var theBlind = [];
  var cardsBuried = 2; //CHANGE TO 0 AGAIN
  var cardOwner = 0;
  var playAreaElement;
  var nextTurnButton;
  var rerenderHands = true;

  var currentPlayer = null,
    nextPlayer = 0;

  var activeCard = "";
  var selectedCard;
  var priorSelectedCard;
  var cardOffsets;
  var handElement;
  var priorPlayArea;
  var priorCardInPlay;
  var x = 0,
    y = 100;

  var xOffset = 0,
    yOffset = 0;

  var dragging = false;
  var placeCard = false;
  var priorPlaceCard = false;
  var cardsSelected = 0;
  var players = [
    {
      hand: [], // full of cards
      tricks: [],
      activeCard: null, // a card
      priorActiveCard: null,
    },
    {
      hand: [], // full of cards
      tricks: [],
      activeCard: null, // a card
      priorActiveCard: null,
    },
    {
      hand: [], // full of cards
      tricks: [],
      activeCard: null, // a card
      priorActiveCard: null,
    },
  ];


  window.addEventListener('load', function load() {
    window.removeEventListener('load', load);
    // initialization area

    nextTurnButton = document.getElementById('nextTurn');
    nextTurnButton.addEventListener("click", nextTurn);

    SelectNewCard = document.getElementById('SelectNewCard');
    SelectNewCard.addEventListener("click", renderHands);
    SelectNewCard.addEventListener("click", rotateCards);
    SelectNewCard.addEventListener("click", selectNewCard);

    deck = shuffle(generateDeck());

    dealAllHands();

    render();


    // end initialization area
  });


  function renderHands() {

    var nextId = currentPlayer + 1,
      prevId = currentPlayer - 1,
      startId = 0,
      endId = players.length - 1;

    if (nextId > endId)
      nextId = startId;

    if (prevId < 0)
      prevId = endId;

    var currentHand = document.querySelector('#current.player>.hand'),
      nextHand = document.querySelector('#next.player>.hand'),
      previousHand = document.querySelector('#previous.player>.hand');

    currentHand.innerHTML = '';
    nextHand.innerHTML = '';
    previousHand.innerHTML = '';

    players.forEach((player, playerNumber) => {
      player.hand.forEach(card => {

        if (card.inPlay == false) {
          var element = document.createElement('img');

          element.classList.add('card');
          element.addEventListener('touchstart', dragStart);

          if (playerNumber === currentPlayer) {
            element.setAttribute("src", card.image);
            currentHand.appendChild(element);
          } else if (playerNumber === nextId) {
            element.setAttribute("src", "../Card Images/CardBack.jpg");
            nextHand.appendChild(element);
          } else if (playerNumber === prevId) {
            element.setAttribute("src", "../Card Images/CardBack.jpg");
            previousHand.appendChild(element);
          }

          card.element = element;
        }
      });
    });
  }

  function rotateCards() {
    players.forEach((player) => {
      var hand = player.hand;
      var midPoint = (hand.length - 1) / 2;

      var totalDegrees = 30,
        degreeIncrement = totalDegrees / hand.length,
        currentDegrees = (totalDegrees / 2) * -1;

      var deltaHeight = 30,
        heightIncrement = deltaHeight / hand.length,
        currentHeight = 0;

      var multiplier = hand[0].element.offsetHeight / 15,
        radius = (midPoint + 1) * multiplier;

      hand.forEach((card, index) => {
        var fakeX = (index - midPoint) * multiplier;

        currentHeight = -Math.sqrt((radius * radius) - (fakeX * fakeX));
        currentDegrees += (degreeIncrement);

        card.element.style.transform = "rotate(" + currentDegrees + "deg) translate(0px, " + (currentHeight + 50) + "px)";
      });
    });
  }

  function nextTurn() {
    if (placeCard) {
      handElement = document.getElementsByClassName('hand');
      players[currentPlayer].priorActiveCard.inPlay = true;
      handElement[2].removeChild(players[currentPlayer].priorActiveCard.element);
      rerenderHands = true;

      
      priorPlayArea = document.getElementById('lastCardPlayZone');
      priorCardInPlay = document.createElement('img');
      priorCardInPlay.setAttribute("src", players[currentPlayer].priorActiveCard.image);
      priorCardInPlay.setAttribute("id", 'playedCard');
      priorPlayArea.appendChild(priorCardInPlay);
    }
  }

  function selectNewCard() {
    players[currentPlayer].activeCard.inPlay = false;
  }

  function rotatePlayers() {
    nextPlayer++;

    if (nextPlayer > (players.length - 1)) {
      nextPlayer = 0;
    }
  }

  function generateDeck() {
    var deckSize = 31,
      deck = []

    for (var i = 0; i <= deckSize; i++) {
      deck.push(generateCard(i));
    }

    return deck;
  }

  function generateCard(cardNumber) {

    var suit, rank, points;

    if (cardNumber < 6) {
      suit = "clubs";
      rank = cardNumber + 1;
    } else if (cardNumber >= 6 && cardNumber < 12) {
      suit = "hearts";
      rank = cardNumber - 5;
    } else if (cardNumber >= 12 && cardNumber < 18) {
      suit = "spades";
      rank = cardNumber - 11;
    } else if (cardNumber >= 18) {
      suit = "diamonds";
      rank = cardNumber - 17;
    }

    if (rank == 4) points = 4;
    else if (rank == 5) points = 10;
    else if (rank == 6) points = 11;
    else if (rank >= 7 && rank <= 10) points = 2;
    else if (rank >= 11 && rank <= 14) points = 3;
    else points = 0;


    return {
      number: cardNumber,
      suit: suit,
      rank: rank,
      points: points,
      image: "../Card Images/" + (cardNumber + 1) + ".jpg",
      owner: 0,
      element: null,
      inPlay: false
    };
  }

  function shuffle(deck) {
    var currentIndex = deck.length,
      temporaryValue, randomIndex;

    while (0 !== currentIndex) {

      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = deck[currentIndex];
      deck[currentIndex] = deck[randomIndex];
      deck[randomIndex] = temporaryValue;
    }

    return deck;
  }

  function dealAllHands(numberOfHands) {
    numberOfHands = numberOfHands || 3;

    for (; numberOfHands--;) {

      players[numberOfHands].hand = sortHand(dealHand());
      cardOwner++;
    }
  }

  function dealHand() {
    var theCards = [];

    for (i = 0; i < 10; i++) {
      theCards[i] = deck[deckDealPosition];
      theCards[i].owner = (cardOwner == 3) ? "theBlind" : cardOwner;
      deckDealPosition++;
    }

    return theCards;
  }

  function sortHand(theHand) {
    theHand.sort(function (a, b) {
      return parseInt(a.number - b.number);
    });

    return theHand;
  }

  function dragStart(event) {
    event.preventDefault();
    dragging = true;
    players[currentPlayer].activeCard = players[currentPlayer].hand.find(function (card) {
      return (event.target == card.element);
    });
    var activeCard = players[currentPlayer].activeCard;
    var activeCardElement = activeCard.element;
    cardOffsets = activeCardElement.getBoundingClientRect();
    dragCard(event);
    render();

    document.addEventListener('mousemove', dragCard);
    document.addEventListener('mouseup', dragEnd);

    document.addEventListener('touchmove', dragCard);
    document.addEventListener('touchend', dragEnd);
  }

  function dragCard(event) {
    if (event.touches && event.touches.length > 0) {
      x = event.touches[0].pageX;
      y = event.touches[0].pageY;
    } else {
      x = event.clientX;
      y = event.clientY;
    }

  }

  function dragEnd(event) {
    dragging = false;

    priorSelectedCard = selectedCard;
    selectedCard = players[currentPlayer].activeCard;

    var cardBelongsToPlayer = selectedCard.owner == currentPlayer, // evalutates to true or false
      playArea = document.getElementById("cardPlayZone").getBoundingClientRect(),
      playXMin = playArea.left,
      playXMax = playArea.right,
      playYMax = playArea.bottom,
      playYMin = playArea.top,
      blindIsOver = cardsBuried >= 2,
      cardInPlayArea = (x >= playXMin && x < playXMax && y >= playYMin && y < playYMax); //ADJUST FOR NEW PLAY AREA

    if (blindIsOver && cardInPlayArea) {

      if (priorSelectedCard) {
        if (priorSelectedCard.inPlay) {
          priorSelectedCard.inPlay == false;
        }
      }

      placeCard = true;
      selectedCard.element.removeEventListener('touchstart', dragStart);
      selectedCard.inPlay = true;
      cardsSelected++;
      nextPlayer += 1;

      if (nextPlayer == 3) nextPlayer = 0;
    } else {
      placeCard = false;
    }

    document.removeEventListener('mousemove', dragCard);
    document.removeEventListener('mouseup', dragEnd);

    document.removeEventListener('touchmove', dragCard);
    document.removeEventListener('touchend', dragEnd);
  }

  function render() {

    // this renders cards if the next player is not the same as the current
    if (currentPlayer != nextPlayer) {
      if (rerenderHands == true) {
        currentPlayer = nextPlayer;
        renderHands();
        rotateCards();
      }
      rerenderHands = false;
    }
    var priorActiveCard = players[currentPlayer].priorActiveCard;
    var activeCard = players[currentPlayer].activeCard;

    // check data, use that data to change DOM
    if (activeCard) {

      var activeCardElement = activeCard.element; //move to dragstart and save top as y offset and left as x offset

      if (dragging) {
        activeCardElement.classList.add("bigger");
        activeCardElement.style.position = "relative";
        activeCardElement.style.top = (y - cardOffsets.top) + 'px'; //Use these lines to move the cards fluidly
        activeCardElement.style.left = (x - cardOffsets.left - 70) + 'px';
      }

      // deals with placement of cards in playarea
      if (!dragging) {
        activeCardElement.classList.remove("bigger");

        if (!placeCard) {
          activeCardElement.style.position = "";
          activeCardElement.style.zIndex = "";
          activeCardElement.style.marginLeft = "";
        }
        if (placeCard) {
          if (priorActiveCard)
            if (!priorActiveCard.inPlay) {
              priorActiveCard.style.position = "relative";
              priorActiveCard.style.transitionDuration = "0.3s";
              priorActiveCard.style.transform = "";
            }
          activeCardElement.style.position = "absolute";
          activeCardElement.style.transitionDuration = "0s";
          activeCardElement.style.top = (-215) + 'px';
          activeCardElement.style.left = (312) + 'px';
          activeCardElement.style.transform = "";

        }
        console.log(priorActiveCard);
        if (priorActiveCard && cardsSelected > 1) {
          priorActiveCard.element.style.position = "relative";
          priorActiveCard.element.style.transitionDuration = "0.3s";
          priorActiveCard.element.style.top = (215) + 'px';
          priorActiveCard.element.style.left = (-312) + 'px';

        }

        players[currentPlayer].priorActiveCard = players[currentPlayer].activeCard;
        players[currentPlayer].activeCard = null;
        activeCard = null;
      }
    }

    requestAnimationFrame(render);
  }

  return {
    players: players
  }

}()); // nothing should be past this line