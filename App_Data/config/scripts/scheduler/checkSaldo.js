var usersTable = tables.getTable('User');
var itemsTable = tables.getTable('Item');

function checkSaldo() {
    usersTable.read({success: function (users) {
        itemsTable.read({success: function (items) {
            compare(users, items);
        }});
    }});
}
    
function compare(users, items) {
    users.forEach(function (user) {
        var tot = 0;
        items.forEach(function (item) {
            if (item.date > new Date()) {
                console.log("Datum ligt in de toekomst: " + item.date);
                itemsTable.update({ id: item.id, userId: item.userId,
                    date: new Date(item.date.getFullYear()-1, item.date.getMonth(), item.date.getDate())
                });
                console.log(" ==> " + item.date + "; item: " + item);
            }
            
            if (item.userId == user.id) tot += parseFloat(item.amount);
            if (item.users.indexOf(user.id) > -1)
                tot -= parseFloat(item.amount) / item.users.split(',').length;
        });
        if (user.total != tot) {
            console.log("Totaal herzien: " + user.total + " ==> " + tot);
            usersTable.update({ id: user.id, total: tot });
        }
    });
}