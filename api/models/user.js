'use strict';

let mongoose = require('mongoose');
let Note = require('./note');
let Schema = mongoose.Schema;
var userSchema = new Schema ({
    firstname: {
        type: String,
        required: true
    },

    lastname: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    username: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    created_date: {
        type: Date,
        default: Date.now
    },

    isAdmin: { 
        type: Boolean,
        default: false
    },

    notes: [Note]
});

module.exports = mongoose.model('Users', userSchema);