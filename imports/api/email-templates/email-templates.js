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
    id: {
        type: String,
    },
    subject: {
        type: String,
    },
    body: {
        type: String,
        autoform:{
            afFieldInput: {
                type: 'summernote',
                class: 'editor', // optional
                settings: {
                    height: 350,
                }// summernote options goes here
            },
        }
    },
    parameters: {
        type: [String]
    }
})
EmailTemplates.attachSchema(EmailTemplates.schema)
EmailTemplates.filterSchema = new SimpleSchema(EmailTemplates.schema.pick(['id', 'subject']), {
    body: {
        type: String,
    },
})

EmailTemplates.allow({
    insert: function (userId, doc) {
        return false
    },
    update: function (userId, doc, fields, modifier) {
       return Roles.userIsInRole(userId,'admin')
    },
    remove: function (userId, doc) {
        // can only remove your own documents
        return false
    },
    fetch:[],
})
EmailTemplates.autoTable=new AutoTable({
    id: 'EmailTemplates',
    collection: EmailTemplates,
    columns: [{key: 'id',label:'Email Template description'},{key: 'subject',label:'Subject'},{key: 'body',label:'Body'}],
    link: function(row){
        console.log('link',row,FlowRouter.path('emailTemplatesEdit',{emailTemplateId: row._id}))
        return FlowRouter.path('emailTemplatesEdit',{emailTemplateId: row._id})
    }
})