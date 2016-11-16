/**
 * Created by cesar on 14/11/16.
 */
import {EmailTemplates} from '/imports/api/email-templates/email-templates'
import './edit.html'
import domtoimage from 'dom-to-image'
console.log('domtoimage', domtoimage)
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
                    const node = $(buttons[key].insertText)
                    context.invoke('editor.insertNode', node.get(0),()=>alert());
                    domtoimage.toPng(node.get(0))
                        .then(function (dataUrl) {
                            node.remove()
                            var img = new Image();
                            img.id=key
                            img.src = dataUrl;
                            document.body.appendChild(img);
                            context.invoke('editor.insertNode', img);
                        })
                        .catch(function (error) {
                            console.error('oops, something went wrong!', error);
                        });

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
    settings: ()=> {
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
                ['misc', ['codeview','fullscreen']],
                ['Parameters', Object.keys(doc.buttons)]
            ],
            buttons
        }
        return settings
    }
});

Template.emailTemplatesEdit.events({
    //add your events here
});

Template.emailTemplatesEdit.onDestroyed(function () {
    //add your statement here
});

