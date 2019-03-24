     
// VARIABLES
// ==========================================================================

// The array of phrases for the Word Guess Game.
var PhraseArray = [
{ phrase: "THEORY OF A DEADMAN", category: "Band" },
{ phrase: "CHICKEN OF THE SEA", category: "Sea Creature" },
{ phrase: "COMPUTER SCREEN", category: "Thing" },
{ phrase: "CAR WASH CLOTH", category: "Before-and-After" },
{ phrase: "ET PHONE HOME", category: "Movie Quote" },
{ phrase: "HAPPY HALLOWEEN", category: "Holiday" },
{ phrase: "MIKE AND THE MECHANICS", category: "Band" },
{ phrase: "TAZMANIAN DEVIL", category: "Animal" },
{ phrase: "KITCHEN TABLE", category: "Thing" },
{ phrase: "LAMP SHADE TREE", category: "Before-and-After" },
{ phrase: "YOU HAD ME AT HELLO", category: "Movie Quote" },
{ phrase: "SUMMER SOLSTICE", category: "Holiday" }
];

//   Global Variable Declarations   
var WinScore = 0;         // Variable (num) to hold current number of wins
var PhraseIndex = 0;      // Variable (num) to hold the index of the current Word Guess.
var LetterIndex = 0;      // Variable (num) of the letter index as it goes through the phrase string
var CurrentPhrase = "";   // Variable (string) to hold current phrase 
var CurrentGuess = "";    // Variable (string) to hold the current phrase guess
var GuessCount = 0;       // Variable (num) Letter Guess Count
var MaxGuessCount = 8;    // Maximum number of guesses per phrase 
var UsedLettersList = ""; // Variable (string) String of used letters 
var PlayAgain = false;    // Variable (boolean) user input key to play again
var GameOver = false;     // Variable (boolean) Flag if game is over
var DebugOn = false;      // Variable (boolean) Flag to turn on debug msgs to console.log
var sorrySound;           // Variable (function) sound if too many guesse
var tadaSound;            // Variable (function) sound when phrase is guessed correctly
var oopsSound;            // Variable (function) sound if letter already guessed
var plinkSound;           // Variable (function) sound if an invalid key is pressed


// FUNCTIONS
// ==============================================================================

// function to initialize a sound object and connect it to its "src" mp3 file
function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
      this.sound.play();
  }
  this.stop = function(){
      this.sound.pause();
  }    
}

// Function to update the display score.
function DisplayScore() {
  document.querySelector("#NumWins").innerHTML = "Number of Wins: " + WinScore;
}

// Function to update the display current guess count.
function DisplayGuessCount() {
  document.querySelector("#GuessCount").innerHTML = "Guesses Remaining: " + (MaxGuessCount-GuessCount) + " of " + MaxGuessCount;
}

// Function to update the display the current guessed phrase with each letter separated by a space
function DisplayCurrentGuess() {
  var TempStr = "";
  
  for (var i = 0; i < CurrentGuess.length; i++) {
    switch(CurrentGuess.charAt(i)) {
       case "_": 
          TempStr += "_ ";
          break;
       case " ": 
          TempStr += " * ";
          break;
       default:
          TempStr += CurrentGuess.charAt(i);
    }
  }
  document.querySelector("#CurGuessPhrase").innerHTML = TempStr;
}

// Function to update the display the used letter list ...
function DisplayUsedLetterList() {
  document.querySelector("#UsedLetters").innerHTML = "Used Letters: " + UsedLettersList;
}

// Function to update the display alert.
function DisplayAlertMessage(AlertMsg) {
  document.querySelector("#AlertMsg").innerHTML = AlertMsg;
}

// Function to update the display at the input LineTag with the input Message 
function DisplayLine(LineTag, Message) {
  document.querySelector(LineTag).innerHTML = Message;
}

// Function to convert the current phrase in to the current guess display 
function InitGuessPhrase (CurPhrase) {
  var TempStr = "";
if (DebugOn) console.log ("in InitGuessPhrase  passed phrase is: " + CurPhrase);
  for (var i = 0; i < CurPhrase.length; i++) {
      if (CurPhrase.charAt(i) === " ") {
           TempStr += CurPhrase.charAt(i);
      }
      else {
         TempStr += "_";
      }
    }
if (DebugOn) console.log ("end InitGuessPhrase  returned phrase is: " + TempStr);
  return TempStr;
}

// Function to get the first phrase and reset the applicable counters.
function GetFirstPhrase() {
  PhraseIndex = 0;
  GuessCount = 0;
  UsedLettersList = "";
  CurrentGuess = InitGuessPhrase(PhraseArray[PhraseIndex].phrase);
  DisplayLine("#CurCategory", "Category: " + PhraseArray[PhraseIndex].category);
  DisplayCurrentGuess();
  DisplayUsedLetterList();
  return  PhraseArray[PhraseIndex].phrase;
}

// Function to get the next phrase and reset the applicable counters.
function GetNextPhrase() {
  PhraseIndex++;
  // If there are still more phrases, get the next one.
  if (PhraseIndex < PhraseArray.length) {
    GuessCount = 0;
    UsedLettersList = "";
    CurrentGuess = InitGuessPhrase (PhraseArray[PhraseIndex].phrase);
    DisplayLine("#CurCategory", "Category: " + PhraseArray[PhraseIndex].category);
    DisplayCurrentGuess();
    DisplayUsedLetterList();
    return  PhraseArray[PhraseIndex].phrase;
  }
  // Exception Handler - Game over. There are no more phrases to guess in the array
  else {
    GameOver = true;
    return;
  }
}

// Funtion to check if the input letter has been guessed yet.  It returns true if the
// letter has already been used. If the letter has not been used, the letter is 
// added to the used letter list
function CheckLetterUsed(userInput) {
    for (var i=0; i < UsedLettersList.length; i++) {
        if (userInput === UsedLettersList.charAt(i)) {
            // letter has already been guessed
            return (true);
        } 
    }
    // Letter has not been guessed. Add the letter to the used letter list
    UsedLettersList += userInput;
    return (false);
}

// Function to check if the input letter is in the current phrase.  The entire phrase
// must be checked in case there is more than one of that particular letter
function LetterInPhrase(userInput) {
    var IsFound = false;
    var TempStr = "";
    for (var i=0; i < CurrentPhrase.length; i++) {
if (DebugOn) console.log ("In func LetterInPhrase Letter " + CurrentPhrase.charAt(i) + " at " + i);
        if (userInput === CurrentPhrase.charAt(i)) {
           TempStr += userInput;
           IsFound = true;
if (DebugOn) console.log ("In func LetterInPhrase Letter " + CurrentPhrase.charAt(i) + "FOUND at " + i);
        } 
        else {
           TempStr += CurrentGuess.charAt(i);
        }
    }        
    CurrentGuess = TempStr;
    return (IsFound);
}

// function to make sure that only a single character key is input by the user
// [Shift] [Ctrl] [Esc] etc come in as strings: "SHIFT" "CONTROL" and "ESCAPE" 
// from event.key
function GetCleanInput(InputKey) {
   
   // Check that the input key is just one character. Other keys like SHIFT, ESC, CTRL are
   // not valid.
   if (InputKey.length === 1) {
     return (InputKey.toUpperCase());
   }
   else {
     return (""); 
   }
}

// function to refresh the screen "all at once"
function RefreshScreen(){
  DisplayScore();
  DisplayLine("#CurCategory", "Category: " + PhraseArray[PhraseIndex].category);
  DisplayCurrentGuess();
  DisplayGuessCount(); 
  DisplayUsedLetterList();
  DisplayAlertMessage(" ");
}

// Function that is called when the game is over to update the screen "all-at-once"
function DisplayGameOver () {
  DisplayLine("#NumWins", "Final Score: " + WinScore + " of " + PhraseArray.length);
  DisplayLine("#CurCategory", " ");
  DisplayLine("#CurGuessPhrase", "Game Over");
  DisplayLine("#GuessCount", " ");
  DisplayLine("#UsedLetters", " ");
  DisplayLine("#AlertMsg", "Thanks for playing!!");
}

// Function for debugging - sends a variable "dump" to console.log 
function DebugLog (LocationTag) {
    console.log ("*************************************")
    console.log ("Program location " + LocationTag);
    console.log ("Phrase Array length     " + PhraseArray.length);
    console.log ("Current Phrase (string) " + CurrentPhrase);
    console.log ("Current Phrase in array " + PhraseArray[PhraseIndex].phrase);
    console.log ("Current Guess (string)  " + CurrentGuess);
    console.log ("Win Score (number)      " + WinScore);
    console.log ("Guess Count (number)    " + GuessCount);
    console.log ("Letter Index (number)   " + LetterIndex);
    console.log ("Phrase Index (number)   " + PhraseIndex);
    console.log ("UsedLetterList (str)    " + UsedLettersList);      
}

// MAIN PROCESS
// ==============================================================================

// Initialize the sounds used in the game 
sorrySound = new sound("assets/sounds/Sorry.mp3");
tadaSound = new sound("assets/sounds/TaDa.mp3");
oopsSound = new sound("assets/sounds/uhoh.mp3");
plinkSound = new sound("assets/sounds/Plink.mp3");

// Initialize the screen to start the game.
CurrentPhrase = GetFirstPhrase();  // get the first phrase in the array
RefreshScreen();
DisplayAlertMessage ("Press a key to guess your first letter");

// When the user presses a key, it will run the following function
document.onkeyup = function(event) {
    DisplayAlertMessage ("");  // clear the alert message line

    // Get the keypressed and make sure it is valid 
    var KeyPressed = event.key;
    var userInput = GetCleanInput (KeyPressed);

//  var asciiVal = userInput.charCodeAt();

    // check if it is a Play Again query and disgard the input key
    if (PlayAgain === true) {
      CurrentPhrase = GetNextPhrase();  // get the current phrase
      if (GameOver === false) {
         DisplayScore();
         DisplayGuessCount(); 
         DisplayUsedLetterList();
         DisplayCurrentGuess();
         PlayAgain = false;
      }
      else { // Game over.  Display final screen 
         DisplayGameOver();
      }
      return;
    }

    // User input must be a letter between A and Z (ASCII 65 and 90)
    if (userInput.charCodeAt() >= 65 && userInput.charCodeAt() <= 90) {

        // Check if the userInput key has already been used
        if (CheckLetterUsed(userInput) === false) {
           // Letter has not been guessed
            DisplayUsedLetterList();
            DisplayGuessCount();

            // Check if the userInput key is in the phrase 
            if (LetterInPhrase(userInput) === true) {
                DisplayCurrentGuess();
                
                // Check if entire phrase has been completely solved then the player wins
                if (CurrentPhrase === CurrentGuess)  {
                    // Increment the WinScore and get the next phrase.
                    WinScore++;        
                    DisplayScore();
                    DisplayAlertMessage ("You Win!! Press any key to play again.");
                    tadaSound.play();
                    PlayAgain = true;
                }
            }
            else {  // userInput not in phrase: increment guess count and update used letter list
              GuessCount++;
              DisplayGuessCount();
              DisplayUsedLetterList();
            }
if (DebugOn) DebugLog("userInput is: " + userInput);
            
            // Check for max number of Guesses
            if (GuessCount === MaxGuessCount) {
               DisplayGuessCount();
               CurrentGuess = CurrentPhrase;
               DisplayCurrentGuess();
               DisplayUsedLetterList();
               DisplayAlertMessage ("Oh no! No more guesses. Press any key to play again.");
               sorrySound.play();
               PlayAgain = true;
            }
        }
        else {  // userInput key used previously. 
            DisplayAlertMessage ("You already used that letter");
            oopsSound.play();
        }
    }  // if asciiVal A to Z
    else {  //  The User Input is invalid 
      DisplayAlertMessage ("Invalid key pressed: " + KeyPressed);
      plinkSound.play();
    }
if (DebugOn) console.log("end of function onkeyup");
}  // onkeyup
if (DebugOn) console.log("outside function onkeyup");