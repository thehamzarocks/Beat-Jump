"use strict";

var Alexa = require("alexa-sdk");

var handlers = {

  'LaunchRequest': function() {

    //for first-time users, we need to do a quick setup
    if(Object.keys(this.attributes).length === 0 || this.attributes['setupdirection']!="complete") {
      this.attributes['rightspace'] = 0;
      this.attributes['frontspace'] = 0;
      this.attributes['setupdirection'] = "right";
      this.attributes['difficulty'] = 'medium';


      this.response.speak("Welcome to Beat Jump! Just follow my directions to dance! But first, I need to know how much space you have. Find some space and stand in the centre. Let me know when you're done.")
                          .listen("Find some space and stand in the centre. Tell me when you're done.");
      this.emit(':responseReady');
    }
    else {
      this.response.speak("Welcome back to Beat Jump! Would you like to start dancing, or do something else?").listen("Tell me whether you want to dance or do something else.");
      this.emit(':responseReady');
      //this.emit(':tell', '<prosody rate="150%">Hello</prosody><prosody rate="150%"> there</prosody>');
    }
  },

  'SomethingElseIntent': function() {
    this.response.speak("Beat Jump is a fun way to dance with Alexa. You can choose to dance to my directions, change the difficulty of the dance, or set up your dancing space. Let me know if you need any help.")
      .listen("Beat Jump is a fun way to dance with Alexa. You can choose to dance to my directions, change the difficulty of the dance, or set up your dancing space. Let me know if you need help.");
      this.emit(':responseReady');
  },

  'SetupIntent': function() {
    if(this.attributes['setupdirection'] != "complete") {
      this.attributes['setupdirection'] = "right";
      this.response.speak("Great! I'm going to keep saying right, and every time you have space to jump to the right, do so, and say jumped. " +
                            "If you don't have enough space, say over. Right").listen("I'm going to keep saying right, and every time you have space to jump to the right, do so, and say jumped. " +
                            "If you don't have enough space, say over. Right");
      this.emit(':responseReady');
    }
  },

  'SetupRepeatIntent': function() {
    if(this.attributes['setupdirection'] == "right") {
      this.attributes['rightspace']++;
      this.response.speak("Right").listen("I'm going to keep saying right, and every time you have space to jump to the right, do so, and say jumped. " +
                            "If you don't have enough space, say over. Right");
      this.emit(':responseReady');
    }
    else if(this.attributes['setupdirection'] == "forward") {
      this.attributes['frontspace']++;
      this.response.speak("Forward").listen("I'm going to keep saying forward, and every time you have space to jump forward, do so, and say jumped. " +
                            "If you don't have enough space, say over. Forward");
      this.emit(':responseReady');
    }

  },

  'SetupRepeatOverIntent': function() {
    if(this.attributes['setupdirection'] == "right") {
      if(this.attributes['rightspace'] == 0) {
        this.attributes['setupdirection'] = "right";
        this.response.speak("You cant dance if you don't have enough space. Make sure you have enough space, stand in the centre, and let me know when you're done")
            .listen("Find some space, stand in the centre, and let me know when you're done.");
        this.emit(':responseReady');
      }
      else {
        this.response.speak("Okay! Looks like you can jump " + this.attributes['rightspace'] + " times to the right. Now let's see how much space you have in front of you. " +
                              "Keep jumping forward and say jumped every time I say forward. If you don't have any more space, say over. Forward").listen("I'm going to keep saying forward, and every time you have space to jump forward, do so, and say jumped. " +
                              "If you don't have enough space, say over. Forward");
        this.attributes['setupdirection'] = "forward";
        this.emit(':responseReady');
      }
    }

    else if(this.attributes['setupdirection'] == "forward") {
      if(this.attributes['frontspace'] == 0) {
        this.attributes['setupdirection'] = "right";
        this.attributes['rightspace'] = 0;
        this.response.speak("You cant dance if you don't have enough space. Make sure you have enough space, stand in the centre, and let me know when you're done")
            .listen("Find some space, stand in the centre, and let me know when you're done.");
        this.emit(':responseReady');
      }
      else {
        this.response.speak("Okay! Looks like you can jump " + this.attributes['rightspace'] + " times to the right and " + this.attributes['frontspace'] +
                              " times forward. You're now ready to start dancing. Would you like to dance or do something else?").listen("Would you like to dance or do something else?");
        this.attributes['setupdirection'] = "complete";
        this.emit(':responseReady');
      }
    }

  },

  'CustomiseIntent': function() {
    this.response.speak("Okay! Would you like to set up your dancing space, or change the difficulty?").listen("Would you like to set up your dancing space or change the difficulty?");
    this.emit(':responseReady');
  },

  'CustomiseSpaceIntent': function() {
    this.attributes['rightspace'] = 0;
    this.attributes['frontspace'] = 0;
    this.attributes['setupdirection'] = "right";

    this.response.speak("Let's get you set up. Find some space and stand in the centre. let me know when you're done.")
                          .listen("Find some space and stand in the centre. Let me know when you're done.");
      this.emit(':responseReady');

  },

  'CustomiseDifficultyIntent': function() {
    this.response.speak("Your current difficulty is " + this.attributes['difficulty'] + ". Would you like to make it super easy, easy, medium, hard, or extra hard?")
    .listen("Your current difficulty is " + this.attributes['difficulty'] + ". Would you like to make it super easy, easy, medium, hard, or extra hard?");
    this.emit(':responseReady');
  },

  'SetDifficultyIntent': function() {
    this.attributes['difficulty'] = (this.event.request.intent.slots.difficulty.value).toLowerCase();
    this.response.speak("Your difficulty has been set to " + this.attributes['difficulty'] + ". Would you like to dance now, or do something else?")
    .listen("Your difficulty has been set to " + this.attributes['difficulty'] + ". Would you like to dance now, or do something else?");
    this.emit(':responseReady');
  },

  'RandomBeatIntent': function() {

    if(this.attributes['setupdirection'] != "complete") {
      this.attributes['rightspace'] = 0;
      this.attributes['frontspace'] = 0;
      this.attributes['setupdirection'] = "right";

      this.response.speak("You cant dance if you don't have enough space. Make sure you have enough space, stand in the centre, and let me know when you're done")
            .listen("Find some space, stand in the centre, and let me know when you're done.");
        this.emit(':responseReady');
    }

    var beatlist = "";

    if(this.attributes['difficulty'] == "super easy") {
      beatlist = SuperEasyBeatlist(this.attributes['rightspace'], this.attributes['frontspace']);
    }
    else if(this.attributes['difficulty'] == "easy") {
      beatlist = EasyBeatlist(this.attributes['rightspace'], this.attributes['frontspace']);
    }
    else if(this.attributes['difficulty'] == "medium") {
      beatlist = MediumBeatlist(this.attributes['rightspace'], this.attributes['frontspace']);
    }
    else if(this.attributes['difficulty'] == "hard") {
      beatlist = HardBeatlist(this.attributes['rightspace'], this.attributes['frontspace']);
    }
    else if(this.attributes['difficulty'] == "extra hard") {
      beatlist = ExtraHardBeatlist(this.attributes['rightspace'], this.attributes['frontspace']);
    }

    //this.response.speak("In 3 2 1 go! " + beatlist);
    //this.emit(':responseReady');
    //this.respose.speak('<prosody rate="x-fast">' +  beatlist + '</prosody> Would you like to continue dancing?').listen("Would you like to continue dancing or set up?");
    //this.emit(':ask', '<prosody rate="x-fast">' +  beatlist + '</prosody> Would you like to continue dancing or get set up instead?', 'Would you like to continue dancing or get set up instead?');
    this.emit(':ask', beatlist + ". That was fun! Would you like to continue dancing, or change the difficulty?",
                  "Would you like to continue dancing, or change the difficulty?");
  },

  // Help
  'AMAZON.HelpIntent': function() {
      this.response.speak("Dancing with Beat Jump is easy. All you have to do is jump in the direction I tell you to. Sometimes, you may be asked to throw your hands up in the air, twirl around 360 degrees, or do a quick handstand. You can always change the dance difficulty if they feel too easy or difficult for you.")
              .listen("Would you like to dance again, or do something else?");
      this.emit(':responseReady');
  },

  // Stop
  'AMAZON.StopIntent': function() {
      this.response.speak('Ok, let\'s play again soon.');
      this.emit(':responseReady');
  },

  // Cancel
  'AMAZON.CancelIntent': function() {
      this.response.speak('Ok, let\'s play again soon.');
      this.emit(':responseReady');
  },

  'SessionEndedRequest': function() {
  	console.log('session ended!');
  	this.emit(':saveState', true);
  },

}

function SuperEasyBeatlist(rightspace, frontspace) {

  var beatlist = "";
  var rightjumps = 0;
  var forwardjumps = 0;

  for(var i=0; i<30; i++) {
        var direction = Math.floor((Math.random() * 100) %4);

        if(direction == 0) {
          if(rightjumps == rightspace) {
            beatlist = beatlist + " " + "Left,";
            rightjumps--;
          }
          else {
            beatlist = beatlist + " " + "Right,";
            rightjumps++;
          }
        }

        else if(direction == 1) {
          if(rightjumps == rightspace*-1) {
            beatlist = beatlist + " " + "Right,";
            rightjumps++;
          }
          else {
            beatlist = beatlist + " " + "Left,";
            rightjumps--;
          }
        }

        else if(direction == 2) {
          if(forwardjumps == frontspace) {
            beatlist = beatlist + " " + "Back,";
            forwardjumps--;
          }
          else {
            beatlist = beatlist + " " + "Forward,";
            forwardjumps++;
          }
        }

        else if(direction == 3) {
          if(forwardjumps == frontspace*-1) {
            beatlist = beatlist + " " + "Forward,";
            forwardjumps++;
          }
          else {
            beatlist = beatlist + " " + "Back,";
            forwardjumps--;
          }

        }
      }

      beatlist = "Super Easy. In 3. 2. 1. " + '<prosody rate="80%">' + beatlist + '</prosody>';
      return (beatlist);
}

function EasyBeatlist(rightspace, frontspace) {

  var beatlist = "";
  var rightjumps = 0;
  var forwardjumps = 0;

  for(var i=0; i<50; i++) {
        var direction = Math.floor((Math.random() * 100) %4);
        var special = Math.floor((Math.random() * 10));

        if(special == 0) {
          beatlist = beatlist + '</prosody><prosody rate="150%">Throw your hands up</prosody><prosody rate="100%">,';
          continue;
        }

        if(special == 1) {
          beatlist = beatlist + '</prosody><prosody rate="120%">Twirl around</prosody><prosody rate="100%">,';
        }

        if(direction == 0) {
          if(rightjumps == rightspace) {
            beatlist = beatlist + " " + "Left,";
            rightjumps--;
          }
          else {
            beatlist = beatlist + " " + "Right,";
            rightjumps++;
          }
        }

        else if(direction == 1) {
          if(rightjumps == rightspace*-1) {
            beatlist = beatlist + " " + "Right,";
            rightjumps++;
          }
          else {
            beatlist = beatlist + " " + "Left,";
            rightjumps--;
          }
        }

        else if(direction == 2) {
          if(forwardjumps == frontspace) {
            beatlist = beatlist + " " + "Back,";
            forwardjumps--;
          }
          else {
            beatlist = beatlist + " " + "Forward,";
            forwardjumps++;
          }
        }

        else if(direction == 3) {
          if(forwardjumps == frontspace*-1) {
            beatlist = beatlist + " " + "Forward,";
            forwardjumps++;
          }
          else {
            beatlist = beatlist + " " + "Back,";
            forwardjumps--;
          }

        }
      }

      beatlist = "Easy. In 3. 2. 1. " + '<prosody rate="100%">' + beatlist + '</prosody>';
      return (beatlist);
}

function MediumBeatlist(rightspace, frontspace) {

  var beatlist = "";
  var rightjumps = 0;
  var forwardjumps = 0;

  for(var i=0; i<50; i++) {
        var direction = Math.floor((Math.random() * 100) %4);
        var special = Math.floor((Math.random() * 10));

        if(special == 0) {
          beatlist = beatlist + '</prosody><prosody rate="150%">Throw your hands up</prosody><prosody rate="110%">,';
          continue;
        }

        if(special == 1) {
          beatlist = beatlist + '</prosody><prosody rate="120%">Twirl around</prosody><prosody rate="110%">,';
        }

        if(special == 2) {
          beatlist = beatlist + '</prosody><prosody rate="80%">Do a handstand</prosody><prosody rate="110%">,';
        }

        if(direction == 0) {
          if(rightjumps == rightspace) {
            beatlist = beatlist + " " + "Left,";
            rightjumps--;
          }
          else {
            beatlist = beatlist + " " + "Right,";
            rightjumps++;
          }
        }

        else if(direction == 1) {
          if(rightjumps == rightspace*-1) {
            beatlist = beatlist + " " + "Right,";
            rightjumps++;
          }
          else {
            beatlist = beatlist + " " + "Left,";
            rightjumps--;
          }
        }

        else if(direction == 2) {
          if(forwardjumps == frontspace) {
            beatlist = beatlist + " " + "Back,";
            forwardjumps--;
          }
          else {
            beatlist = beatlist + " " + "Forward,";
            forwardjumps++;
          }
        }

        else if(direction == 3) {
          if(forwardjumps == frontspace*-1) {
            beatlist = beatlist + " " + "Forward,";
            forwardjumps++;
          }
          else {
            beatlist = beatlist + " " + "Back,";
            forwardjumps--;
          }

        }
      }

      beatlist = "Medium. In 3. 2. 1. " + '<prosody rate="110%">' + beatlist + '</prosody>';
      return (beatlist);
}

function HardBeatlist(rightspace, frontspace) {

  var beatlist = "";
  var rightjumps = 0;
  var forwardjumps = 0;

  for(var i=0; i<50; i++) {
        var direction = Math.floor((Math.random() * 100) %4);
        var special = Math.floor((Math.random() * 10));

        if(special == 0) {
          beatlist = beatlist + '</prosody><prosody rate="150%">Throw your hands up</prosody><prosody rate="130%">,';
          continue;
        }

        if(special == 1) {
          beatlist = beatlist + '</prosody><prosody rate="120%">Twirl around</prosody><prosody rate="130%">,';
        }

        if(special == 2) {
          beatlist = beatlist + '</prosody><prosody rate="80%">Do a handstand</prosody><prosody rate="130%">,';
        }

        if(direction == 0) {
          if(rightjumps == rightspace) {
            beatlist = beatlist + " " + "Left,";
            rightjumps--;
          }
          else {
            beatlist = beatlist + " " + "Right,";
            rightjumps++;
          }
        }

        else if(direction == 1) {
          if(rightjumps == rightspace*-1) {
            beatlist = beatlist + " " + "Right,";
            rightjumps++;
          }
          else {
            beatlist = beatlist + " " + "Left,";
            rightjumps--;
          }
        }

        else if(direction == 2) {
          if(forwardjumps == frontspace) {
            beatlist = beatlist + " " + "Back,";
            forwardjumps--;
          }
          else {
            beatlist = beatlist + " " + "Forward,";
            forwardjumps++;
          }
        }

        else if(direction == 3) {
          if(forwardjumps == frontspace*-1) {
            beatlist = beatlist + " " + "Forward,";
            forwardjumps++;
          }
          else {
            beatlist = beatlist + " " + "Back,";
            forwardjumps--;
          }

        }
      }

      beatlist = "Hard. In 3. 2. 1. " + '<prosody rate="130%">' + beatlist + '</prosody>';
      return (beatlist);
}

function ExtraHardBeatlist(rightspace, frontspace) {

  var beatlist = "";
  var rightjumps = 0;
  var forwardjumps = 0;

  for(var i=0; i<50; i++) {
        var direction = Math.floor((Math.random() * 100) %4);
        var special = Math.floor((Math.random() * 10));

        if(special == 0) {
          beatlist = beatlist + '</prosody><prosody rate="150%">Throw your hands up</prosody><prosody rate="170%">,';
          continue;
        }

        if(special == 1) {
          beatlist = beatlist + '</prosody><prosody rate="120%">Twirl around</prosody><prosody rate="170%">,';
        }

        if(special == 2) {
          beatlist = beatlist + '</prosody><prosody rate="80%">Do a handstand</prosody><prosody rate="170%">,';
        }

        if(direction == 0) {
          if(rightjumps == rightspace) {
            beatlist = beatlist + " " + "Left,";
            rightjumps--;
          }
          else {
            beatlist = beatlist + " " + "Right,";
            rightjumps++;
          }
        }

        else if(direction == 1) {
          if(rightjumps == rightspace*-1) {
            beatlist = beatlist + " " + "Right,";
            rightjumps++;
          }
          else {
            beatlist = beatlist + " " + "Left,";
            rightjumps--;
          }
        }

        else if(direction == 2) {
          if(forwardjumps == frontspace) {
            beatlist = beatlist + " " + "Back,";
            forwardjumps--;
          }
          else {
            beatlist = beatlist + " " + "Forward,";
            forwardjumps++;
          }
        }

        else if(direction == 3) {
          if(forwardjumps == frontspace*-1) {
            beatlist = beatlist + " " + "Forward,";
            forwardjumps++;
          }
          else {
            beatlist = beatlist + " " + "Back,";
            forwardjumps--;
          }

        }
      }

      beatlist = "Extra Hard. In 3. 2. 1. " + '<prosody rate="170%">' + beatlist + '</prosody>';
      return (beatlist);
}
exports.handler = function(event, context, callback){
    var alexa = Alexa.handler(event, context);

    alexa.dynamoDBTableName = 'JumptotheBeatSetup';

    alexa.registerHandlers(handlers);
    alexa.execute();
};
