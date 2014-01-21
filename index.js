//'use strict';

//example:

/*

shimon='638618164'
send_facebook_message_to=require('./index.js')  //send_facebook_message_to=require('facebook_notify')
({
        facebookId:'10#$%^0$0351400'          // facebook user id, also add it as 'close friend' in friend settings from reciver view of sender profile,  http://findmyfacebookid.com/
      , appId: '59834#$%#@906971'              // a facebook app thet user owns, visit https://developers.facebook.com click on apps and create a new app, there is a text box with app id
      , appSecret:'7c8ad76c$#%#@$e2ecc98b4ebb5855'          // appSecret  in developer apps when you select the app there is a show secret link in a text box which revales the secret
      , accessToken:'CAAIgLZBQpotszRndjNZCJLgqf4#$%#@$cctFCMaCWsehYrj1J29Js6QhAEf0lhbNlwHfkxZAi0y9iw10dlgUFRd0ZA1m5O5rOyISBqQzzU8yQCFUzLZBlAFG731FZC6ZApICHmTidIKdL0YYOn31MWDIYNRdVLZCZCBZA5gVHvTNdw4aYug9l1VVAnDNwNfKlUZD'
         // for the app accessToken visit: https://developers.facebook.com/tools/explorer Select your app. Click get an access token. Click 'extended permissions'. Choose 'xmpp_login' Generate your access token
});
//usage:
//send_facebook_message_to(shimon,'test')

require("repl").start({useGlobal :true});// add repl for testing

*/


module.exports=function(opts){

var facebook_xmmp_client=null;
var facebook_xmmp_client_online=false;
var facebook_xmmp_client_queue=[];

return function(otherUserId,msg)
{
	var ltx  = require('node-xmpp-client/node_modules/ltx')

	if(facebook_xmmp_client!==null&&facebook_xmmp_client_online){
	    console.log('sending '+msg)
	    facebook_xmmp_client.send(new ltx.Element('message', { to: '-' + otherUserId + '@chat.facebook.com' }).c('body').t(msg))
	    return
	}
	else
		facebook_xmmp_client_queue.push({otherUserId:otherUserId,msg:msg});

 if(facebook_xmmp_client!==null&&!facebook_xmmp_client_online)return;

/**
 * Login to facebook chat via XMPP and send a simple 'hello world' message
 * to another user
 *
 * To look up a facebook user ID use: http://findmyfacebookid.com/
 *
 * Ensure that you obtain an access token with the extended 'xmpp_login'
 * permission or login will fail.
 *
 * To obtain one of these visit: https://developers.facebook.com/tools/explorer
 * Select to generate an access token
 * Click 'extended permissions'
 * Choose 'xmpp_login'
 * Generate your access token
 */
var Client = require('node-xmpp-client')


var facebookId = opts.facebookId 
var appId = opts.appId 
var appSecret = opts.appSecret 
var accessToken = opts.accessToken
//console.log({facebookId: facebookId,appId: appId ,appSecret: appSecret , accessToken: accessToken })


/* jshint -W106 */
facebook_xmmp_client = new Client({
    jid: '-' + facebookId + '@chat.facebook.com',
    password: '3cQDAUtUg9fF$wP*cYjZfwy&q5Wa%S$tWnU2',
    api_key: appId,
    secret_key: appSecret,
    access_token: accessToken,
    reconnect:true
})
facebook_xmmp_client_online=false
//facebook_xmmp_client.on('stanza', function(stanza) {console.log('Received:', stanza.toString()) })
facebook_xmmp_client.addListener('error', function(e) {   console.error(e); try{facebook_xmmp_client.end();} catch(r){};facebook_xmmp_client=null; /*    process.exit(1)*/})
facebook_xmmp_client.addListener('close', function () {facebook_xmmp_client=null;}); 
facebook_xmmp_client.connection.socket.setTimeout(0)
facebook_xmmp_client.connection.socket.setKeepAlive(true, 10000)

facebook_xmmp_client.addListener('online', function(data) {
    console.log('facebook online: Connected as ' + data.jid.user + '@' + data.jid.domain + '/' + data.jid.resource)
	while(facebook_xmmp_client_queue.length)
	{
	    var o=facebook_xmmp_client_queue.shift();
	    console.log('sending '+o.msg)
            facebook_xmmp_client.send(new ltx.Element('message', { to: '-' + o.otherUserId + '@chat.facebook.com' }).c('body').t(o.msg) )
	}
	facebook_xmmp_client_online=true

setTimeout(function(){//make sure one more time
   while(facebook_xmmp_client_queue.length)
        {
            var o=facebook_xmmp_client_queue.shift();
            console.log('sending '+o.msg)
            facebook_xmmp_client.send(new ltx.Element('message', { to: '-' + o.otherUserId + '@chat.facebook.com' }).c('body').t(o.msg) )
        }
},500)

    // nodejs has nothing left to do and will exit
    // client.end()
})


}



}
