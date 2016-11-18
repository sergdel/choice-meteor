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
export const EmailTemplates = new Mongo.Collection('emailTemplates')

EmailTemplates.schema = new SimpleSchema({
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
})
EmailTemplates.attachSchema(EmailTemplates.schema)
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

})