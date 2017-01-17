
function del(id, user, request) {
    tables.current.where({ id: item.id, userId: user.userId }).read({
        success: function(results) {
            if (results.length) {
                request.execute();
            } else {
                request.respond(401, { error: 'Invalid operation' });
            }
        }
    });
}