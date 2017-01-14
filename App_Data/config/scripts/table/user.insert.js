function insert(item, user, request) {
    var table = tables.getTable('user');
    table.where({ 
       id: user.userId
    }).read({
       success: upsertItem
    });

    function upsertItem(existingItems) {
        if (existingItems.length === 0) {
            item.name = "<unknown>"; // default
            item.total = 0;
            user.getIdentities({
                success: function (identities) {
                    var req = require('request');
                    if (identities.facebook) {
                        var fbAccessToken = identities.facebook.accessToken;
                        var url = 'https://graph.facebook.com/me?access_token=' + fbAccessToken;
                        req(url, function (err, resp, body) {
                            if (err || resp.statusCode !== 200) {
                                console.error('Error sending data to FB Graph API: ', err);
                                request.respond(statusCodes.INTERNAL_SERVER_ERROR, body);
                            } else {
                                try {
                                    var userData = JSON.parse(body);
                                    item.name = userData.name;
                                    
                                    request.execute();
                                    
                                } catch (ex) {
                                    console.error('Error parsing response from FB Graph API: ', ex);
                                    request.respond(statusCodes.INTERNAL_SERVER_ERROR, ex);
                                }
                            }
                        });
                    } else {
                        // Insert with default user name
                        request.execute();
                    }
                }
            });
        } else {
            item.id = existingItems[0].id;
            
            table.update(item, {
                success: function(updatedItem) {
                    request.respond(200, updatedItem)
                },
                error: function(updatedItem) {
                    request.respond(401, "Unauthorized")
                }
            });
        }
     }
}