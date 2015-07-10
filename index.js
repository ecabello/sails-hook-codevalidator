var _ = require('lodash'),
    randomstring = require('randomstring'),
    injectModel = require('./lib/injectmodel'),
    codeValidator = require('./lib/codevalidator');

module.exports = function userlogin(sails) {
    sails.log.info('loading codevalidator' );
    return _.merge({
        __configKey__: {
            codeLen: 20,
            generateValidationCode: function(options) {
                return randomstring.generate(options.codeLen);
            },
            validatedCallback: function(req, res, validation) {
                // Success
                return res.send(200);
            }
        },

        routes: {
            before: {
                'GET /validate/:id': function(req, res) {
                    return sails.hooks.codevalidator.validate(req, res);
                }
            }
        },

        configure: function() {
            sails.log.info('configuring codevalidator');
            sails.config[this.configKey] = sails.config[this.configKey] || {};
            _.defaults(sails.config[this.configKey], this.__configKey__);
        },

        initialize: function(cb) {
            var self = this;
            sails.on('hook:orm:loaded', function() {
                sails.log.info('initializing codevalidator');
                // Inject a model
                var model = {
                    globalId: 'code_validation',
                    attributes: {
                        code: {
                            type: 'string',
                            required: true
                        },
                        validated: {
                            type: 'boolean',
                            defaultsTo: false,
                            required: true
                        }
                    }
                };
                sails.log.info('injecting ' + model.globalId + ' model');
                injectModel(sails, model, function () {
                    sails.log.info(model.globalId + ' model injected');
                    cb();
                });
            });
        }
    }, codeValidator);
};
