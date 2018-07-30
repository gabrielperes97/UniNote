'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema ({
    firstname: {
        type: String
    },

    lastname: {
        type: String
    },

    email: {
        type: String
    },

    username: {
        type: String
    },

    password: {
        type: String
    },

    Created_date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Users', userSchema);