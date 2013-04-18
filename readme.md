# Easy Mail Templates

EasyMT gives you a simple way to store and use email templates. Using [ejs templates](https://github.com/visionmedia/ejs) and some metadata, you can have email templates up and working in a matter of minutes. There are only a few steps to follow to get up and running.

## Install

    npm install easymt

## Create Some Templates
You can store the templates anywhere you like, relative to the root of your app. By default, *templates* is used as the directory.

Each template needs two files, a **metadata** file and a **tempalate** file. Wherever you put them, they need to be stored in the same folder.

### Metadata File
The metadata file is a JSON file and contains some needed metadata for your template. This is also where your define what template file will be used. An example template file might look something like this:

    //mytemplate.json
    {
      "subject": "This is an email!",
      "template": "mytemplate"
    }

Currently, there are only two options.
**subject** - The subject for the email.
**template** - The name of the template file, minus the extension.

### Template File
This is the actual EJS file. It follows all the rules for EJS templates, and should use the extension *.ejs*.

    <!--mytemplate.ejs-->
    <html>
      <body>
        <h1><%=heading%></h1>
      </body>
    </html>

## Use EasyMT
All you need to do now is include EasyMT and use it to get your template. 

### easymt.get(name, data, callback)
**name** - the name of the template, IE the filename of the template's metadata file.
**data** - the data to pass to the template
**callback(err, template)**

EasyMT will search for the metadata file then load in the template subject and body based on that metadata. Errors will be returned if the metadata or template file are not found.
    
    var easymt = require('easymt');
    easymt.get('mytemplate', {heading:'HELLO WORLD'}, function(err, template) {
      //use template
    });

Each template object returned has the following properties available.
**subject** - The subject loaded from the metadata
**body** - The rendered body of the template.

### easymt.init(templateDir, options)
**templateDir** - Directory (relative to the application root) that the template files are stored in.
**options** - The EJS options to pass when rendering the template.

Using the `init` function is optional, but allows you to setup a few things you may want to be customized. Calling it during the `require` call is the easiest way to set things up.

    var easymt = require('easymt').init('path/to/templates', {open:'{{',close:'}}'});