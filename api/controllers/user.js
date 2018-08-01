'use strict';

let mongoose = require('mongoose');
let User = mongoose.model('Users');
let bcrypt = require("bcrypt");


exports.list_all_users = function(req, res) {
    User.find({}, function(err, msg) {
            if (err)
                res.send(err);
            res.json(msg);
    });
};

exports.create_a_user = function(req, res) {
    User.findOne({"username": req.body.username})
        .then(user => {
            if(user) {
                res.json({ success: false, message: "This username has no available"});
            }
            else{
                bcrypt.hash(req.body.password, 10)
                    .then(hash => {
                        let new_user = new User({
                            username: req.body.username,
                            email: req.body.email, 
                            password: hash,
                            firstname: req.body.firstname,
                            lastname: req.body.lastname,
                            isAdmin: false //WARNING: Caso altere aqui, lembre-se que essa linha garante que ninguem irá se registrar como admin
                        });

                        new_user.save()
                            .then(() => res.json({ success: true, message: "User created with success" }))
                            .catch(err => res.json({ success: false, message: err.message }));
                    })
                    .catch(err => res.json({ success: false, message: err.message }));
            }
        });
};

exports.read_a_user = function(req, res) {
    User.findById(req.params.userId, function(err, msg) {
        if (err)
            res.send(err);
        else
            res.json(msg);
    });
};

exports.update_a_user = function (req, res) {
    User.findOneAndUpdate({_id:req.params.msgId}, req.body, {new:true}, function(err, msg){
        if (err)
            res.send(err);
        res.json(msg);
    });
};

exports.delete_a_user = function(req, res) {
    User.remove({
        _id:req.params.msgId
    }, function(err, msg) {
        if (err)
            res.send(err);
        res.json({message: 'User successfully deleted'});
    });
};
