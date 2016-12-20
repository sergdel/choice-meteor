/**
 * Created by cesar on 22/11/16.
 */
import {AutoTable} from "meteor/cesarve:auto-table";
import {familyStatus} from "/imports/api/family/family-status";
import {Tags} from "/imports/api/tags/tags";
import {Counts} from 'meteor/tmeasday:publish-counts'
const operators = [  // Optional Array works for option filter
    {
        label: 'Equal',
        shortLabel: '=',
        operator: '$eq',
    },
    {
        label: 'More than',
        shortLabel: '>',
        operator: '$gt',
    },
    {
        label: 'Less than',
        shortLabel: '<',
        operator: '$lt',
    },
    {
        label: 'More or equal than',
        shortLabel: '≥',
        operator: '$gte',
    },
    {
        label: 'Less or equal than',
        shortLabel: '≤',
        operator: '$lte',
    },
]

const columns = [

    {key: 'parents.0.firstName', operator: '$regex',},
    {key: 'parents.0.surname', operator: '$regex',},
    {key: 'contact.address.city', operator: '$regex',},
    {key: 'contact.address.suburb', operator: '$regex',},
    {key: 'blueCardStatus', label: 'Blue cards', operator: '$in',},
    {
        key: 'office.score', operator: '$eq', operators
    },
    {
        key: 'parentsCount', label: '# parents', operator: '$eq', operators
    },
    {
        key: 'childrenCount', label: '# children', operator: '$eq', operators
    },
    {
        key: 'guestsCount', label: '# guests', operator: '$eq', operators
    },
    {
        key: 'bedroomsCount', label: '# bedrooms', operator: '$eq', operators
    },
    {
        key: 'bedsCount', label: '# beds', operator: '$eq', operators

    },
    {key: 'office.tags', operator: '$in',},
    {
        key: 'office.familyStatus', label: 'Status', operator: '$in', render: function (val) {
        const status = _.findWhere(familyStatus, {id: val})
        return status && status.label || ''
    }
    },
    {key: 'office.familySubStatus', label: 'Sub-status', operator: '$in',},
    {key: 'other.preferredGender', label: 'Gender pref', operator: '$in',},

    {
        key: 'contactInfo', label: 'Contact',
        template: 'familyContact',
    },
    {key: 'groups.0.guests', label: 'Guests', operator: '$in',},
    {key: 'groups.0.gender', label: 'Gender', operator: '$in',},
    {key: 'groups.0.minimum', label: 'Min', operator: '$eq', operators},
    {key: 'groups.0.maximum', label: 'Max', operator: '$eq', operators},
    {key: 'groupsCount.applied', label: 'Applied', operator: '$eq', operators},
    {
        key: 'groupsCount.confirmed', label: 'Conflict', operator: '$eq', operators,
        render: function (val) {
            if (val > 0) {
                Meteor.call('checkGroupConflict', FlowRouter.getParam('groupId'), this._id, (err, conflict) => {
                    if (!err) {
                        const $b = $('#' + this._id)
                        const $i = $('#' + this._id).find('i')
                        $b.removeClass('label-warning')
                        $i.removeClass('fa-hand-paper-o')
                        if (_.isEmpty(conflict)) {
                            $i.addClass('fa-thumbs-o-up')
                            $b.addClass('label-success')
                        } else {
                            const content = Blaze.toHTMLWithData(Template.groupsConflict, {conflict})
                            $i.addClass('fa-thumbs-o-down')
                            $b.addClass('label-danger').popover({
                                content,
                                placement: 'left',
                                html: true,
                                trigger: "hover",
                            })
                        }
                    }
                })
                return '<span class="label label-warning"  id="' + this._id + '"><i class="fa fa-hand-paper-o "></i></span>'
            }
            return '<span class="label label-success"  id="' + this._id + '"><i class="fa  fa-thumbs-o-up"></i></span>'
        }
    },
    {
        key: 'action', label: 'Action', template: 'groupUpdateStatus'
    }
]


export const familyPlacementFilterSchema = new SimpleSchema({

    'groups.$.guests': {
        label: 'Guests', type: String, optional: true,
        autoform: {
            type: 'select-multi-checkbox-combo',
            allowedValues: [
                'any guests', 'only adults', 'only students', 'pref adults', 'pref students'
            ],
            autoform: {
                firstOption: false,
                capitalize: true,
            }
        },
    },
    'groups.$.gender': {
        label: 'Gender', type: String, optional: true,
        autoform: {
            type: 'select-multi-checkbox-combo',
            allowedValues: ['any', 'only female', 'only male', 'pref female', 'pref male'],
            autoform: {
                firstOption: false,
                capitalize: true,
            }
        },
    },
    'groups.$.minimum': {label: 'Min', type: Number, optional: true,},
    'groups.$.maximum': {label: 'Max', type: Number, optional: true,},
    "parents.$.firstName": {
        type: String,
        optional: true,
    },
    'parents.$.surname': {
        type: String,
        optional: true,
    },
    'contact.address.city': {
        type: String,
        optional: true,
    },
    'contact.address.suburb': {
        type: String,
        optional: true,
    },
    'blueCardStatus': {
        type: [String],
        optional: true,
        autoform: {
            type: 'select-multi-checkbox-combo',
            options: [
                {label: 'n/a', value: 'n/a',},
                {label: 'approved', value: 'approved',},
                {label: 'excempt', value: 'excempt',},
                {label: 'send', value: 'send',},
                {label: 'sent', value: 'sent',},
                {label: 'apply', value: 'apply',},
                {label: 'reapply', value: 'reapply',},
                {label: 'expired', value: 'expired',},
                {label: 'declined', value: 'declined',},
            ]
        },
    },
    'office.score': {
        type: Number,
        optional: true,
    },
    'parentsCount': {
        type: Number,
        optional: true,
    },
    'childrenCount': {
        type: Number,
        optional: true,
    },
    'guestsCount': {
        type: Number,
        optional: true,
    },
    'bedroomsCount': {
        type: Number,
        optional: true,
    },
    'bedsCount': {
        type: Number,
        optional: true,
    },
    'office.tags': {
        type: [String],
        optional: true,
        autoform: {
            type: 'select-multi-checkbox-combo',
            options: function () {
                return Tags.options()
            }
        },
    },
    'office.familyStatus': {
        type: [Number],
        optional: true,
        autoform: {
            type: 'select-multi-checkbox-combo',
            options: function () {
                return _.map(familyStatus, function (status) {
                    return {label: status.label, value: status.id}
                })
            },
        },
    },
    'office.familySubStatus': {
        type: [String],
        optional: true,
        autoform: {
            type: 'select-multi-checkbox-combo',
            options: [
                {label: 'unreliable', value: 'unreliable',},
                {label: 'active', value: 'active',},
                {label: 'inactive', value: 'inactive',},
            ]
        },
    },
    'other.preferredGender': {
        type: [String],
        optional: true,
        autoform: {
            type: 'select-multi-checkbox-combo',
            options: [
                {label: 'either', value: 'either',},
                {label: 'female', value: 'female',},
                {label: 'male', value: 'male',},
            ]
        },
    },
    'emails.address': {
        type: String,
        optional: true
    },
    'parents.mobilePhone': {
        type: String,
        optional: true
    },
    'contact.homePhone': {
        type: String,
        optional: true
    },
    'groupsCount.applied': {
        type: Number,
        optional: true,
    },
});

const columnsKeysOmit = function (keys) {
    const res = []
    for (const column of columns) {
        if (_.indexOf(keys, column.key) < 0)
            res.push(column)

    }
    return res
}
export const familiesPlacementAppliedAutoTable = new AutoTable(
    {
        id: 'familiesPlacementAppliedAutoTable',
        collection: Meteor.users,
        query: {roles: 'family'},
        publishExtraFields: ['roles', 'groups'],
        columns,
        publish: function (id, limit, query, sort) {
           if (!Roles.userIsInRole(this.userId, ['admin','staff'])) return this.ready()
            Counts.publish(this, 'atCounterfamiliesPlacementAppliedAutoTable', Meteor.users.find(query, {
                limit,
                sort
            }), {noReady: true});
            const groupId = query.groups.$elemMatch.groupId
            const cursor = Meteor.users.find(query, {
                fields: {
                    parents: 1,
                    "contact.address": 1,
                    blueCardStatus: 1,
                    office: 1,
                    parentsCount: 1,
                    childrenCount: 1,
                    guestsCount: 1,
                    bedroomsCount: 1,
                    bedsCount: 1,
                    roles: 1,
                    "other.preferredGender": 1,
                    "groupsCount": 1,
                    groups: {$elemMatch: {groupId}}
                }
                , sort, limit
            })
            return cursor
        },
        schema: familyPlacementFilterSchema,
        settings: {
            options: {
                columnsSort: true,
                columnsDisplay: true,
                showing: true,
                filters: true,
            },
            klass: {
                // tableWrapper: ''
            }
        },
        link: function (row, path) {
            if (path != 'action' && path != 'groupsCount.confirmed' && path != 'contactInfo')
                return FlowRouter.path('familyEdit', {familyId: row._id})
        }
    }
)

export const familiesPlacementConfirmedAutoTable = new AutoTable(
    {
        id: 'familiesPlacementConfirmedAutoTable',
        collection: Meteor.users,
        query: {roles: 'family'},
        publishExtraFields: ['roles', 'groups'],
        columns,
        publish: function (id, limit, query, sort) {
            if (!Roles.userIsInRole(this.userId, ['admin','staff'])) return this.ready()
            Counts.publish(this, 'atCounterfamiliesPlacementConfirmedAutoTable', Meteor.users.find(query, {
                limit,
                sort
            }), {noReady: true});
            const groupId = query.groups.$elemMatch.groupId
            const cursor = Meteor.users.find(query, {
                fields: {
                    parents: 1,
                    "contact.address": 1,
                    blueCardStatus: 1,
                    office: 1,
                    parentsCount: 1,
                    childrenCount: 1,
                    guestsCount: 1,
                    bedroomsCount: 1,
                    bedsCount: 1,
                    roles: 1,
                    "other.preferredGender": 1,
                    "groupsCount": 1,
                    groups: {$elemMatch: {groupId}}
                }
                , sort, limit
            })
            return cursor
        },
        schema: familyPlacementFilterSchema,
        settings: {
            options: {
                columnsSort: true,
                columnsDisplay: true,
                showing: true,
                filters: true,
            },
            klass: {
                // tableWrapper: ''
            }
        },
        link: function (row, path) {
            if (path != 'action' && path != 'contactInfo')
                return FlowRouter.path('familyEdit', {familyId: row._id})
        }
    }
)


export const familiesPlacementPotentialAutoTable = new AutoTable(
    {
        id: 'familiesPlacementPotentialAutoTable',
        collection: Meteor.users,
        query: {roles: 'family'},
        publishExtraFields: ['roles', 'groups'],
        columns: columnsKeysOmit(['groups.0.guests', 'groups.0.gender', 'groups.0.minimum', 'groups.0.maximum']),
        schema: familyPlacementFilterSchema,
        publish: function (id, limit, query, sort) {
            if (!Roles.userIsInRole(this.userId, ['admin','staff'])) return this.ready()
            Counts.publish(this, 'atCounterfamiliesPlacementPotentialAutoTable', Meteor.users.find(query, {
                limit,
                sort
            }), {noReady: true});
            const groupId = query.$and[0].$or[0]['groups.groupId'].$ne
            const cursor = Meteor.users.find(query, {
                fields: {
                    parents: 1,
                    "contact.address": 1,
                    blueCardStatus: 1,
                    office: 1,
                    parentsCount: 1,
                    childrenCount: 1,
                    guestsCount: 1,
                    bedroomsCount: 1,
                    bedsCount: 1,
                    roles: 1,
                    "other.preferredGender": 1,
                    "groupsCount": 1,
                    groups: {$elemMatch: {groupId}}
                }
                , sort, limit
            })
            return cursor
        },
        settings: {
            options: {
                columnsSort: true,
                columnsDisplay: true,
                showing: true,
                filters: true,
            },
            klass: {
                // tableWrapper: ''
            }
        },
        link: function (row, path) {
            if (path != 'action' && path != 'contactInfo')
                return FlowRouter.path('familyEdit', {familyId: row._id})
        }
    }
)
