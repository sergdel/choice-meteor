/**
 * Created by cesar on 14/11/16.
 */
/**
 * Created by cesar on 14/11/16.
 */
import {Mongo} from 'meteor/mongo'
import {AutoTable} from 'meteor/cesarve:auto-table'
import {SimpleSchema} from 'meteor/aldeed:simple-schema'
import {FlowRouter} from 'meteor/kadira:flow-router'
class ClassEmailTemplates extends Mongo.Collection{
    insert(doc){
        doc.from = doc.from || "no-replay@choicehomestay.com"
        doc.fromName = doc.fromName  || "Choice Home Stay"
        doc.type=doc.type || 'user'
        doc.campaign=doc.campaign || true
        doc.buttons =  doc.buttons || {
            "FirstName": {
                "contents": "First name",
                "tooltip": "First Name",
                "insertText": "<div class='label label-default'  style='display: inline-block; font: inherit !important'  >First name</div>"
            },
            "surname": {
                "contents": "Surname",
                "tooltip": "Surname",
                "insertText": "<div class='label label-default'  style='display: inline-block; font: inherit !important'  >Surname</div>"
            },
            "ConfirmedSummary": {
                "contents": "Confirmed Summary",
                "tooltip": "Confirmed Summary",
                "insertText": "<div class='label label-default'  style='display: inline-block; font: inherit !important'  >Confirmed Summary</div>"
            },

            "AppliedSummary": {
                "contents": "Applied Summary",
                "tooltip": "Applied Summary",
                "insertText": "<div class='label label-default'  style='display: inline-block; font: inherit !important'  >Applied Summary</div>"
            },
            "AvailableSummary": {
                "contents": "Available Summary",
                "tooltip": "Available Summary",
                "insertText": "<div class='label label-default'  style='display: inline-block; font: inherit !important'  >Available Summary</div>"
            },
        }

        return super.insert(doc)
    }
}
export const EmailTemplates = new ClassEmailTemplates('emailTemplates')

EmailTemplates.schema = {
    new: new SimpleSchema({
        description: {
            label: 'Description',
            type: String,
            unique: true,
            custom: function () {
                if (Meteor.isClient && this.isSet) {
                    Meteor.call("emailExist", this.value, function (error, result) {
                        if (result) {
                            EmailTemplates.schema.new.namedContext("templateNew").addInvalidKeys([{name: "description", type: "notUnique"}]);
                        }
                    });
                }
            }
        }
    }),
    edit:
        new SimpleSchema({
            description: {
                label: 'Description',
                type: String,
                autoform: {
                    afFieldInput: {
                        type: 'readonly',
                    }
                }
            },
            subject: {
                label: 'Subject',
                type: String,
                autoform: {
                    afFieldInput: {
                        type: 'summernote',
                        class: 'editor', // optional

                    },
                }
            },
            from: {
                type: String,
                autoform: {
                    afFieldInput: {
                        type: 'email',
                    }
                }
            },
            fromName: {
                optional: true,
                type: String,
            },
            body: {
                type: String,
                autoform: {
                    afFieldInput: {
                        type: 'summernote',
                        class: 'editor', // optional
                        settings: {
                            height: 350,
                        }// summernote options goes here
                    },
                }
            },
            buttons: {
                optional: true,
                type: Object,
                blackbox: true,
            }
        }),
    autoformGroupUpdateStatus:
        new SimpleSchema({
            subject: {
                label: 'Subject',
                type: String,
                autoform: {
                    afFieldInput: {
                        type: 'summernote',
                        class: 'editor', // optional
                        settings: {
                            toolbar:[],
                            height: 30,
                        }// summernote option
                    },
                }
            },
            from: {
                type: String,
                autoform: {
                    afFieldInput: {
                        type: 'email',
                    }
                }
            },
            fromName: {
                optional: true,
                type: String,
            },
            body: {
                type: String,
                autoform: {
                    afFieldInput: {
                        type: 'summernote',
                        class: 'editor', // optional
                        settings: {
                            toolbar: [],
                            height: 350,
                        }// summernote options goes here
                    },
                }
            },
        })

}
EmailTemplates.schema.new.messages({
    notUnique: "[label] already exist",
});



/*EmailTemplates.filterSchema = new SimpleSchema(EmailTemplates.schema.pick(['id', 'subject']), {
 body: {
 type: String,
 },
 })*/

EmailTemplates.deny({
    insert: function (userId, doc) {
        return true
    },
    update: function (userId, doc, fields, modifier) {
        return true
    },
    remove: function (userId, doc) {
        return true
    },
    fetch: [],
})
EmailTemplates.allow({
    insert: function (userId, doc) {
        return false
    },
    update: function (userId, doc, fields, modifier) {
        return false
    },
    remove: function (userId, doc) {
        // can only remove your own documents
        return false
    },
    fetch: [],
})
EmailTemplates.autoTable = new AutoTable({
    id: 'emailTemplatesList',
    collection: EmailTemplates,
    columns: [{key: 'description', label: 'Description'}, {key: 'subject', label: 'Subject'}],
    publish: function () {
        return Roles.userIsInRole(this.userId, ['admin','staff'])
    },

})