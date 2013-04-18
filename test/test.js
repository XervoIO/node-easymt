var EMT = require('../lib/mail-templates');
EMT.get('test', {heading:'TEST!!!!'}, function(err, template) {
  console.log(err || template);
});
