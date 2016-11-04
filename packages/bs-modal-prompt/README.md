# bootstrap-modal-prompt


A fork from  https://atmospherejs.com/theduke/bootstrap-modal-prompt but with some new features and fixed bugs 
This [Atmosphere package](https://atmospherejs.com/cesarve77/bootstrap-modal-prompt) for [Meteor](http://meteor.com) makes it really easy to show a confirm dialog with custom content to the user, and get the result. You can also use a custom template for the content, and even specify a SimpleSchema to generate a form with AutoForm and get the form data in a callback.

Version: 0.1.0

## Installation

```bash
meteor add cesarve:bootstrap-modal-prompt
```

## Requirements

Twitter Bootstrap 3 needs to be present. 
You can manually include it in your project, or use one of the many Bootstrap packages, like https://atmospherejs.com/twbs/bootstrap.

## Usage

### Prompt

* Show a simple dialog with text content:

```javascript
BootstrapModalPrompt.prompt({
    title: "Confirm something",
    content: "Do you really want to confirm whatever?"
}, function(result) {
  if (result) {
    // User confirmed it, so go do something.
  }
  else {
    // User did not confirm, do nothing.
  }
});
```

* Use a custom template and, customize the button text: 

```javascript

 BootstrapModalPrompt.prompt({
    title: "Confirm something",
    template: Template.myCustomTemplate,

    templateData: {
      customKey: 333
    },
    btnDismissText: 'Forget it!',
    btnOkText: 'Alright, let\'s do it!'
}, function (data) {
    if (data) {
        console.log(data);
    }
    else {
        console.log('cancel')
    }
});
            

```

* Render an AutoForm with a SimpleSchema, and receive the data in the callback.

```javascript

 BootstrapModalPrompt.prompt({
    title: "Confirm something",
    template: Template.myCustomTemplate,
    autoform: {
        collection: "MyCollections",
        type: "insert",
        id: 'insertMyCollection',
        buttonContent: false,
        omitFields: omitFields
    },
    templateData: {
      customKey: 333
    },
    btnDismissText: 'Forget it!',
    btnOkText: 'Alright, let\'s do it!'
}, function (data) {
    if (data) {
        console.log(data);
    }
    else {
        console.log('cancel')
    }
});
```



### Hide

* Hide the current modal

```javascript
BootstrapModalPrompt.hide();
```

## API & Options

BootstrapModalPrompt.prompt(options, callback);

The following options are supported:

Option | Description
------ | -----------
title | The modal title
content | A string that will be used as the modal body content
template | A Meteor Template instance that should be rendered as the body content (supersedes "content")
templateData | an object with data that will be available to the custom template
dialogTemplate | A Meteor Template instance that should be rendered as the modal dialog (supersedes 'content' and 'template') (works with templateData)
btnDismissText | Text of the dismiss button - set to null to hide
btnOkText | Text of the confirm button - set to null to hide
beforeShow | Callback that will be called before the modal is displayed. Receives the options and the modal DOM node as arguments
afterShow | Callback that will be called once the modal is displayed and all transitions are complete. Receives the options and the modal DOM node as arguments
beforeHide | Callback that will be called before the modal is hidden. Receives the options and the modal DOM node as arguments
afterHide | Callback that will be called once the modal is hidden and all transitions are completed. Receives the options and the modal DOM node as arguments
onConfirm | Callback that is called when the user clicks the confirm button. Receives the options and the modal DOM node as arguments. *If this function returns false, the confirmation is aborted and the modal will not be hidden.*
autoform: quickForm options [https://github.com/aldeed/meteor-autoform#quickform]
        // is ussefull set buttonContent: false,


## License

This project is under the MIT License.

## Authors

* Christoph Herzog - chris@theduke.at

### Contributor

* Cesar Ramos
