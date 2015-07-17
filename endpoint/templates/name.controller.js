'use strict';

var _ = require('lodash');<% if (filters.mongoose) { %>
var <%= classedName %> = require('./<%= name %>.model');<% } %>

// Get list of <%= name %>s
exports.index = function (req, res) {<% if (!filters.mongoose) { %>
    res.json([]);<% } %><% if (filters.mongoose) { %>
    <%= classedName %>.find(function (error, <%= name %>s) {
        if (error) {
            return handleError(res, error);
        }
        return res.status(200).json(<%= name %>s);
    });<% } %>
};<% if (filters.mongoose) { %>

// Get a single <%= name %>
exports.show = function (req, res) {
    <%= classedName %>.findById(req.params.id, function (error, <%= name %>) {
        if (error) {
            return handleError(res, error);
        }
        if (!<%= name %>) {
            return res.status(404).send('Not Found');
        }
        return res.json(<%= name %>);
    });
};

// Creates a new <%= name %> in the DB.
exports.create = function (req, res) {
    <%= classedName %>.create(req.body, function (error, <%= name %>) {
        if (error) {
            return handleError(res, error);
        }
        return res.status(201).json(<%= name %>);
    });
};

// Updates an existing <%= name %> in the DB.
exports.update = function (req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    <%= classedName %>.findById(req.params.id, function (error, <%= name %>) {
        if (error) {
            return handleError(res, error);
        }
        if (!<%= name %>) {
            return res.status(404).send('Not Found');
        }
        var updated = _.merge(<%= name %>, req.body);
        updated.save(function (error) {
            if (error) {
                return handleError(res, error);
            }
            return res.status(200).json(<%= name %>);
        });
    });
};

// Deletes a <%= name %> from the DB.
exports.destroy = function (req, res) {
    <%= classedName %>.findById(req.params.id, function (error, <%= name %>) {
        if (error) {
            return handleError(res, error);
        }
        if (!<%= name %>) {
            return res.status(404).send('Not Found');
        }
        <%= name %>.remove(function (error) {
            if (error) {
                return handleError(res, error);
            }
            return res.status(204).send('No Content');
        });
    });
};

function handleError(res, error) {
    return res.status(500).send(error);
}<% } %>
