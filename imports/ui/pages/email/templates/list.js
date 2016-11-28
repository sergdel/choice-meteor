import {EmailTemplates}  from "/imports/api/email/templates"
import {ReactiveVar}  from "meteor/reactive-var"
import './list.html'
import domtoimage from 'dom-to-image'
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
                    context.invoke('editor.insertNode', node.get(0), () => alert());
                    domtoimage.toPng(node.get(0))
                        .then(function (dataUrl) {
                            node.remove()
                            var img = new Image();
                            img.id = key
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
    return res
}



Template.emailTemplatesList.onCreated(function () {
    this.id = new ReactiveVar(false)
    this.autorun(() => {
        this.subscribe('EmailTemplate', this.id.get() )
    })
});

Template.emailTemplatesList.onRendered(function () {
    //add your statement here
});
Template.emailTemplatesList.helpers({
    id: () => Template.instance().id.get(),
    autoTable: EmailTemplates.autoTable,
    collection: EmailTemplates,
    doc: () => EmailTemplates.findOne(Template.instance().id.get()),
    settings: () => {
        const doc = EmailTemplates.findOne(Template.instance().id.get())
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

Template.emailTemplatesList.events({
    'click a.td'(e, instance){
        instance.id.set(this._id)
    }
});

Template.emailTemplatesList.onDestroyed(function () {
    //add your statement here
});

