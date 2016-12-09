/**
 * Created by cesar on 14/11/16.
 */

import {EmailTemplates}  from "/imports/api/email/templates"
import './edit.html'
//todo borrar toda esta pagiona quitarla pues esta y su html

Template.emailTemplatesEdit.onCreated(function () {
    this.autorun(() => {
        this.subscribe('EmailTemplate', FlowRouter.getParam('emailTemplateId'))
    })
});

Template.emailTemplatesEdit.onRendered(function () {
    //add your statement here
});

Template.emailTemplatesEdit.helpers({
    schema: EmailTemplates.schema.edit,
    doc: () => EmailTemplates.findOne(FlowRouter.getParam('emailTemplateId')),
    settings: () => {
        const doc = EmailTemplates.findOne(FlowRouter.getParam('emailTemplateId'))
        if (!doc) return {}
        const buttons = createButtons(doc.buttons)
        const settings = {
            height: 350,
            toolbar: [
                ['style', ['bold', 'italic', 'underline', 'clear']],
                ['font', ['strikethrough', 'superscript', 'subscript']],
                ['fontsize', ['fontsize']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['height']],
                ['misc', ['codeview', 'fullscreen']],
                ['Parameters', Object.keys(doc.buttons)]
            ],
            buttons
        }
        return settings
    }
});

Template.emailTemplatesEdit.events({

});

Template.emailTemplatesEdit.onDestroyed(function () {
    //add your statement here
});

