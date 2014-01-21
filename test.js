// for development copy this file to mytest.js see .gitignore

me=''//your personal facebook id //  http://findmyfacebookid.com/

send_facebook_message_to=require('./index.js')  //send_facebook_message_to=require('facebook_notify')
({
        facebookId:''          // create a facebook user id, also to prevent reciving from him as spam add it as 'close friend' by you (the reciving user),  http://findmyfacebookid.com/
      , appId: ''              // a facebook app thet user owns, visit https://developers.facebook.com click on apps and create a new app, there is a text box with app id
      , appSecret:''          // appSecret  in developer apps when you select the app there is a show secret link in a text box which revales the secret
      , accessToken:''
         // for the app accessToken visit: https://developers.facebook.com/tools/explorer Select your app. Click get an access token. Click 'extended permissions'. Choose 'xmpp_login' Generate your access token
});

// usage: in the repl type:
// send_facebook_message_to(me,'test')

console.log("\n//usage: in the repl type: \n//send_facebook_message_to(me,'test') \n\n");

require("repl").start({useGlobal :true});// add repl for testing
