'use strict';

module.exports = function(app) {
    var users = require('../controllers/user');

    app.route('/user')
        .post(users.create_a_user);
    
    app.route('/user/:userId')
        .get(users.read_a_user)
        .put(users.update_a_user)
        .delete(users.delete_a_user);
};