var module = (function () { // nothing should be before this line
  var deck = [];
  var deckDealPosition = 0;
  var theBlind = [];
  var cardsBuried = 0;
  var cardOwner = 0;
  var currentPlayer = 0;
  var activeCard = "";
  var priorSelectedCard;
  var selectedCard;
  var cardOffsets;
  var topCard = "";
  var activeHand = document.getElementsByClassName("card");
  var x = 0,
    y = 100;

  var xOffset = 0,
    yOffset = 0;

  var dragging = false;
  var placeCard = false;
  var players = {
    player0: {
      hand: [], // full of cards
      tricks: [],
      activeCard: null, // a card
    },
    player1: {
      hand: [], // full of cards
      tricks: [],
      activeCard: null, // a card
    },
    player2: {
      hand: [], // full of cards
      tricks: [],
      activeCard: null, // a card
    },
  };


  window.addEventListener('load', function load() {
    //      initialization area
    window.removeEventListener('load', load);




    for (var i = 0; i <= 31; i++) {
      generateCard(i);
    }
    shuffle(deck);
    dealHands();
    displayFirstHands();
    rotateCards();
    //end initialization area
  });

  function displayFirstHands() {
    for (j = 0; j < (players.player0.hand.length - 1); j++) {
      var newCard = document.createElement("img");
      newCard.setAttribute("src", players.player0.hand[j].image);
      newCard.classList.add("card");
      newCard.addEventListener('touchstart', dragStart);
      document.getElementById("currentPlayer").appendChild(newCard);
      players.player0.hand[j].element = newCard;
    }
    for (i = 0; i < (players.player1.hand.length - 1); i++) {
      var cardBack = document.createElement("img");
      cardBack.setAttribute("src", "Card Images/CardBack.png");
      cardBack.classList.add("nextOpponentCard");
      document.getElementById("nextPlayer").appendChild(cardBack);
    }
    for (y = 0; y < (players.player2.hand.length - 1); y++) {
      var cardBack2 = document.createElement("img");
      cardBack2.setAttribute("src", "Card Images/CardBack.png");
      cardBack2.classList.add("previousOpponentCard");
      document.getElementById("prevPlayer").appendChild(cardBack2);
    }
    
  }

  function generateCard(cardNumber) {

    var newCard = {
      suit: "",
      number: 0,
      rank: 0,
      points: 0,
      image: "Card Images/" + (cardNumber + 1) + ".png",
      owner: "",
      element: "",
    };
    deck[cardNumber] = newCard;
    newCard.number = cardNumber;

    if (cardNumber < 6) {
      newCard.suit = "clubs";
    }
    if (cardNumber < 12 && cardNumber >= 6) {
      newCard.suit = "hearts";

    }
    if (cardNumber < 18 && cardNumber >= 12) {
      newCard.suit = "spades";
    }
    if (cardNumber >= 18) {
      newCard.suit = "diamonds";
    }


    if (cardNumber < 6) {
      newCard.rank = cardNumber + 1;
    }
    if (cardNumber < 12 && cardNumber >= 6) {
      newCard.rank = cardNumber - 5;
    }
    if (cardNumber < 18 && cardNumber >= 12) {
      newCard.rank = cardNumber - 11;
    }
    if (cardNumber >= 18) {
      newCard.rank = cardNumber - 17;
    }

    if (newCard.rank == 4) {
      newCard.points = 4;
    } else if (newCard.rank == 5) {
      newCard.points = 10;
    } else if (newCard.rank == 6) {
      newCard.points = 11;
    } else if (newCard.rank >= 7 && newCard.rank <= 10) {
      newCard.points = 2;
    } else if (newCard.rank >= 11 && newCard.rank <= 14) {
      newCard.points = 3;
    } else {
      newCard.points = 0;
    }
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
  }

  function dealHands(numberOfHands) {
    numberOfHands = numberOfHands || 3;
    var theClasses = document.getElementsByClassName("hand");
    for (; numberOfHands--;) {
      players["player" + numberOfHands].hand.push({
        cards: sortHand(dealHand())
      });
      cardOwner++;
    }
  }

  function dealHand() {
    var theCards = [];
    for (i = 0; i < 10; i++) {
      theCards[i] = deck[deckDealPosition];
      players['player' + cardOwner].hand[i] = deck[deckDealPosition];
      theCards[i].owner = cardOwner;
      deckDealPosition++;

    }
    if (cardOwner == 3) {
      for (i = 0; i <= 1; i++) {
        theBlind[i] = deck[deckDealPosition];
        theBlind[i].owner = "theBlind";
        deckDealPosition++;

      }
    }
    return players['player' + cardOwner].hand;
  }

  function sortHand(theHand) {
    theHand.sort(function (a, b) {

      return parseInt(a.number - b.number);
    });
    return theHand;
  }

  function rotateCards() {
    var theActiveCards = document.getElementsByClassName("card");
    var midPoint = (theActiveCards.length - 1) / 2;
    var totalDegrees = 30;
    var currentDegrees = (totalDegrees / 2) * -1;
    var degreeIncrement = totalDegrees / theActiveCards.length;
    var deltaHeight = 30;
    var heightIncrement = deltaHeight / theActiveCards.length;
    var currentHeight = 0;
    var multiplier = theActiveCards[0].offsetHeight / 15;
    var radius = (midPoint + 1) * multiplier;


    for (i = 0; i < theActiveCards.length; i++) {
      var fakeX = (i - midPoint) * multiplier;

      currentHeight = -Math.sqrt((radius * radius) - (fakeX * fakeX));
      currentDegrees += (degreeIncrement);
      theActiveCards[i].style.transform = "rotate(" + currentDegrees + "deg) translate(0px, " + (currentHeight + 50) + "px)";
    } 
    
    
    
    
    var theActiveCards = document.getElementsByClassName("nextOpponentCard");
    var midPoint = (theActiveCards.length - 1) / 2;
    var totalDegrees = -30;
    var currentDegrees = (totalDegrees / 2) * -1;
    var degreeIncrement = totalDegrees / theActiveCards.length;
    var deltaHeight = 30;
    var heightIncrement = deltaHeight / theActiveCards.length;
    var currentHeight = 0;
    var multiplier = theActiveCards[0].offsetHeight / 15;
    var radius = (midPoint + 1) * multiplier;


    for (i = 0; i < theActiveCards.length; i++) {
      var fakeX = (i - midPoint) * multiplier;

      currentHeight = -Math.sqrt((radius * radius) - (fakeX * fakeX));
      currentDegrees += (degreeIncrement);
      theActiveCards[i].style.transform = "rotate(" + (currentDegrees - 180) + "deg) translate(0px, " + (currentHeight + 30) + "px)";
    } 
    
    
    var theActiveCards = document.getElementsByClassName("previousOpponentCard");
    var midPoint = (theActiveCards.length - 1) / 2;
    var totalDegrees = -30;
    var currentDegrees = (totalDegrees / 2) * -1;
    var degreeIncrement = totalDegrees / theActiveCards.length;
    var deltaHeight = 30;
    var heightIncrement = deltaHeight / theActiveCards.length;
    var currentHeight = 0;
    var multiplier = theActiveCards[0].offsetHeight / 15;
    var radius = (midPoint + 1) * multiplier;


    for (i = 0; i < theActiveCards.length; i++) {
      var fakeX = (i - midPoint) * multiplier;

      currentHeight = -Math.sqrt((radius * radius) - (fakeX * fakeX));
      currentDegrees += (degreeIncrement);
      theActiveCards[i].style.transform = "rotate(" + (currentDegrees - 180) + "deg) translate(0px, " + (currentHeight + 30) + "px)";
    } 
  }

  function dragStart(event) {
    event.preventDefault();
    dragging = true;
    players.player0.activeCard = players.player0.hand.find(function (card) {
      return (event.target == card.element);
    });
    var activeCard = players.player0.activeCard;
    var activeCardElement = activeCard.element;
    cardOffsets = activeCardElement.getBoundingClientRect();
    dragCard(event);
    render();
    document.addEventListener('mousemove', dragCard);
    document.addEventListener('touchmove', dragCard);
    document.addEventListener('onmouseup', dragEnd);
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

    document.removeEventListener('onmouseup', dragEnd);
    document.removeEventListener('touchend', dragEnd);
    priorSelectedCard = selectedCard;
    selectedCard = event.target;

    var cardBelongsToPlayer = selectedCard.owner == currentPlayer, // evalutates to true or false
      blindIsOver = cardsBuried >= 2,
      cardInPlayArea = event.clientX >= 730; //ADJUST FOR NEW PLAY AREA

    if (cardBelongsToPlayer && blindIsOver && cardInPlayArea) {
      placeCard = true;

      activeCard.removeEventListener('mousedown', dragStart);

      topCard++;
      currentPlayer += 1;

      if (currentPlayer == 3) currentPlayer = 0;

      cardPlayed();
    } else {
      placeCard = false;
    }

    document.removeEventListener('mousemove', dragCard);
    document.removeEventListener('touchmove', dragCard);

  }

  function render() {

    //    var cardOwner = activeCard.owner;
    var activeCard = players.player0.activeCard;
    var activeCardElement = activeCard.element; //move to dragstart and save top as y offset and left as x offset

    // check data, use that data to change DOM
    if (players.player0.activeCard != "") {
      activeCardElement.style.transform = "rotate(0deg) translate(0px, 0px)";
      activeCardElement.classList.add("bigger", "card");
      activeCardElement.style.transitionDuration = "0s";
      activeCardElement.style.position = "relative";
      activeCardElement.style.top = (y - cardOffsets.top) + 'px'; //Use these lines to move the cards fluidly
      activeCardElement.style.left = (x - cardOffsets.left - 70) + 'px';
      activeCardElement.style.zIndex = topCard;
    }

    // deals with placement of cards in playarea
    if (!dragging) {

      if (placeCard) {
        //      activeCard.style.transitionDuration = "0.5s";
        activeCard.classList.remove("bigger");
      } else if (!placeCard) {
        activeCardElement.style.position = "";
        activeCardElement.style.zIndex = "";
        activeCardElement.style.marginLeft = "";
      }
    }

    requestAnimationFrame(render);
  }

}()); // nothing should be past this line