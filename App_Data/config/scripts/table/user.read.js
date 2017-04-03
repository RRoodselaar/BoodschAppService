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
                var url = "https://graph.facebook.com/me/friends?fields=id&access_token=" + fbAccessToken;
                getFriends(url,request,function(){
                    request.execute({
                        success: function(users) {
                            friends.push({"id":user.userId.split(':')[1]});
                            users.map(function(u){
                                return {"id":u.id.split(':')[1]};
                            }).filter(function(f){
                                return friends.indexOf(f) > -1;
                            });
                            
                            request.respond(200, users);
                        }
                    });
                });
            }
        }
    });
}

// The Facebook API returns only "friends" that make recent use of _this_ app
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