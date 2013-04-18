var async = require('async');
var fs = require('fs');
var Template = require('./template');

var EasyMailTemplates = {
  //Simple in-memory cache of the already used templates
  cache: {},

  //Root directory for template files
  root: 'templates',

  //Template options
  options: {},

  /**
   * Optional initialization function that sets a few properties.
   * Only useful for "non-default" configurations.
   * @param dir the root directory for the template files
   * @param options the options used in template rendering
   */
  init: function(dir, options) {
    this.root = dir || this.root;
    this.options = options || this.options;
    return this;
  },

  /**
   * Gets a simple template object, either from the cache 
   * or cold-loaded from the file system.
   * @param name the name of the template to load
   * @param data the local data to pass to the template
   * @param callback the function to call when the template is loaded
   */
  get: function(name, data, callback) {
    //Make the data argument optional
    if(typeof data === 'function') {
      callback = data;
    }

    //If this template is in the cache, load it from there instead
    if(this.cache[name]) {
      return this.cache[name].toObject(data, this.options);
    }

    //Few variables we will need later
    var mt = this,
        metaData, 
        metaFile = mt.root + '/' + name + '.json',
        templateFile = '';

    async.waterfall([

      //Does the metadata file exist
      function(cb) {
        fs.exists(metaFile, function(exists) {
          if(!exists) {
            return cb(new Error('Template does not exist.'));
          }

          cb(null);
        });
      },

      //Load the metadata file
      function(cb) {
        fs.readFile(metaFile, 'utf8', cb);
      },

      //Parse the metadata and check if the template file exists
      function(meta, cb) {
        try {
          metaData = JSON.parse(meta);
        } catch(e) {
          return cb(new Error('Metadata could not be read.'));
        }
        
        templateFile = mt.root + '/' + metaData.template + '.ejs';
        fs.exists(templateFile, function(exists) {
          if(!exists) {
            return cb(new Error('Template file not found: ' + templateFile));
          }

          cb(null);
        });
      },

      //Load the template file
      function(cb) {
        fs.readFile(templateFile, 'utf8', cb);
      },

      //Set the cache and return a template object
      function(tplStr, cb) {
        mt.cache[name] = new Template(metaData, tplStr);
        mt.cache[name].toObject(data, mt.options, cb);
      }
    ], function(err, template) {
      if(err) {
        return callback(err, null);
      }

      callback(null, template);
    });
  }
};

module.exports = EasyMailTemplates;