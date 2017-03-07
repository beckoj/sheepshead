var module = (function () { // nothing should be before this line

//  Nathaniel's dumb ideaas about how you do data. WHOOOO!
//  var deck = [
//    {
//      suit: 'diamond', // hearts || diamonds || spades || clubs
//      rank: 4,
//      points: 4,
//      number: 21,
//      image: './Card Images/21.png'
//    },
//    {
//      suit: 'diamond', // hearts || diamonds || spades || clubs
//      rank: 4,
//      points: 4,
//      number: 21,
//      image: './Card Images/21.png'
//    }
//  ];
//  
//  var players = {
//   player1: {
//     hand: [], // full of cards
//     tricks: [],
//     activeCard: null, // a card
//   }
//  };
  
  
  var randomIndex;
  var x = 0,
      y = 100;
  var selectedCard;
  var theDeck = [];
  var deckDealPosition = 0;
  var theBlind = [];
  var hands = [];
  var topCard = 0;
  var currentPlayer = 0;
  var leader;
  var cardOwner = 0;
  var playerPicking = 0;
  var cardsBuried = 0;
  var activeCard;
  var priorSelectedCard;
  var x;
  var y;

  var dragging = false,
      placeCard = false; // if true, place card on board, else snap back

  var trick = {
    firstCard: "",
    secondCard: "",
    thirdCard: "",
    points: 0
  };

  var Players = {
    player0: {
      score: 0,
      playerNumber: 0,
      cards: [],
    },
    player1: {
      score: 0,
      playerNumber: 1,
      cards: [],
    },
    player2: {
      score: 0,
      playerNumber: 2,
      cards: [],
    }

  };
  // initialization code -- only put stuff that needs to run once in here
  window.addEventListener('load', function load() {
    window.removeEventListener('load', load, false);
    // code in this load() function runs AFTER the dom is loaded
    for (var i = 0; i <= 31; i++) {
      generateCard(i);
    }

    shuffle(theDeck);
    dealHands();

    document.addEventListener('mouseup', clickDestination); //Stolen from box stuff

    var blindSelect = document.getElementById('takeBlind');
    blindSelect.addEventListener("click", blindSelected);

    var rejectBlind = document.getElementById('rejectBlind');
    rejectBlind.addEventListener("click", blindRejected);



  }, false);

  function generateCard(cardNumber) {

    var newCard = document.createElement("img");
    newCard.setAttribute("src", "Card Images/" + (cardNumber + 1) + ".png");
    newCard.setAttribute("data-cardNumber", cardNumber);

    newCard.classList.add("bigger", "card");
    newCard.addEventListener('mousedown', dragStart);

    if (cardNumber < 6) {
      newCard.setAttribute("data-cardSuit", "clubs");
    }
    if (cardNumber < 12 && cardNumber >= 6) {
      newCard.setAttribute("data-cardSuit", "hearts");
    }
    if (cardNumber < 18 && cardNumber >= 12) {
      newCard.setAttribute("data-cardSuit", "spades");
    }
    if (cardNumber >= 18) {
      newCard.setAttribute("data-cardSuit", "diamonds");
    }


    if (cardNumber < 6) {
      newCard.setAttribute("data-cardRank", cardNumber + 1);
    }
    if (cardNumber < 12 && cardNumber >= 6) {
      newCard.setAttribute("data-cardRank", parseInt(cardNumber) - 5);
    }
    if (cardNumber < 18 && cardNumber >= 12) {
      newCard.setAttribute("data-cardRank", parseInt(cardNumber) - 11);
    }
    if (cardNumber >= 18) {
      newCard.setAttribute("data-cardRank", parseInt(cardNumber) - 17);
    }


    if (newCard.getAttribute("data-cardRank") == 4) {
      newCard.setAttribute("data-cardPoints", "4");
    } else if (newCard.getAttribute("data-cardRank") == 5) {
      newCard.setAttribute("data-cardPoints", "10");
    } else if (newCard.getAttribute("data-cardRank") == 6) {
      newCard.setAttribute("data-cardPoints", "11");
    } else if (newCard.getAttribute("data-cardRank") >= 7 && newCard.getAttribute("data-cardRank") <= 10) {
      newCard.setAttribute("data-cardPoints", "2");
    } else if (newCard.getAttribute("data-cardRank") >= 11 && newCard.getAttribute("data-cardRank") <= 14) {
      newCard.setAttribute("data-cardPoints", "3");
    } else {
      newCard.setAttribute("data-cardPoints", "0");
    }

    theDeck[cardNumber] = newCard;
  }

  // initialization code 
  function dealHands(numberOfHands) {
    numberOfHands = numberOfHands || 3;
    var theClasses = document.getElementsByClassName("hand");
    for (; numberOfHands--;) {
      hands.push({
        cards: sortHand(dealHand(), theClasses[numberOfHands])
      });
    }

  }

  function dealHand() {
    var theCards = [];
    for (i = 0; i < 10; i++) {
      theCards[i] = theDeck[deckDealPosition];
      Players['player' + cardOwner].cards[i] = theDeck[deckDealPosition];
      theCards[i].setAttribute("data-cardOwner", cardOwner);
      deckDealPosition++;

    }
    cardOwner++;
    if (cardOwner == 3) {
      for (i = 0; i <= 1; i++) {
        theBlind[i] = theDeck[deckDealPosition];
        theBlind[i].setAttribute("data-cardOwner", "theBlind");
        deckDealPosition++;

      }
    }
    return theCards;
  }

  function shuffle(theDeck) {
    var currentIndex = theDeck.length,
        temporaryValue, randomIndex;

    while (0 !== currentIndex) {

      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = theDeck[currentIndex];
      theDeck[currentIndex] = theDeck[randomIndex];
      theDeck[randomIndex] = temporaryValue;
    }

  }

  function sortHand(theHand, handElement) {

    theHand.sort(function (a, b) {

      return parseInt(a.getAttribute("data-cardnumber")) - parseInt(b.getAttribute("data-cardnumber"));
    });
    for (i = 0; i < theHand.length; i++) {
      theHand[i].style.order = i;
      handElement.appendChild(theHand[i]);
    }
    return theHand;
  }
  // This section contains all the functions for moving cards.

  function blindSelected() {
    document.getElementById("hand" + playerPicking).appendChild(theBlind[0]);
    document.getElementById("hand" + playerPicking).appendChild(theBlind[1]);
    Players['player' + playerPicking].cards[10] = theBlind[0];
    Players['player' + playerPicking].cards[11] = theBlind[1];
    console.log(Players['player' + playerPicking].cards);
    sortHand(Players['player' + playerPicking].cards, document.getElementById('hand' + playerPicking));

    for (i = 0; i < Players['player' + playerPicking].cards.length; i++) {
      Players['player' + playerPicking].cards[i].addEventListener("click", cardBuried);
    }
    document.getElementById("p" + (playerPicking)).innerHTML = "";
  }

  function cardBuried(event) {
    Players['player' + playerPicking].score = parseInt(Players['player' + playerPicking].score) + parseInt(event.target.getAttribute("data-cardPoints"));
    event.currentTarget.remove();
    document.getElementById("score").removeChild;
    document.getElementById("score").innerHTML = ("Player1: " + Players.player0.score + " Player2: " + Players.player1.score + " Player3: " + Players.player2.score);
    cardsBuried++;
    if (cardsBuried == 2) {
      for (i = 0; i < Players['player' + playerPicking].cards.length; i++) {
        Players['player' + playerPicking].cards[i].removeEventListener("click", cardBuried);
      }
    }
  }

  function blindRejected() {
    var buttons = document.getElementById("p" + (playerPicking));
    playerPicking++;
    var destination = document.getElementById("p" + (playerPicking));

    if ("p" + (playerPicking - 1) == "p2") {
      buttons.remove();
    }

    if ("p" + (playerPicking - 1) != "p2") {
      destination.innerHTML = buttons.innerHTML;
      buttons.innerHTML = "";
      var rejectBlind = document.getElementById('rejectBlind');
      rejectBlind.addEventListener("click", blindRejected);

      var blindTaken = document.getElementById('takeBlind');
      blindTaken.addEventListener("click", blindSelected);
    }

  }

  function dragStart(event) {
    dragging = true;

    event.preventDefault();
    activeCard = event.target;
    dragCard();
    render();
    document.addEventListener('mousemove', dragCard);
  }
  function dragCard() {
    document.addEventListener('onmouseup', dragEnd);
    x = event.clientX;
    y = event.clientY;

  }
  function dragEnd(event) {
    dragging = false;

    document.removeEventListener('onmouseup', dragEnd);
    priorSelectedCard = selectedCard;
    selectedCard = event.target;

    //      activeCard.style.transitionDuration = "0.5s";
    //      activeCard.classList.remove("bigger");
    //      topCard++;
    //      currentPlayer += 1;
    //      if (currentPlayer == 3) {
    //        currentPlayer = 0;
    //      }
    //      cardPlayed();
    //    } else {
    //      activeCard.style.position = "";
    //      activeCard.style.zIndex = "";
    //      activeCard.style.marginLeft = "";
    //
    //    }

    /*

    card can be placed if

      - card belongs to active player
      - blind pick is over
      - in play area

    */

    var cardBelongsToPlayer = parseInt(selectedCard.getAttribute("data-cardOwner")) == currentPlayer, // evalutates to true or false
        blindIsOver = cardsBuried >= 2,
        cardInPlayArea = event.clientX >= 730;

    if (cardBelongsToPlayer && blindIsOver && cardInPlayArea) {
      placeCard = true;
      
      activeCard.removeEventListener('mousedown', dragStart);

      topCard++;
      currentPlayer += 1;

      if (currentPlayer == 3) currentPlayer = 0;

      cardPlayed();
    }
    
    else {
      placeCard = false; 
    }

    document.removeEventListener('mousemove', dragCard);

  }

  function clickDestination(event) {

    if (event.target.tagName == "IMG") {
      dragEnd(event);
    }
  }

  function cardPlayed() {
    if (trick.firstCard === "") {
      trick.firstCard = activeCard;
      leader = parseInt(trick.firstCard.getAttribute("data-cardOwner"));
      activeCard = "";
      return;
    } else if (trick.secondCard === "") {
      trick.secondCard = activeCard;
      activeCard = "";
      return;
    } else if (trick.thirdCard === "") {
      trick.thirdCard = activeCard;
      activeCard = "";
    }
    
    trick.points = (parseInt(trick.firstCard.getAttribute("data-cardPoints")) + parseInt(trick.secondCard.getAttribute("data-cardPoints")) + parseInt(trick.thirdCard.getAttribute("data-cardPoints")));
    determineWinner();

  }

  function determineWinner() {
    var firstSuit = trick.firstCard.getAttribute("data-cardSuit");
    var secondSuit = trick.secondCard.getAttribute("data-cardSuit");
    var thirdSuit = trick.thirdCard.getAttribute("data-cardSuit");

    var firstRank = trick.firstCard.getAttribute("data-cardRank");
    var secondRank = trick.secondCard.getAttribute("data-cardRank");
    var thirdRank = trick.thirdCard.getAttribute("data-cardRank");

    var initialWinner;
    var finalWinner;

    if (firstSuit == secondSuit) {
      if (parseInt(firstRank) - parseInt(secondRank) > 0) {
        initialWinner = trick.firstCard;
      } else
        initialWinner = trick.secondCard;
    }

    if (firstSuit != secondSuit) {

      if (firstSuit == "diamonds") {
        initialWinner = trick.firstCard;
      }
      if (secondSuit == "diamonds") {
        initialWinner = trick.secondCard;
      } else
        initialWinner = trick.firstCard;
    }




    if (initialWinner.getAttribute("data-cardSuit") == thirdSuit) {
      if (parseInt(initialWinner.getAttribute("data-cardRank")) - parseInt(thirdRank) > 0) {
        finalWinner = initialWinner;
      } else
        finalWinner = trick.thirdCard;
    }

    if (initialWinner.getAttribute("data-cardSuit") != thirdSuit) {

      if (initialWinner.getAttribute("data-cardSuit") == "diamonds") {
        finalWinner = initialWinner;
      }
      if (thirdSuit == "diamonds") {
        finalWinner = trick.thirdCard;
      } else
        finalWinner = initialWinner;
    }

    Players['player' + finalWinner.getAttribute("data-cardOwner")].score = Players['player' + finalWinner.getAttribute("data-cardOwner")].score + trick.points;

    currentPlayer = parseInt(finalWinner.getAttribute("data-cardOwner"));
    trick.firstCard.remove();
    trick.firstCard = "";
    trick.secondCard.remove();
    trick.secondCard = "";
    trick.thirdCard.remove();
    trick.thirdCard = "";

    document.getElementById("score").removeChild;
    document.getElementById("score").innerHTML = ("Player1: " + Players.player0.score + " Player2: " + Players.player1.score + " Player3: " + Players.player2.score);

  }


  function render() {

    var cardOwner = parseInt(activeCard.getAttribute("data-cardOwner"));

    // check data, use that data to change DOM
    if (activeCard != "") {
      activeCard.style.position = "absolute";
      activeCard.style.transitionDuration = "0s";
      activeCard.style.marginLeft = "0";
      activeCard.style.top = y - 60 + 'px'; //Use these lines to move the cards fluidly
      activeCard.style.left = x - 80 + 'px';
      activeCard.style.zIndex = topCard;
    }
    
    // deals with placement of cards in playarea
    if ( !dragging ) {
      if ( placeCard ) {
        //      activeCard.style.transitionDuration = "0.5s";
        activeCard.classList.remove("bigger");
      } 

      else if ( !placeCard ) {
        activeCard.style.position = "";
        activeCard.style.zIndex = "";
        activeCard.style.marginLeft = "";
      }
    }

    requestAnimationFrame(render);
  }

  function logic() {
    // check data, set data based on that data


    //    setInterval(logic, (1000 / 60));
  }
  //      // the rest of the module

}()); // nothing should be past this line