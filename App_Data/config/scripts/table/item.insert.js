function insert(item, user, request) {
    item.userId = user.userId;

    var users = JSON.parse(item.users);
    var updated = [];
    function updateUser(u, a) {
        tables.getTable('user').where({ 
            id: u
        }).read({
            success: function(r){
                r[0].total = parseFloat(r[0].total) + a;
                tables.getTable('user').update(r[0], {
                    success: function(updatedItem) {
                        updated.push(updatedItem);
                        isDone();
                    }
                });
            }
        });
    }
    
    function isDone() {
        if (updated.length == i) {
            request.respond(200);//, updated);
        }
    }
    
    var i = 0;
    request.execute({
        success: function() {
            if (users.indexOf(item.userId) == -1) {
                updateUser(item.userId, parseFloat(item.amount));
                i++;
            }

            users.forEach(function (u) {
                var amount = -(parseFloat(item.amount) / users.length);
                if (u == item.userId) amount += parseFloat(item.amount);
                updateUser(u, amount);
                i++;
            });
        }
    });
}