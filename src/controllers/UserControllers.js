const mongoose = require('mongoose');
const User = require('../models/user');
const AuthController = {};
const bcrypt = require('bcrypt');

AuthController.index = function(req, res, next){
    res.render('index');
}

AuthController.login = function(req, res, next){
    res.render('signin')
}

AuthController.create = function(req, res, next){
    res.render('signup');
}

AuthController.store = async function(req, res, next){
    let user = {
        email: req.body.email,
        password: req.body.password
    }
    await User.create(user, (error, User)=>{
        if(error) {
            return res.render('signup', {err:error, email:user.email});
        } else {
            let data = {
                userId: user._id.toString(), 
                email: user.email,
                password: user.password
            }
            bcrypt.hash(data.userId, 10, function(err, hash){
                if (err){
                    next(err);                    
                }
                data.userId = hash;
                req.session.user = JSON.stringify(data);
                return res.redirect('/users/profile');
            });
        }
    });
}

AuthController.profile = function(req, res){
    res.render('profile');    
}

AuthController.sigin = function(req, res, next){
    var data = {};
    User.authenticate(req.body.email, req.body.password, (err, user)=> {
        if (err || !user){
            res.render('signin', {err: error, email: req.body.email});
        } else {
            let data = {
                userId: user._id.toString(), 
                email: user.email,
                password: user.password
            }
            bcrypt.hash(data.userId, 10, function(err, hash){
                if (err){
                    next(err);                    
                }
                data.userId = hash;
                req.session.user = JSON.stringify(data);
                return res.redirect('/users/profile');
            });
        }
    });
}

AuthController.logout = function(req, res, next){
    if (!req.session){
        res.redirect('/');
    } else {
        req.session.destroy(function(err){
            if (err) {
                next(err);
            } else {
                res.redirect('/');
                
            }
        });
    }
}
