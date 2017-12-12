const Twitter = require('twitter');
const request = require('request');
const Spotify = require('node-spotify-api');
const keys = require('./keys.js');
const fs = require('fs');

//TWITTER CLIENT KEY
const client = new Twitter({
  consumer_key: keys.consumer_key,
  consumer_secret: keys.consumer_secret,
  access_token_key: keys.access_token_key,
  access_token_secret: keys.access_token_secret
});

//SPOTIFY KEY
const spotifyKey = new Spotify({
  id: 'a35a5f520cc944d0817f7528bcf7adc8',
  secret: '5d4ee6e5887146dfb9adb4afc542e87b'
});

//console.log(spotifyKey);

//ARGUMENT VARIABLES
let action = process.argv[2];
let args = process.argv;
let input = '';

//GRABS INPUT AFTER ACTION ARGUMENT
for (let i = 3; i < args.length; i++) {

  if (i > 3 && i < args.length) {
    input = input + '+' + args[i];
  } else {
    input += args[i];
  }

}

//console.log(input);

//ACTION SWITCHES
switch (action) {
  case 'my-tweets':
    tweetThis();
    break;

  case 'spotify-this-song':
    spotifyThis(input);
    break;

  case 'movie-this':
    movieThis(input);
    break;

  case 'do-what-it-says':
    sayThis();
    break;

  default:
    console.log("Please input one of the following: my-tweets, spotify-this-song, movie-this, or do-what-it-says");
    break;
}


//TWITTER FUNCTION
function tweetThis() {

  //PARAMETERS TO GRAB AND OUTPUT TWEETS
  let params = {
    screen_name: 'lhommeabsurde',
    count: 20,
    trim_user: true
  };

  client.get('statuses/user_timeline', params, (error, tweets, response) => {

    let tweetArray = tweets;

    if (!error) {
      for (let i = 0; i < tweetArray.length; i++) {
        console.log(tweetArray[i].text);
        console.log('Created: ' + tweetArray[i].created_at);
        console.log('---------------------------------------');
      }
    } else {
      console.log('An error occured');
    }

  });
}


//SPOTIFY FUNCTION
function spotifyThis(song) {

  if (song === '') {

    spotifyKey.search({
      type: 'track',
      query: 'The Sign'
    }, function(err, data) {

      if (err) {

        return console.log('Error occurred: ' + err);

      } else {

        let aceBase = data.tracks.items[7];

        console.log('Artist: ' + aceBase.artists[0].name);
        console.log('Title: ' + aceBase.name);
        console.log('Album: ' + aceBase.album.name);
        console.log('Preview: ' + aceBase.preview_url)
      }
    });

  } else {

    spotifyKey.search({
      type: 'track',
      query: song
    }, function(err, data) {

      if (err) {
        return console.log('Error occurred: ' + err);
      } else {

        //LOOPS THROUGH ALL AVAILABLE ARTISTS & CORRESPONDING DATA
        for (let i = 0; i < data.tracks.items.length; i++) {

          let songData = data.tracks.items[i];

          console.log('Arist: ' + songData.artists[0].name);
          console.log('Title: ' + songData.name);
          console.log('Album: ' + songData.album.name);
          console.log('Preview: ' + songData.preview_url);
          console.log('--------------------------------');
        }
      }
    });
  }
}


//MOVIE THIS FUNCTION
function movieThis(movie) {

  let queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

  if (movie === '') {

    let mrNobody = "http://www.omdbapi.com/?t=mr+nobody&y=&plot=short&apikey=trilogy";

    request(mrNobody, (error, response, body) => {

      let newBody = JSON.parse(body);

      if (!error && response.statusCode === 200) {
        console.log('Title: ' + newBody.Title);
        console.log('Release Year: ' + newBody.Year);
        console.log('IMDB Rating: ' + newBody.imdbRating);
        console.log('Rotten Tomatoes Rating: ' + newBody.Ratings[1].Value);
        console.log('Production Location(s): ' + newBody.Country);
        console.log('Language: ' + newBody.Language);
        console.log('Plot: ' + newBody.Plot);
        console.log('Cast: ' + newBody.Actors);
      } else {
        console.log('An error occured');
      }
    });

  } else {

    request(queryUrl, (error, response, body) => {

      let newBody = JSON.parse(body);

      if (!error && response.statusCode === 200) {
        console.log('Title: ' + newBody.Title);
        console.log('Release Year: ' + newBody.Year);
        console.log('IMDB Rating: ' + newBody.imdbRating);
        console.log('Rotten Tomatoes Rating: ' + newBody.Ratings[1].Value);
        console.log('Production Location(s): ' + newBody.Country);
        console.log('Language: ' + newBody.Language);
        console.log('Plot: ' + newBody.Plot);
        console.log('Cast: ' + newBody.Actors);
      } else {
        console.log('An error occured');
      }
    });

  }
}


//DO WHAT IT SAYS FUNCTION
function sayThis() {
  fs.readFile('random.txt', 'utf8', (err, data) => {

    if (err) {
      return console.log(err);
    }

    data = data.split(',');

    spotifyThis(data[1]);
  })
}