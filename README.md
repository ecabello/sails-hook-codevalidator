# sails-hook-codevalidator

Basic code validation functionality hook for sails.

It injects a code_validation Model into your app to keep track of validations.

A validation is simply an id, code and optional data that can be validated when you

HTTP GET /validate/:id?code=code


# Routes

The Hook intalls and handle the following routes

* /validate/:id


# Configuration

By default the Hook will generate a random code 20 characters in length and
respond with HTTP 200 when a validation is successful. HTTP 404 otherwise.

This behavior can be changed by adding a codevalidator.js file under your
sails config directory.

For example to change the length of the code generated:

```javascript
module.exports.codevalidator = {  
  codeLen: 10
};  
```

The actual code generation function can be replaced:

```javascript
module.exports.codevalidator = {  
  counter: 0,
  generateValidationCode: function(options) {
    return 'ABC' + (++options.counter);
  }
};
```

And the callback for a successful validation:

```javascript
module.exports.codevalidator = {  
  validatedCallback: function(req, res, validation) {
      return res.send('Code ' + validation.code + ' validated!');
  }
};
```
