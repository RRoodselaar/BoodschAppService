/*function read(query, user, request) {

    request.execute();

}
*/
var friends = [];

function read(query, user, request) {
    user.getIdentities({
        success: function (identities) {
            if (identities.facebook) {
                var fbAccessToken = identities.facebook.accessToken;
                var url = "https://graph.facebook.com/me/friends?fields=id&limit=10&access_token=" + fbAccessToken;
                getFriends(url,request,function(){
                    request.execute({
                        success: function(users) {
                            var result = [];
                            friends.push({"id":user.userId.split(':')[1]});
                            users.forEach(function(user) {
                                friends.forEach(function(friend){
                                    if (friend.id==user.id.split(':')[1]) {
                                        result.push(user);
                                        return;
                                    }
                                });
                            });
                            request.respond(200, result);
                        }
                    });/*
                    query.where(function(user){//{ userId: user.userId });
                        return this.id == user.userId
                            || friends.any({"id":this.id.split(':')[1]});
                   }, user);*/
                });
            }
        }
    });
}

function getFriends(url,request,callback) {
    var req = require('request');
    req(url, function (error, response, body){
      if (!error && response.statusCode==200) {
        try {
            var results = JSON.parse(body);
            //console.log(results.data);
            results.data.forEach(function(friend){friends.push(friend)});
            if (results.paging && results.paging.next) getFriends(results.paging.next,request,callback);
            else callback();
        } catch(error) {
            request.respond(response.statusCode, error);
        }
      } else {
        request.respond(response.statusCode, error);
      }
    });
}