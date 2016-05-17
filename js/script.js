// TODO - append audio to individual flashcard, not file
// TODO - remove temporary stubbings
// TODO - remove flashcare text from html
// TODO - forvo attribution is required

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


var CURRENT_KNOWN_WORD        = CURRENT_DECK["flashcards"][current_flashcard_location_in_current_deck][CURRENT_KNOWN_LANGUAGE];
var CURRENT_LEARNING_WORD     = CURRENT_DECK["flashcards"][current_flashcard_location_in_current_deck][CURRENT_LEARNING_LANGUAGE];






// SETTINGS //////////////////////////////////////
//////////////////////////////////////////////////
// Flexible Design

// Flashcard Audio Image
const FLASHCARD_SOUND_IMAGE_HEIGHT_RATIO_TO_CONTAINER = 0.2;
const FLASHCARD_SOUND_IMAGE_WIDTH_RATIO_TO_CONTAINER  = 0.13;

// DIV Elements
const FLASHCARD_CONTAINER = $('.flashcard-container');
const SOUND_IMAGE_IN_FLASHCARD = $('.flashcard-container .flashcard-audio-image');
const pronunciationAudio = $("#pronunciation");

// APIs
const FORVO_API_URL = "http://apifree.forvo.com/key/78dfafefc36008fe27a6a3a73c340f81/format/json/action/standard-pronunciation/word/";
const MICROSOFT_IMAGE_SEARCH_API_URL = "https://bingapis.azure-api.net/api/v5/images/search?q=";
//////////////////////////////////////////////////
//////////////////////////////////////////////////












function setVocabImage() {
  var word = CURRENT_KNOWN_WORD;
  var url  = constructMicrosoftImageRequest(word);

  $.ajax({
    method: 'post',
    url: url,
    //Set headers to authorize search with Bing
    headers: {
      'Ocp-Apim-Subscription-Key': '3f18bb3665cf422295ec02530ac4b082'
    },
    success: function(data) {
      //Insert random image in dom
      // var randomIndex = Math.floor(Math.random() * 50);
      // var imgLink = '<img width="500px" src="' + data.d.results[0].Image[randomIndex].MediaUrl + '" />';
      console.log(data["value"][0]["contentUrl"]);
    },
    failure: function(err) {
      console.error(err);
    }
  });


function constructMicrosoftImageRequest(word) {
  var word = encodeURI(wordToLearn);
  var url = MICROSOFT_IMAGE_SEARCH_API_URL;
  url += word;
  url += "&count=1";
  // fill in the next line to change the market to local for language of interest
  // url += "&mkt=___________________________________________________________";

  return url;
}








}










// DOM Manipulation //////////////////////////////
//////////////////////////////////////////////////
$(document).ready( function() {
  // Sizing
  fitsoundImageInFlashcard();

  SOUND_IMAGE_IN_FLASHCARD.click(setPronunctiationAudio);
  setVocabImage();

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

//////////////////////////////////////////////////
//////////////////////////////////////////////////











// Get Forvo Audio  //////////////////////////////
//////////////////////////////////////////////////
function setPronunctiationAudio () {
  var word = CURRENT_LEARNING_WORD;
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
  $("<audio></audio>").attr({
      'src': mp3,
      'volume': 1,
      'autoplay': 'autoplay'
  }).appendTo("body");

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
