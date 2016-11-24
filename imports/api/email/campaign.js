/**
 * Created by cesar on 18/11/16.
 */
import {Families} from '/imports/api/family/family'
import {AutoTable} from 'meteor/cesarve:auto-table'
import {SimpleSchema} from 'meteor/aldeed:simple-schema'
import {EmailTemplates} from '/imports/api/email/templates'
const emailFamilyFilter = new SimpleSchema({
    'emails.$.address': {
        label: 'Email',
        type: String,
        optional: true,
    },
    'parents.$.firstName': {
        label: 'First name',
        type: String,
        optional: true,
    },
    'parents.$.surname': {
        label: 'Surname',
        type: String,
        optional: true,
    }

})
export const campaignAutoTable = new AutoTable({
    id: 'campaignList',
    columns: [
        {
            key: 'emails.0.address',
            label: 'Email',
            operator: '$regex'
        },
        {
            key: 'parents.0.firstName',
            label: 'First name',
            operator: '$regex'
        },
        {
            key: 'parents.0.surname',
            label: 'Surname',
            operator: '$regex'
        },
    ],
    collection: Meteor.users,
    query: {roles: 'family'},
    publishExtraFields:['roles'],
    schema: emailFamilyFilter,
    settings: {
        options: {
            filters: true,
            showing: true,
        }
    },
    publish: function () {
        console.log('publish ' , this.userId, Roles.userIsInRole(this.userId,'admin'))
        return Roles.userIsInRole(this.userId,'admin')
    }

})

//export const Campaign = new Mongo.Collection('campaign')

export const campaignSchema = new SimpleSchema({
    'name': {
        type: String,
    },
    query: {
        type: Object,
        blackbox: true,
        //optional: true,
        autoform: {
            type: 'auto-table',
            at: campaignAutoTable,
        }
    },
    template: {
        type: String,
        autoform: {
            options: function () {
                return EmailTemplates.find('enrollAccount').map((template) => {
                    return {value: template._id, label: template.description}
                })
            },
        }
    }
})
