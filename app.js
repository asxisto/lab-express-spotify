require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// Our routes go here:
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/artist-search', (req, res) => {
  const term = req.query.artist;
  spotifyApi
    .searchArtists(term)
    .then(data => {
      res.render('artist-search-results', { results: data.body.artists.items });
      // console.log('The received data from the API: ', data.body.artists.items[0]);
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:artistId', (req, res, next) => {
  const artistId = req.params.artistId;
  spotifyApi
    .getArtistAlbums(artistId)
    .then(data => {
      res.render('albums', { results: data.body.items });
      // console.log('data:', data.body.items[1]);
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:albumId/tracks', (req, res, next) => {
  const albumId = req.params.albumId;

  spotifyApi.getAlbumTracks(albumId).then(data => {
    console.log('album:', data.body);
    res.render('tracks', { results: data.body.items });
  });
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
