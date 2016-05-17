// TODO - append audio to individual flashcard, not file
// TODO - remove temporary stubbings
// TODO - remove flashcare text from html
// TODO - forvo attribution is required
// TODO - add google virtual keyboard for foreign languages

// Temporary Stubbing
const CURRENT_KNOWN_LANGUAGE    = 'en';
const CURRENT_LEARNING_LANGUAGE = 'sv';

const CURRENT_DECK = {
  "flashcards": [
    {"en": "ice cream", "sv": "glass"},
    {"en": "candy", "sv": "godis"},
    {"en": "cake", "sv": "kaka"},
    {"en": "chocolate", "sv": "choklad"},
    {"en": "vanilla", "sv": "vanilj"}
  ]
}

var current_flashcard_location_in_current_deck = 0;
function iterateNextFlashcard () {
  current_flashcard_location_in_current_deck += 1;
}

function CURRENT_KNOWN_WORD () {
  return CURRENT_DECK["flashcards"][current_flashcard_location_in_current_deck][CURRENT_KNOWN_LANGUAGE];
}

function CURRENT_LEARNING_WORD () {
  return CURRENT_DECK["flashcards"][current_flashcard_location_in_current_deck][CURRENT_LEARNING_LANGUAGE];
}







// SETTINGS //////////////////////////////////////
//////////////////////////////////////////////////
// Flexible Design

// Flashcard Word Image
  // Position
const FLASHCARD_IMAGE_CONTAINER_PERCENT_FROM_TOP = 0.23;
const FLASHCARD_IMAGE_CONTAINER_PERCENT_FROM_LEFT = 0.02;
  // Size
const FLASHCARD_IMAGE_CONTAINER_PERCENT_HEIGHT_OF_FLASHCARD = 0.52;
const FLASHCARD_IMAGE_CONTAINER_PERCENT_WIDTH_OF_FLASHCARD  = 0.32;
// Flashcard Audio Image
const FLASHCARD_SOUND_IMAGE_HEIGHT_RATIO_TO_CONTAINER = 0.2;
const FLASHCARD_SOUND_IMAGE_WIDTH_RATIO_TO_CONTAINER  = 0.13;

// DIV Elements
const FLASHCARD = $('#flashcard');
const FLASHCARD_CONTAINER = $('.flashcard-container');

const KNOWN_WORD_TEXT = $("#known-word");
const LEARNING_WORD_TEXT = $("#learning-word");

const SOUND_IMAGE_IN_FLASHCARD = $('.flashcard-container .flashcard-audio-image');
const pronunciationAudio = $("#pronunciation");

const USER_ANSWER_FORM = $('#answer-form');

const IMAGE_OF_WORD_CONTAINER = $('.learning-word-image-container');
const IMAGE_OF_WORD = $('.learning-word-image');

const NEXT_FLASHCARD_BUTTON = $('#next-flashcard-button');


// APIs
const FORVO_API_URL = "http://apifree.forvo.com/key/78dfafefc36008fe27a6a3a73c340f81/format/json/action/standard-pronunciation/word/";
const MICROSOFT_IMAGE_SEARCH_API_URL = "https://bingapis.azure-api.net/api/v5/images/search?q=";
//////////////////////////////////////////////////
//////////////////////////////////////////////////


// learning language

// known word
// learning word
var vocabPracticeSession = {
  current_known_word: null,
  current_learning_word: null,

  wordList: {
      "en": "ice cream",
      "sv": "glass"
  },
  test: ""
}



function setNewCard() {
  KNOWN_WORD_TEXT.text(CURRENT_KNOWN_WORD());
  LEARNING_WORD_TEXT.text(CURRENT_LEARNING_WORD());

  setVocabImage(CURRENT_KNOWN_WORD());


  USER_ANSWER_FORM.submit(function(event) {
    USER_ANSWER_FORM.off();
    checkWord(event, CURRENT_LEARNING_WORD());
  })

  NEXT_FLASHCARD_BUTTON.click(function() {
    NEXT_FLASHCARD_BUTTON.off();
    iterateNextFlashcard();
    FLASHCARD.toggleClass('clicked');
    setNewCard();
  });
}



function checkWord(event, word) {
  event.preventDefault();
  FLASHCARD.toggleClass('clicked');

  setPronunctiationAudio(word);
  SOUND_IMAGE_IN_FLASHCARD.click(function() {
    SOUND_IMAGE_IN_FLASHCARD.off();
    $("#pronunciation").get(0).play();
  });

}

























// DOM Manipulation //////////////////////////////
//////////////////////////////////////////////////
$(document).ready( function() {

  setNewCard();

  // Sizing
  fitsoundImageInFlashcard();
  sizeFlashcardContainer();

});

//////////////////////////////////////////////////
//////////////////////////////////////////////////











// DOM Sizing ////////////////////////////////////
//////////////////////////////////////////////////

function fitsoundImageInFlashcard () {
  var containerHeight  = FLASHCARD_CONTAINER.height(),
      containerWidth   = FLASHCARD_CONTAINER.width();

  var soundImageHeight = containerHeight * FLASHCARD_SOUND_IMAGE_HEIGHT_RATIO_TO_CONTAINER,
      soundImageWidth = containerWidth * FLASHCARD_SOUND_IMAGE_WIDTH_RATIO_TO_CONTAINER;

  SOUND_IMAGE_IN_FLASHCARD.css({
    'min-height': soundImageHeight,
    'max-height': soundImageHeight,
    'min-width': soundImageWidth,
    'max-width': soundImageWidth,

  });
}
function sizeFlashcardContainer() {
  var imageContainers               = IMAGE_OF_WORD_CONTAINER,
      flashcard                   = $(".front-of-flashcard"),

      flashcardHeight = flashcard.height(),
      flashcardWidth  = flashcard.width(),

      imageContainerHeightToFlashcard = FLASHCARD_IMAGE_CONTAINER_PERCENT_HEIGHT_OF_FLASHCARD,
      imageContainerWidthToFlashcard = FLASHCARD_IMAGE_CONTAINER_PERCENT_WIDTH_OF_FLASHCARD,

      imageContainerHeight = flashcardHeight * imageContainerHeightToFlashcard,
      imageContainerWidth  = flashcardWidth * imageContainerWidthToFlashcard,

      imageContainerTop         = flashcardHeight * FLASHCARD_IMAGE_CONTAINER_PERCENT_FROM_TOP,
      imageContainerLeft          = flashcardWidth * FLASHCARD_IMAGE_CONTAINER_PERCENT_FROM_LEFT;

      IMAGE_OF_WORD_CONTAINER.css({
          height:       imageContainerHeight,
          'min-height': imageContainerHeight,
          'max-height': imageContainerHeight,
          width:        imageContainerWidth,
          'min-width':  imageContainerWidth,
          'max-width':  imageContainerWidth,
          top:          imageContainerTop,
          left:         imageContainerLeft
        });
}





function sizeImageWithinContainer(imageElement) {
  var image             = $(imageElement),
      container         = image.parent(),
      containerHeight   = container.height(),
      containerWidth    = container.width(),
      imageStartHeight  = image.height(),
      imageStartWidth   = image.width(),
      isTooTallNotTooFat,
      shrinkMultiplier,
      imagePixelsFromLeft,
      imagePixelsFromTop,
      imageEndWidth,
      imageEndHeight;

  (containerHeight / imageStartHeight) < (containerWidth / imageStartWidth) ? isTooTallNotTooFat = true : isTooTallNotTooFat = false;

  if (isTooTallNotTooFat) {
    shrinkMultiplier = containerHeight / imageStartHeight;
    imageEndWidth = shrinkMultiplier * imageStartWidth;
    imageEndHeight = shrinkMultiplier * imageStartHeight;
    imagePixelsFromLeft = (containerWidth - imageEndWidth) / 2;
    imagePixelsFromTop = 0;
  } else {
    shrinkMultiplier = containerWidth / imageStartWidth;
    imageEndWidth = shrinkMultiplier * imageStartWidth;
    imageEndHeight = shrinkMultiplier * imageStartHeight;
    imagePixelsFromLeft = 0;
    imagePixelsFromTop = (containerHeight - imageEndHeight) / 2;
  }

  image.width(imageEndWidth);
  image.height(imageEndHeight);

  image.css({
    position: 'relative',
    left: imagePixelsFromLeft + 'px',
    top: imagePixelsFromTop + 'px',
  });

}


//////////////////////////////////////////////////
//////////////////////////////////////////////////





















// Get Forvo Audio  //////////////////////////////
//////////////////////////////////////////////////
function setPronunctiationAudio (wordToPronounce) {
  var word = wordToPronounce;
  var url = constructForvoAudioRequest(word, CURRENT_LEARNING_LANGUAGE);
  ajaxCallToForvo(word, url);
};

function ajaxCallToForvo(word, url) {
  $.ajax({
      url: url,
      jsonpCallback: "pronounce",
      dataType: "jsonp",
      type: "jsonp",
      success: function (json) {
        ajaxCallToForvo_Success(json);
      },
      error: function(){
        ajaxCallToForvo_Failure();
      }}
  );
}

function ajaxCallToForvo_Success(json) {
  var mp3 = json.items[0].pathmp3;
  var ogg = json.items[0].pathogg;
  $("#pronunciation").attr({
      'src': mp3,
      'volume': 1,
      'autoplay': 'autoplay'
  });

}

function ajaxCallToForvo_Failure() {
  console.log("error");
}



function constructForvoAudioRequest (wordToPronounce, pronunciationLanguage) {
  var word = encodeURI(wordToPronounce);
  var url = FORVO_API_URL;
  url += word
  url += '/language/';
  url += pronunciationLanguage;
  return url;
};

//////////////////////////////////////////////////
//////////////////////////////////////////////////




















// Get Microsoft Image ////////////////////////////
//////////////////////////////////////////////////
function setVocabImage(word) {
  var word = word;
  var url  = constructMicrosoftImageRequest(word);
  ajaxCallToMicrosoft(url);
}

function ajaxCallToMicrosoft(url) {
  $.ajax({
    method: 'post',
    url: url,
    //Set headers to authorize search with Bing
    headers: {
      'Ocp-Apim-Subscription-Key': '3f18bb3665cf422295ec02530ac4b082'
    },
    success: function(data) {
      ajaxCallToMicrosoft_sucess(data);
      IMAGE_OF_WORD.on('load', function() {
        IMAGE_OF_WORD.off();
        ajaxCallToMicrosoft_then();
      });
    },
    failure: function(err) {
      ajaxCallToMicrosoft_failure(err);
    }
  });
}

function ajaxCallToMicrosoft_sucess(data) {
  var source = data["value"][0]["contentUrl"];
  IMAGE_OF_WORD.attr({
    'src': source
  });
}

function ajaxCallToMicrosoft_failure(err) {
  console.error(err);
}

function ajaxCallToMicrosoft_then() {
  sizeImageWithinContainer(IMAGE_OF_WORD);

}


function constructMicrosoftImageRequest(wordToLearn) {
  var word = encodeURI(wordToLearn);
  var url = MICROSOFT_IMAGE_SEARCH_API_URL;
  url += word;
  url += "&count=1";
  // fill in the next line to change the market to local for language of interest
  // url += "&mkt=___________________________________________________________";

  return url;
}
//////////////////////////////////////////////////
//////////////////////////////////////////////////
