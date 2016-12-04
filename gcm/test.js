var gcm = require('node-gcm');
var fs = require('fs');

var message = new gcm.Message({
    collapseKey: 'demo',
    delayWhileIdle: true,
    timeToLive: 3,
    // data: data
    data: {
      title: 'GGP 공지사항 추가',
      message: '공지 사항 추가 됨'
    }
    // notification: {
    //   title: "GGP 공지사항 추가",
    //   icon: "aim_bleu",
    //   body: "공지 사항 추가 됨"
    // }
});


var server_api_key = 'AIzaSyAUEX5kRjIR5yh_G4t54KulHwh7SCrLs3c';
var sender = new gcm.Sender(server_api_key);
var registrationIds = [];

// G3
var G3 ='dlpDBbF5Jgo:APA91bGaRsZIfDzCDH6JuTZ5p11Hu6f0SGY95_Nkgk_oKnilldXT-CFxsA-PROWLZT5ROsilz1m-BWACjK9et9o6rBfN_oR-I3nSZeZfLPcoQ7LobRH6BWXua4Oyv5sp5C9qcDKtyQ7j';

// G  프로
// var GPro = 'fQT9ZSgPM6E:APA91bExAtgdM8sRSLJY5275J-BK6aZe82Y8E5OtBXnOWOvLLa6h9UbjaznAVBvREb14RHWXa-CynRk5ZIgXkDvgxmTA1-aNn2SSyTcauRTCUrv0ylERSPNTQEYXyB7flfRQl4OuB6wV';

registrationIds.push(G3);


function Gcm() {
	// sender.send(message, registrationIds, 4, function (err, result) {
	//     console.log(result);
	// });
}

Gcm.prototype.sendGcm = function(title, msg, regIds, callback){

	var message = new gcm.Message({
		collapseKey: 'demo',
		delayWhileIdle: true,
		timeToLive: 3,
		data: {
    		// post_id : 381,
	      post_title: title,
	      post_content: msg
	    },
	    notification: {
	      title: title,
	      icon: "aim_bleu",
	      body: msg
	    }
	});
	sender.send(message, regIds, 4, function (err, result) {
	    console.log(result);
		if ( err ) {
			callback(err);
		} else {
			callback(result);
		}
	});
};

module.exports = Gcm;
