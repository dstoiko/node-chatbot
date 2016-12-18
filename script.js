'use latest';

const Script = require('smooch-bot').Script;

// Natural language processing module
const natural = require('natural');
// For e-mail validation
const validator = require('validator');
// For external API requests
const request = require('request');
// For JSON filtering
const where = require('lodash.where');
// States stored locally
const states = require('./states');

const BUILTWITH_KEY = process.env['BUILTWITH_API_KEY'];

// Filters for parsing BuiltWith API response
function techFilter(technologies, tag) {
  if (where(technologies, { 'Tag': tag }) !== null) {
    var results = where(technologies, { 'Tag': tag });
    var array = [];
    results.forEach(function(result) {
      array.push(result.Name);
    });
    var string = array.join(', ');
    return string;
  }
  else {
    return 'pas d\'information';
  }
}

module.exports = new Script({

    processing: {
        receive: () => 'processing'
    },

    // Initial state of the bot
    start: {
        receive: (bot) => {
            return bot.say(states.start.response)
                .then( () => bot.say('%[Oui](reply:sessionStart) %[Non](reply:site)') )
                .then( () => 'replyButtonProcessing')
        }
    },

    replyButtonProcessing: {
        receive: (bot, message) => {
            return message.payload
        }
    },

    site: {
        prompt: (bot) => {
            return bot.say(states.site.prompt)
                .then( () => bot.say('%[Notre site](https://google.com)') )
        },
        receive: () => 'start'
    },

    sessionStart: {
        prompt: (bot) => {
            return bot.say(states.sessionStart.prompt)
                .then( () => bot.say('%[Migration](reply:migration) %[Creation](reply:creation)') )
        },
        receive: (bot, message) => {
            return  message.payload
        }
    },

    creation: {
        prompt: (bot) => {
            return bot.say(states.creation.prompt)
                .then( () => 'booking')
        },
        receive: () => 'start'
    },

    booking: {
        prompt: (bot) => {
            return bot.say(states.booking.prompt)
                .then( () => 'start')
        },
        receive : () => 'start'
    },

    migration: {
        prompt: (bot) => {
            return bot.say(states.migration.prompt)
        },
        receive: () =>  {
          // var siteUrl = message.text.trim();
          return bot.say(states.migration.wait)
          // .then(() => {
          //   return new Promise((resolve) => {
          //     request(
          //       'https://api.builtwith.com/v11/api.json?KEY=' +
          //       BUILTWITH_KEY +
          //       '&LOOKUP=' +
          //       siteUrl,
          //       function (error, response, body) {
          //         var out = '';
          //         if (!error && response.statusCode == 200) {
          //           var technologies = JSON.parse(body).Results[0].Result.Paths[0].Technologies;
          //           var cms = techFilter(technologies, 'cms');
          //           var hosting = techFilter(technologies, 'hosting');
          //           var framework = techFilter(technologies, 'framework');
          //           out = 'CMS : ' + cms + '\n' +
          //                 'Hébergement : ' + hosting + '\n' +
          //                 'Langage(s) : ' + framework ;
          //         }
          //         else {
          //           out = 'Je n\'ai pas trouvé votre profil technologique, toutes mes excuses...';
          //         }
          //       console.log(out);
          //       resolve(bot.say(out));
          //     });
          //   });
          // })
            .then(() => 'builtWithResults')
        }
    },

    builtWithResults: {
        prompt: (bot) => {
            return bot.say(states.builtWithResults.prompt)
        },
        receive: () => 'start'
    }

});
