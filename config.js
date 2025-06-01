module.exports = {
  client_id: 'YOUR_SPOTIFY_CLIENT_ID',          // Badilisha na Client ID yako
  client_secret: 'YOUR_SPOTIFY_CLIENT_SECRET',  // Badilisha na Client Secret yako
  redirect_uri: 'http://localhost:3000/callback',  // Redirect URI (iwe ile uliyoweka Spotify Developer Dashboard)
  scopes: [
    'streaming',
    'user-read-email',
    'user-read-private',
    'user-modify-playback-state',
    'user-read-playback-state'
  ].join(' ')
};
