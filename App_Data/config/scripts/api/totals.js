exports.get = function(request, response) {
    var users = [];
    var mssql = request.service.mssql;
    var sql = "SELECT i.amount, i.userId, i.users, u.name FROM Item AS i " +
                "INNER JOIN [User] AS u ON i.userId = u.id " +
                "WHERE i.userId = ? " +
                "OR i.users LIKE '%" + request.user.userId + "%'";
    mssql.query(sql, [request.user.userId], {
        success: function(results) {
            results.forEach(function(item) {
                updateUser(
                    {'id': item.userId, 'name': item.name, 'total': parseFloat(item.amount)}
                );

                eval(item.users).forEach(function(u) {
                    updateUser({'id': u, 'total': -(item.amount / item.users.split(',').length)});
                });
            });
            for (var i = 0; i < users.length; i++) {
                if (!users[i].name || users[i].name == '') {
                    request.service.tables.getTable('user').lookup(users[i].id, {
                        success: function (user) {
                            updateUser(user);
                            check();
                        }
                    });
                } else check();
            }
         } 
    });
    function updateUser(user) {
        if (!user || !user.id || user.id == '') return false;
        
        var i = users.map(function (obj) {
            return obj.id;
        }).indexOf(user.id);
        if (i >= 0) {
            for (var prop in user) {
                if (user.hasOwnProperty(prop)) {
                    if (prop == 'total')
                        users[i][prop] += parseFloat(user[prop]);
                    else users[i][prop] = user[prop];
                }
            }
        } else {
            users.push(user);
        }
        return true;
    }
    var count = 1;
    function check() {
        if (count == users.length) 
            response.send(statusCodes.OK, users);
        count++;
    }
};