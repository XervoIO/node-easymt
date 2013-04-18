var ejs = require('ejs');
/**
 * Simple template object used for internal processing of template information.
 * @constructor
 * @param meta the metadata for this template
 * @param ejsStr a string representing the ejs template
 */
var Template = function(meta, ejsStr) {
  meta = meta || {};
  this.subject = meta.subject || '';
  this.ejs = ejsStr;
};

/**
 * Convenience function that processes template options
 * @param data the data to pass to the template
 * @param options the options to use when rendering the template 
 */
Template.prototype.getOptions = function(data, options) {
  var opts = {
    locals: data
  };

  for(var o in options) {
    opts[o] = options[o];
  }

  return opts;
};

/**
 * Returns a simple object with the email information
 * @param data the data to pass to the template
 * @param options the options to use when rendering the template
 * @param callback the callback to run when the template is ready
 */
Template.prototype.toObject = function(data, options, callback) {
  var template = {};
  template.subject = this.subject;

  try {
    template.body = ejs.render(
      this.ejs,
      this.getOptions(data, options)
    );
  } catch(e) {
    return callback(e, null);
  }

  return callback(null, template);
};

module.exports = Template;