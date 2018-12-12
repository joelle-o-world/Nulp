var Twitter = require("twitter-node-client").Twitter;

module.exports = function(tweet) {
  var twitter = new Twitter({
     "consumerKey": "qP26vv8cweLfG526x9emKFYT8",
     "consumerSecret": "MBiYaG1GCmIdgIt05nTRWEyWNJErBH7oiKJI8bZZB0GJ5Dhh6r",
     "accessToken": "971536051914395648-lQTiZbaB8COOqk0REnY1nKYduKA9VMx",
     "accessTokenSecret": "Kg7DPAu0bfIGPokbX5cVmeMcl8VAjujLRh8Y2Xg9b0cIr",
  })
  twitter.postTweet(
    {status: tweet},
    function() {
      console.log("failed to tweet")
    },
    function() {
      console.log("tweeted:", tweet)
    }
  )
}
