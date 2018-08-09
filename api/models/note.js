'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var NoteSchema = new Schema ({
    title: {
        type: String
    },

    content: {
        type: String,
        required: true
    },

    created_date: {
        type: Date,
        default: Date.now
    },

    background_color: { 
        type: String, //#RGB
        default: "#00CED1" //Some shade of cyan
    },

    font_color: {
        type: String,
        default: "#000"
    }
});

module.exports = NoteSchema;