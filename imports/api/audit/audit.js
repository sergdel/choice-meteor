/**
 * Created by cesar on 16/11/16.
 */
import {Mongo} from 'meteor/mongo'
import {Meteor} from 'meteor/meteor'
import {_} from 'lodash'
import diff from 'recursive-diff'
import {familySchema} from '/imports/api/family/family'
import {AutoTable} from 'meteor/cesarve:auto-table'


class AuditCollection extends Mongo.Collection {
    insert({userId, type, docId, newDoc, oldDoc, where = 'families'}) {
        let res
        const user = Meteor.users.findOne(userId)
        const name = user.firstName
        const role = user.roles.pop()
        if (type == 'update') {
            let result = diff.getDiff(oldDoc, newDoc)


            for (let key in result) {

                let path = key.replace(/\//g, '.').substr(1)
                const regex = /\.(\d*)\./g
                result[key].path = path
                //result[key].field=familySchema.label(path)
                while (regex.test(path)) {
                    path = path.replace(regex, '[$1].')
                }
                path = path.replace(/\.(\d)$/, '[$1]')
                path = path.replace(/\[\.|\]](\d)$/, '[$1]')
                result[key].before = _.get(oldDoc, path)
                result[key].after = _.get(newDoc, path)

            }
            if (!_.isEmpty(result)) {
                return super.insert({
                    type,
                    where,
                    docId,
                    result,
                    role,
                    name,
                    userId,
                    timestamp: new Date()
                });
            }
            return 0
        }
        if (type == 'access') {
            return super.insert({
                type,
                where,
                docId,
                role,
                name,
                userId,
                timestamp: new Date()
            });
        }
        if (type == 'create') {
            return super.insert({
                type,
                where,
                docId,
                role,
                name,
                userId,
                timestamp: new Date()
            });
        }
        if (type == 'remove') {
            return super.insert({
                type,
                where,
                docId,
                role,
                name,
                userId,
                timestamp: new Date()
            });
        }
        throw new Meteor.Error('Audit type not recognise ')
    }

    update() {
        return
    }

    remove() {
        return
    }

    upsert() {
        return
    }

    find(selector, options) {
        return super.find(selector, options)
    }

}

export const Audit = new AuditCollection('auditLog')


const AuditFilterSchema = new SimpleSchema({
    type: {
        type: [String],
        optional: true,
        autoform: {
            type: 'select-multi-checkbox-combo',
            options: [
                {label: 'Accessed', value: 'access'},
                {label: 'Updated', value: 'update'},
                {label: 'Created', value: 'create'},
                {label: 'Removed', value: 'remove'}
            ]
        }
    },
    role: {
        type: [String],
        optional: true,
        autoform: {
            type: 'select-multi-checkbox-combo',
            options: [
                {label: 'Staff', value: 'staff'},
                {label: 'Admin', value: 'admin'},
                {label: 'Family', value: 'family'}],
        }
    },
    name: {
        type: String,
        optional: true,
    },
    userId: {
        label: 'Staff',
        type: [String],
        optional: true,
        autoform: {
            type: 'select-multi-checkbox-combo',
            options: function () {
                const staffs = Meteor.users.find({$or: [{roles: 'staff'}, {roles: 'admin'}]});
                return staffs.map((user) => {
                    return {label: user.firstName, value: user._id}
                })
            }
        }
    }
})

export const AuditAutoTable = new AutoTable({
    id: 'Audit',
    columns: [
        {key: 'name', operator: '$regex', label: 'Name'},
        {key: 'type', operator: '$in', label: 'Type'},
        {key: 'role', operator: '$in', label: 'Role'},
        {
            key: 'userId', operator: '$in', label: 'Staff', render: function (val, path) {
            return this.name
        }
        },
    ],
    collection: Audit,
    schema: AuditFilterSchema,
    settings: {
        options: {
            filters: true,
            showing: true,
        },
    },
    publishExtraFields: ['result', 'docId'],
    publish: function () {
        return true
        if (!Roles.userIsInRole(this.userId, 'admin')) {
            return false
        }
    },
    link: function (doc, key) {
        return ""
    }
})