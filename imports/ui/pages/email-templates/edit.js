/**
 * Created by cesar on 14/11/16.
 */
import {EmailTemplates} from '/imports/api/email-templates/email-templates'
import './edit.html'


const createButtons = function (buttons) {
    const res = {}
    for (let key in buttons) {
        res[key] = function (context) {
            var ui = $.summernote.ui;
            // create button
            var button = ui.button({
                contents: buttons[key].contents,
                tooltip: buttons[key].tooltip,
                click: function () {
                    // invoke insertText method with 'hello' on editor module.
                    context.invoke('editor.insertText', buttons[key].insertText);
                }
            });
            return button.render();   // return button as jquery object

        }
    }
    console.log('createButtons', res)
    return res
}


Template.emailTemplatesEdit.onCreated(function () {
    this.autorun(()=> {
        this.subscribe('EmailTemplate', FlowRouter.getParam('emailTemplateId'))
    })
});

Template.emailTemplatesEdit.onRendered(function () {
    //add your statement here
});

Template.emailTemplatesEdit.helpers({
    collection: EmailTemplates,
    doc: ()=>EmailTemplates.findOne(FlowRouter.getParam('emailTemplateId')),
    settings: {
        height: 350,
        toolbar: [
            ['mybutton',['name']]
        ],
        buttons: {
            name: function (context) {
                console.log('context',context)
                var ui = $.summernote.ui;
                // create button
                var button = ui.button({
                    contents: 'cesar',
                    tooltip: 'ramos',
                    click: function () {
                        // invoke insertText method with 'hello' on editor module.
                        context.invoke('editor.insertText', 'nermde');
                    }
                });
                return button.render();   // return button as jquery object

            }
        }
    }
});

Template.emailTemplatesEdit.events({
    //add your events here
});

Template.emailTemplatesEdit.onDestroyed(function () {
    //add your statement here
});

