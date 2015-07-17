'use strict';

var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');

var validationError = function(res, error) {
    return res.status(422).json(error);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function (req, res) {
    User.find({}, '-salt -hashedPassword', function (error, users) {
        if (error) {
            return res.status(500).send(error);
        }
        res.status(200).json(users);
    });
};

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
    var newUser = new User(req.body);
    newUser.provider = 'local';
    newUser.role = 'user';
    newUser.save(function (error, user) {
        if (error) {
            return validationError(res, error);
        }
        var token = jwt.sign(
            {_id: user._id },
            config.secrets.session,
            { expiresInMinutes: 60 * 5 }
        );
        res.json({ token: token });
    });
};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
    var userId = req.params.id;

    User.findById(userId, function (error, user) {
        if (error) {
            return next(error);
        }
        if (!user) {
            return res.status(401).send('Unauthorized');
        }
        res.json(user.profile);
    });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function (req, res) {
    User.findByIdAndRemove(req.params.id, function(error, user) {
        if (error) {
            return res.status(500).send(error);
        }
        return res.status(204).send('No Content');
    });
};

/**
 * Change a users password
 */
exports.changePassword = function (req, res, next) {
    var userId = req.user._id;
    var oldPass = String(req.body.oldPassword);
    var newPass = String(req.body.newPassword);

    User.findById(userId, function (error, user) {
        if (user.authenticate(oldPass)) {
            user.password = newPass;
            user.save(function (error) {
                if (error) {
                    return validationError(res, error);
                }
                res.status(200).send('OK');
            });
        } else {
            res.status(403).send('Forbidden');
        }
    });
};

/**
 * Get my info
 */
exports.me = function (req, res, next) {
    var userId = req.user._id;
    User.findOne({
        _id: userId
    }, '-salt -hashedPassword', function (error, user) { // don't ever give out the password or salt
        if (error) {
            return next(error);
        }
        if (!user) {
            return res.status(401).send('Unauthorized');
        }
        res.json(user);
    });
};

/**
 * Authentication callback
 */
exports.authCallback = function (req, res, next) {
    res.redirect('/');
};
