'use strict';

let mongoose = require('mongoose');
let User = mongoose.model('Users');
let Note = require('../models/note');
let bcrypt = require("bcrypt");

let config = require('../../configs/'+ (process.env.NODE_ENV || "dev") + ".json");
var jwt = require("jwt-simple");


exports.list_all_notes_by_user = function(req, res) {
    req.user.exec((err, user) => {
        if (err)
            res.json({success: false, message: err});
        else
        {
            res.json({success: true, notes: user.notes});
        }
    })
};

exports.create_a_note = function(req, res) {
    req.user.exec((err, user) => {
        if (err)
            res.json({success: false, message: err});
        else
        {
            var inserted_notes = [];
            req.body.forEach(element => {
                var new_note = element;
                user.notes.push(new_note);
                inserted_notes.push(user.notes[user.notes.length-1]);
            });
            user.save((err) => {
                if (err)
                    res.json({sucess: false, message: err});
                else
                {
                    var result = [];
                    inserted_notes.forEach(element => {
                        var obj = element.toObject();
                        obj.success = true;
                        result.push(obj);
                    });
                    res.json(result);
                }
            });
        }
    })
    

};

exports.read_a_note = function(req, res) {
    User.findById(req.params.userId, function(err, msg) {
        if (err)
            res.send(err);
        else
            res.json(msg);
    });
};

exports.update_a_note = function (req, res) {
    User.findOneAndUpdate({_id:req.params.msgId}, req.body, {new:true}, function(err, msg){
        if (err)
            res.send(err);
        res.json(msg);
    });
};

exports.delete_a_note = function(req, res) {
    User.remove({
        _id:req.params.msgId
    }, function(err, msg) {
        if (err)
            res.send(err);
        res.json({message: 'User successfully deleted'});
    });
};
