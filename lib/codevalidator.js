'use strict';

var enhanceView = require('sails/lib/hooks/views/res.view.js')

module.exports={
    startValidation: function(data, cb) {
        if (!cb) {
            cb = data;
            data = null;
        }
        var validation = {
            code: sails.config.codevalidator.generateValidationCode(sails.config.codevalidator)
        };
        if (data)
            validation.data = data;

        sails.models.code_validation.create(validation, function(err, validation) {
            if (err)
                return cb(err, null);

            return cb(null, validation);
        });
    },

    validate: function(req, res) {
        enhanceView(req, res, function () {
            var validationId = req.param('id');
            if (!validationId)
                return res.badRequest('No validation id specified');
            var code = req.param('code');
            if (!code)
                return res.badRequest('No code specified');

            sails.models.code_validation.update({
              id: validationId,
              code: code,
              validated: false
            }, {validated: true}).exec(function(err, validations) {
                if (err)
                    return res.serverError(err.message)

                if (!validations.length)
                    return res.notFound();

                return sails.config.codevalidator.validatedCallback(req, res, validations[0]);
            });
        });
    }
};
