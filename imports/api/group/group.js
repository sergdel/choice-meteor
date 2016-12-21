import  {LocalCollection} from 'meteor/minimongo'
import {SimpleSchema} from "meteor/aldeed:simple-schema";
import {AutoTable} from "meteor/cesarve:auto-table";
import {moment} from 'meteor/momentjs:moment'
import {Families} from '/imports/api/family/family'
import {Distances, Locations} from '/imports/api/location/location'
import {BlueCard} from '/imports/api/blue-card/blue-card'
import {FlowRouter} from 'meteor/kadira:flow-router'
import {Audit} from '/imports/api/audit/audit'
import {Email} from 'meteor/email'


const custom = function () {
    if (this.isUpdate && (!this.isSet || !this.value)) {
        return 'required'
    }
    return true
}
const renderGuest = function () {
    const guestsTo = this.guestsTo || ''
    const guestsFrom = this.guestsFrom || ''
    if (guestsTo == guestsFrom) {
        return guestsTo
    }
    return guestsFrom + ' to ' + guestsTo
}

class GroupCollection extends Mongo.Collection {
    find(selector, options) {
        if (_.isObject(selector) && !selector.status) {
            selector = _.extend(selector, {status: {$ne: "removed"}})
        }
        return super.find(selector, options);
    }

    insert(group, callback) {
        Groups.attachSchema(Groups.schemas.new, {replace: true})
        group.requirements = ["Share time and talk with guests each day", "Provide three quality meals and snacks each day", "Provide drop-off and pick-up to & from school each day", "Provide each guest with an individual comfortable bed (no bunks)", "Don't have other student of the same nationality in the home during their visit"]
        return super.insert(group, callback);
    }

    remove(groupId, callback) {
        Families.removeGroups(groupId)
        return super.update(groupId, {$set: {status: "removed"}});
    }

    updateBySelector(selector, modifier, options) {
        return super.update(selector, modifier, options);
    }

    update(_id, modifier, options) {
        if (typeof _id != 'string') {
            throw new Meteor.Error('Use only _id as selector for Groups collection, otherwise use updateBySelector')
        }
        Groups.attachSchema(Groups.schemas.edit)
        Groups.attachSchema(Groups.schemas.new)
        const group = super.findOne(_id)
        if (!group) {
            throw new Meteor.Error(404, 'Group not found!')
        }
        //calc modified group doc
        LocalCollection._modify(group, modifier)
        modifier.$set = modifier.$set || {}
        //calc nights
        if (group.dates && Array.isArray(group.dates) && group.dates.length == 2) {
            const date0 = moment(group.dates[0])
            const date1 = moment(group.dates[1])
            modifier.$set.nights = date1.diff(date0, 'days')
        }
        return super.update(_id, modifier, options);
    }

    updateStatusTo(status, groupId, familyId, userId) {

        Families.updateGroupStatusTo(status, familyId, groupId)
        super.update({
            _id: groupId,
            status: {$ne: "removed"},
            "families.familyId": familyId,
        }, {$set: {"families.$.status": status}})
        const group = super.findOne(groupId, {fields: {families: 1}})
        const oldStatus = _.findWhere(group.families, {familyId}).status
        const groupNew = super.findOne(groupId, {fields: {families: 1, id: 1, name: 1}})
        const applied = (groupNew && groupNew.families && _.where(groupNew.families, {status: 'applied'}).length) || 0
        const confirmed = (groupNew && groupNew.families && _.where(groupNew.families, {status: 'confirmed'}).length) || 0
        const canceled = (groupNew && groupNew.families && _.where(groupNew.families, {status: 'canceled'}).length) || 0
        super.update(groupId, {$set: {applied, confirmed, canceled}}, {filter: false})
        Audit.insert({
            userId: userId,
            type: 'update',
            familyId: familyId,
            docId: groupId,
            description: groupNew.id + ' ' + groupNew.name,
            newDoc: {status: status},
            oldDoc: {status: oldStatus},
            where: 'groups'
        })
        //send the email
    }
    apply(groupId, familyId, data, userId) {
        //todo better performance, insted find ans update 3 times, use $inc
        data.status = 'applied'
        Groups.attachSchema(Groups.schemas.edit, {replace: true})
        //update the data into family table
        Families.applyGroup(familyId, groupId, data)
        //look for the old group (if exist)
        const groupOld = super.findOne({_id: groupId, "families.familyId": familyId}) || {}
        const groupExists = !_.isEmpty(groupOld)
        //if exists this is the info
        const oldData = _.findWhere(groupOld.families || [], {familyId}) || {}
        //remove the old data
        super.update({
            _id: groupId,
            status: {$ne: "removed"}
        }, {$pull: {"families": {familyId: {$eq: familyId}}}}, {filter: false})
        //add the new data (is like update but works for edition and cretion
        super.update({_id: groupId, status: {$ne: "removed"}}, {$addToSet: {families: data}}, {filter: false})
        const groupNew = super.findOne(groupId, {fields: {families: 1, id: 1, name: 1}})
        const applied = (groupNew && groupNew.families && _.where(groupNew.families, {status: 'applied'}).length) || 0
        const confirmed = (groupNew && groupNew.families && _.where(groupNew.families, {status: 'confirmed'}).length) || 0
        const canceled = (groupNew && groupNew.families && _.where(groupNew.families, {status: 'canceled'}).length) || 0
        super.update(groupId, {$set: {applied, confirmed, canceled}}, {filter: false})
        Audit.insert({
            userId: userId,
            type: groupExists ? 'update' : 'create',
            docId: groupId,
            description: groupNew.id + ' ' + groupNew.name,
            familyId: familyId,
            newDoc: data,
            oldDoc: oldData,
            where: 'groups'
        })

        return
    }

    cancelApply(groupId, familyId, userId) {
        //todo better performance, insted find ans update 3 times, use $inc
        Groups.attachSchema(Groups.schemas.edit, {replace: true})
        Families.cancelGroup(familyId, groupId)
        const group = super.findOne(groupId, {fields: {families: 1, id: 1, name: 1}})
        const oldData = _.findWhere(group.families || [], {familyId}) || {}
        super.update(groupId, {$pull: {"families": {familyId: familyId, status: 'applied'}}}, {filter: false})
        const groupNew = super.findOne(groupId, {fields: {families: 1, id: 1, name: 1}})
        const applied = (groupNew && groupNew.families && _.where(groupNew.families, {status: 'applied'}).length) || 0
        const confirmed = (groupNew && groupNew.families && _.where(groupNew.families, {status: 'confirmed'}).length) || 0
        const canceled = (groupNew && groupNew.families && _.where(groupNew.families, {status: 'canceled'}).length) || 0
        super.update(groupId, {$set: {applied, confirmed, canceled}}, {filter: false})
        Audit.insert({
            userId: userId,
            type: 'remove',
            docId: groupId,
            description: groupNew.id + ' ' + groupNew.name,
            familyId: familyId,
            newDoc: {},
            oldDoc: oldData,
            where: 'groups'
        })
        return
    }

}
const groupApplySchema = new SimpleSchema({
    familyId: {
        type: String,
        optional: true,
    },
    guests: {
        label: 'Guests',
        type: String,
        allowedValues: [
            'any guests', 'only adults', 'only students', 'pref adults', 'pref students'
        ],
        autoform: {
            firstOption: false,
            capitalize: true,
        }
    },
    gender: {
        label: 'Gender Pref',
        type: String,
        allowedValues: ['any', 'only female', 'only male', 'pref female', 'pref male'],
        autoform: {
            firstOption: false,
            capitalize: true,
        }
    },
    minimum: {
        label: 'Minimum number of guests you can welcome',
        type: Number,
        min: 1,
    },
    maximum: {
        label: 'Maximum number of guests you can welcome',
        type: Number,
        min: 1,
        custom: function () {
            if (this.value < this.field('minimum').value) {
                return "maximumMismatch";
            }
        }
    },
    comments: {
        label: 'Comments (optional)',
        type: String,
        optional: true,
        autoform: {
            rows: 4,
        }
    },
    status: {
        type: String,
        optional: true,
        autoValue: function () {
            if (this.isInsert) {
                return 'applied'
            }
        }
    }
})


const schemaObject = {
    id: {
        label: 'ID',
        type: String,
        autoform: {
            afFormGroup: {
                //"formgroup-class": 'col-sm-6',
            }
        }
    },
    name: {
        type: String,
        autoform: {
            afFormGroup: {
                //"formgroup-class": 'col-sm-6',
            }
        }
    },
    nationality: {
        type: String,
        autoform: {
            afFormGroup: {
                //"formgroup-class": 'col-sm-3',
            }
        }
    },
    dates: {
        type: [Date],
        autoform: {
            type: "daterangepicker",
            dateRangePickerOptions: {
                minDate: moment(),
                timePicker: false,
                locale: {
                    format: 'DD/MM/YYYY',
                },
                linkedCalendars: false,
            },
            afFormGroup: {
                //"formgroup-class": 'col-sm-3',
            }
        }
    },

    nights: {
        type: Number,
        autoform: {
            type: 'readonly',
            class: 'readonly-bordered',
            afFormGroup: {
                //"formgroup-class": 'col-sm-3',
            }
        },

    },


    ages: {
        type: String,
        autoform: {
            afFormGroup: {
                //"formgroup-class": 'col-sm-3',
            }
        }
    },
    city: {
        type: String,
        autoform: {
            afFormGroup: {
                //"formgroup-class": 'col-sm-3',
            }
        }
    },
    locationId: {
        label: 'Location',
        type: String,
        optional: true,
        autoform: {
            options: function () {
                return Locations.find({}).map((loc) => {
                    return {value: loc._id, label: loc.name}
                })
            }
        }

    },
    location: {
        type: String,
        optional: true,
        autoValue: function () {
            if (Meteor.isServer) {
                const locationId = this.field('locationId') && this.field('locationId').value
                if (locationId) {
                    const location = Locations.findOne(locationId)
                    console.log(this.field('locationId'), location)
                    return location && location.name
                }
            }

        }
    },
    travelDuration: {
        type: Number,
        optional: true,
        min: 0
    },

    students: {
        min: 0,
        type: Number,
        autoform: {
            afFormGroup: {
                //"formgroup-class": 'col-sm-3',
            }
        }
    },
    adults: {
        label: 'Adults',
        min: 0,
        type: Number,
        autoform: {
            afFormGroup: {
                //"formgroup-class": 'col-sm-3',
            }
        }

    }, /*
     homes: {
     min: 0,
     type: Number,
     autoform: {
     type: 'readonly',
     class: 'readonly-bordered',
     afFormGroup: {
     //"formgroup-class": 'col-sm-3',
     }
     }
     },*/
    guestsFrom: {
        label: 'From guests/home',
        type: Number,
        min: 1,
    },
    payments: {
        label: 'Payment',
        type: String,
        optional: true,
        autoform: {
            rows: 4,

        },

    },
    guestsTo: {
        label: 'To guests/home',
        type: Number,
        min: 1,
        custom: function () {
            if (this.value < this.field('minimum').value) {
                return "guestsToMismatch";
            }
        }
    },
    status: {
        type: String,
        allowedValues: ["potential", "confirmed", "cancelled", "removed"],
        autoform: {
            options: [
                {value: "potential", label: "potential"},
                {value: "confirmed", label: "confirmed"},
                {value: "cancelled", label: "cancelled"},
            ],
            capitalize: true,
            defaultValue: "potential",
            afFormGroup: {
                //"formgroup-class": 'col-sm-3',
            }
        }
    },
    placed: {
        type: Number,

        autoform: {
            type: 'readonly',
            class: 'readonly-bordered',
            afFormGroup: {
                //"formgroup-class": 'col-sm-3',
            }
        },
        autoValue: function () {
            if (this.isInsert) {
                return 0
            }
        },
    },
    availablePlacements: {
        type: Number,
        label: 'Applied',
        optional: true,
        autoform: {
            type: 'readonly',
            class: 'readonly-bordered',

        },
        autoValue: function () {
            if (this.isInsert) {
                return 0
            }
        },
    },
    applied: {
        type: Number,
        label: 'Applied',
        optional: true,
        autoform: {
            type: 'readonly',
            class: 'readonly-bordered',

        },
        autoValue: function () {
            if (this.isInsert) {
                return 0
            }
        },
    },
    confirmed: {
        type: Number,
        label: 'Confirmed',
        optional: true,
        autoform: {
            type: 'readonly',
            class: 'readonly-bordered',

        },
        autoValue: function () {
            if (this.isInsert) {
                return 0
            }
        },
    },
    canceled: {
        type: Number,
        label: 'Confirmed',
        autoform: {
            type: 'readonly',
            class: 'readonly-bordered',

        },
        autoValue: function () {
            if (this.isInsert) {
                return 0
            }
        },
    },
    notes: {
        type: String,
        optional: true,
        autoform: {
            rows: 4,
            afFormGroup: {
                //"formgroup-class": 'col-sm-12',
            }
        },
    },
    supervisorsName: {
        label: "Supervisor's Name",
        type: String,
        autoform: {
            afFormGroup: {
                //"formgroup-class": 'col-sm-6',
            }
        },
    },
    supervisorsMobile: {
        label: "Supervisor's Mobile",
        type: String,
        autoform: {
            afFormGroup: {
                //"formgroup-class": 'col-sm-6',
            }
        },
    },
    requirements: {
        label: "Group Requirements",
        optional: true,
        type: [String],
        autoform: {
            type: 'select-checkbox-create-option',
            options: [
                {
                    label: "Share time and talk with guests each day",
                    value: "Share time and talk with guests each day"
                },
                {
                    label: "Provide three quality meals and snacks each day",
                    value: "Provide three quality meals and snacks each day"
                },
                {
                    label: "Provide drop-off and pick-up to & from school each day",
                    value: "Provide drop-off and pick-up to & from school each day"
                },
                {
                    label: "Provide each guest with an individual comfortable bed (no bunks)",
                    value: "Provide each guest with an individual comfortable bed (no bunks)"
                },
                {
                    label: "Don't have other student of the same nationality in the home during their visit",
                    value: "Don't have other student of the same nationality in the home during their visit"
                }],
        },
    },
    other: {
        label: "Other Hosting Terms",
        optional: true,
        type: String,
        autoform: {
            rows: 5,
            afFormGroup: {
                //"formgroup-class": 'col-sm-6',
            }
        },

    },
    families: {
        label: 'Are you happy to welcome',
        type: Array,
        optional: true,
    },
    "families.$": {
        type: groupApplySchema,
        optional: true,
    },
    "familiesApplying": {
        type: Array,
        optional: true,
    },
    "familiesApplying.$": {
        type: groupApplySchema,
        optional: true,
    },

}

const newObj = (_.pick(schemaObject, 'id', 'name'))
newObj.requirements = {
    optional: true,
    type: [String]
}
const groupNewSchema = new SimpleSchema(newObj)
const groupEditNewSchema = new SimpleSchema(_.omit(schemaObject, 'id', 'name'))

groupEditNewSchema.messages({
    guestToMismatch: "[label] has to be more or equal than guest from"
})
groupApplySchema.messages({
    maximumMismatch: "[label] has to be more or equal than minimum"
})

export const Groups = new GroupCollection('groups');
Groups.schemas = {
    new: groupNewSchema,
    edit: groupEditNewSchema,
    apply: groupApplySchema,
}


/**
 * Publishable fields
 * @type {{}}
 */
Groups.fields = {
    staff: {},
    family: {
        id: true,
        name: true,
        nationality: true,
        dates: true,
        nights: true,
        ages: true,
        city: true,
        location: true,
        students: true,
        adults: true,
        guestsFrom: true,
        guestsTo: true,
    }
}
Groups.attachSchema(Groups.schemas.new);
Groups.attachSchema(Groups.schemas.edit);
Groups.deny({
    insert: () => true,
    update: () => true,
    remove: () => true,
})
Groups.allow({
    insert: () => false,
    update: () => false,
    remove: () => false,
})
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
    }
]
const columns = [
    {
        key: 'id',
        operator: '$regex',
    },
    {
        key: 'name',
        label: 'Group Name',
        operator: '$regex',
    },
    {
        key: 'nationality',
        operator: '$regex',
    },
    {
        key: 'city',
        operator: '$regex',

    },
    {
        key: 'location',
        label: 'Study Location',
        operator: '$regex',

    },
    {
        key: 'dates.0',
        label: 'From',
        operator: '$gte',
        operators,
        render: function (val) {
            const m = moment(val)
            if (!m.isValid()) return val
            return m.format('Do MMM YYYY')
        },

    },
    {
        key: 'dates.1',
        label: 'To',
        operator: '$gte',
        operators,
        render: function (val) {
            const m = moment(val)
            if (!m.isValid()) return val
            return m.format('Do MMM YYYY')
        },


    },
    {
        key: 'applied',
        label: 'Applied',
        operator: '$eq',
        operators,
    },
    {
        key: 'confirmed',
        label: 'Confirmed',
        operator: '$eq',
        operators,
    },
    {
        key: 'nights',
        operator: '$regex',

    },
    {
        key: 'ages',
        operator: '$regex',

    },

    {
        key: 'students',
        operator: '$eq',
        operators

    },
    {
        key: 'adults',
        label: 'Adults',
        operator: '$eq',
        operators

    },
    {
        key: 'guestsFromTo',
        label: 'Guests/home',
        render: renderGuest
    },

    {
        key: 'placed',
        operator: '$eq',
        operators
    },
    {
        key: 'status',
        operator: '$in',
    },
    {
        key: 'payments',
        label: 'Payment',
        operator: '$regex',
    },
    {
        key: 'travel.duration.value',
        label: 'Travel duration',
        render: function () {
            return this && this.travel && this.travel.duration.text
        }
    },
    {
        key: 'availableFamilies',
        label: 'Available families',
        operator: '$eq',
        operators
    },

]


let groupFilterSchema = new SimpleSchema({
    id: {
        type: String,
        optional: true,
    },
    name: {
        type: String,
        optional: true,
    },
    nationality: {
        type: String,
        optional: true,
    },
    dates:{
      type: [Date],
        optional: true,
    },
    "dates.$": {
        type: Date,
        optional: true,
    },
    nights: {
        type: Number,
        optional: true,
    },
    ages: {
        type: String,
        optional: true,
    },
    city: {
        type: String,
        optional: true,
    },
    locationId: {
        type: String,
        optional: true,
        autoform: {
            options: function () {
                return Locations.find({}).map((loc) => {
                    return {value: loc._id, label: loc.name}
                })
            }
        }

    },
    location: {
        type: String,
        optional: true,
        autoValue: function () {
            if (Meteor.isServer) {
                const location = Locations.find(this.field('locationId'))
                return location && location.name
            }

        }
    },
    students: {
        type: Number,
        optional: true,
    },
    adults: {
        type: Number,
        optional: true,


    },

    status: {
        type: String,
        optional: true,
        autoform: {
            type: 'select-multi-checkbox-combo',
            options: [
                {label: 'potential', value: 'potential',},
                {label: 'confirmed', value: 'confirmed',},
                {label: 'cancelled', value: 'cancelled',},
            ]
        },
    },
    placed: {
        type: Number,

        optional: true,
    },
    applied: {
        label: 'Applied',
        type: Number,
        optional: true,
    },
    confirmed: {
        label: 'Cconfirmed',
        type: Number,
        optional: true,
    },
    payments: {
        label: 'Payment',
        type: String,
        optional: true,
    },
    availableFamilies:{
        type: String,
        optional: true,
    }

})

const columnsKeys = function (keys) {
    const res = []
    for (const column of columns) {
        if (_.indexOf(keys, column.key) >= 0)
            res.push(column)

    }
    return res
}

Groups.autoTableStaff = new AutoTable(
    {
        id: 'groupStaff',
        collection: Groups,
        columns,
        publishExtraFields: ['guestsTo', 'guestsFrom'],
        schema: groupFilterSchema,
        publish: function (id, limit, query, sort) {

            if (!Roles.userIsInRole(this.userId, ['admin', 'staff'])) {
                return this.ready()
            }

            const self = this;
            const publishGroups = []
            let count=0

            self.added('counts', 'atCounter' + id, {count})
            var handle = Groups.find(query).observeChanges({
                added: function (groupId, group) {
                    let availableFamiliesQuery = {}
                    const dates = group.dates
                    if (dates && dates[0] && dates[1] && (dates[0] instanceof Date) && (dates[1] instanceof Date)) {
                        availableFamiliesQuery = ({
                            $or: [
                                {availability: {$exists: 0}},
                                {
                                    //dates0 and dates1 can not be between a confirmed group
                                    "availability.dates.0": {$not: {$gte: dates[0], $lte: dates[1]}},
                                    "availability.dates.1": {$not: {$gte: dates[0], $lte: dates[1]}},
                                    //dates and wrapped a dates of confirmed group
                                    $or: [
                                        {"availability.dates.0": {$gte: dates[1]}},
                                        {"availability.dates.1": {$lte: dates[0]}}
                                    ]
                                }
                            ]

                        })
                    }
                    group.availableFamilies = Families.find(availableFamiliesQuery).count()
                    count++
                    self.changed('counts', 'atCounter' + id, {count})
                    self.added("groups", groupId, group);
                },
                changed: function (groupId, group) {
                    let availableFamiliesQuery = {}
                    const dates = group.dates
                    if (dates && dates[0] && dates[1] && (dates[0] instanceof Date) && (dates[1] instanceof Date)) {
                        availableFamiliesQuery = ({
                            $or: [
                                {availability: {$exists: 0}},
                                {
                                    //dates0 and dates1 can not be between a confirmed group
                                    "availability.dates.0": {$not: {$gte: dates[0], $lte: dates[1]}},
                                    "availability.dates.1": {$not: {$gte: dates[0], $lte: dates[1]}},
                                    //dates and wrapped a dates of confirmed group
                                    $or: [
                                        {"availability.dates.0": {$gte: dates[1]}},
                                        {"availability.dates.1": {$lte: dates[0]}}
                                    ]
                                }
                            ]

                        })
                    }
                    group.availableFamilies = Families.find(availableFamiliesQuery).count()
                    count++
                    self.changed('counts', 'atCounter' + id, {count})
                    self.added("groups", groupId, group);

                }
                ,
                removed: function (groupId) {
                        count --
                        self.removed("groups", groupId);
                        self.changed('counts', 'atCounter' + id, {count})

                }
            });
            self.ready();
            self.onStop(function () {
                handle.stop();
            });
            return false
        },
        settings: {
            options: {
                columnsSort: true,
                columnsDisplay: true,
                showing: true,
                filters: true,
            },
            klass: {
                tableWrapper: ''
            }
        },
        link: function (row) {
            return FlowRouter.path('groupEdit', {groupId: row._id})
        }
    }
)
const columnsFamilyAvailable = columnsKeys(['id', 'name', 'nationality', 'dates.0', 'dates.1', 'nights', 'ages', 'city', 'location', 'travel.duration.value'])
columnsFamilyAvailable.push({
    key: 'guest.home',
    label: 'Guest/home',
    render: renderGuest
})
columnsFamilyAvailable.push(columnsKeys(['payments'])[0])
columnsFamilyAvailable.push({
    key: 'action',
    label: 'Action',
    render: () => '<button class="btn btn-default btn-xs applyGroup  pull-right">Apply <i class="fa fa-hand-o-down"></i></button>'
})

Groups.autoTableFamilyAvailable = new AutoTable(
    {
        id: 'groupFamilyAvailable',
        collection: Groups,
        columns: columnsFamilyAvailable,
        schema: groupFilterSchema,
        publishExtraFields: ['families', 'guestsTo', 'guestsFrom'],
        settings: {
            options: {
                columnsSort: true,
                columnsDisplay: false,
                showing: true,
                filters: true,
            },
            msg: {
                noRecords: 'There are not any groups available at this time',
            },
            klass: {
                //   tableWrapper: ''
            }
        },
        publish: function (id, limit, query, sort) {


            if (!Roles.userIsInRole(this.userId, ['admin', 'staff', 'family'])) {
                return this.ready()
            }
            const self = this;
            //"families": {$elemMatch: {status:  "confirmed", familyId:
            console.log('publish query', query)
            let familyId = query && query.$and && query.$and[0] && query.$and[0]["families.familyId"] && query.$and[0]["families.familyId"].$ne
            if (!familyId) {
                familyId = query && query["families.familyId"] && query["families.familyId"]["$ne"]
                console.error('check this please publish !!', id, limit, query, sort)
            }
            const publishGroups = []
            self.added('counts', 'atCounter' + id, {count: 0})


            var handle = Groups.find(query).observeChanges({
                added: function (groupId, group) {
                    const maxDuration = group.travelDuration || 35
                    let distance = Distances.findOne(familyId + '|' + group.locationId)
                    const duration = (distance && distance.travel && distance.travel.duration && distance.travel.duration.value) || 0
                    if (maxDuration >= duration) {
                        if (distance && distance.travel)
                            group.travel = distance.travel
                        publishGroups.push(groupId)

                        self.changed('counts', 'atCounter' + id, {count: publishGroups.length})
                        self.added("groups", groupId, group);
                    }
                },
                changed: function (groupId, group) {
                    const groupNew = Groups.findOne(groupId)
                    const maxDuration = group.travelDuration || 35
                    let distance = Distances.findOne(familyId + '|' + groupNew.locationId)
                    const duration = (distance && distance.travel && distance.travel.duration && distance.travel.duration.value) || 0
                    const index = publishGroups.indexOf(groupId)
                    if (maxDuration >= duration) {
                        if (distance && distance.travel) {
                            group.travel = distance.travel
                            groupNew.travel = distance.travel
                        }
                        if (index >= 0) {
                            self.changed("groups", groupId, group)
                        } else {
                            publishGroups.push(groupId)
                            self.added("groups", groupId, groupNew);
                            self.changed('counts', 'atCounter' + id, {count: publishGroups.length})
                        }
                    } else {
                        if (index >= 0) {
                            publishGroups.splice(index, 1);
                            self.removed("groups", groupId);
                            self.changed('counts', 'atCounter' + id, {count: publishGroups.length})
                        }
                    }

                }
                ,
                removed: function (groupId) {
                    const index = publishGroups.indexOf(groupId)
                    if (index >= 0) {
                        publishGroups.splice(index, 1);
                        self.removed("groups", groupId);
                        self.changed('counts', 'atCounter' + id, {count: publishGroups.length})
                    }

                }
            });
            self.ready();
            self.onStop(function () {
                handle.stop();
            });
            return false
        },
        link: function (row, path) {
            if (path != 'action' && Roles.userIsInRole(Meteor.userId(), ['staff', 'admins'])) {
                return FlowRouter.path('groupEdit', {groupId: row._id})
            }
            return ''
        }

    }
)

const columnsFamilyApplied = columnsKeys(['id', 'name', 'nationality', 'dates.0', 'dates.1', 'nights', 'ages', 'city', 'location'])
const capitalize = function (str) {
    if (typeof str == 'string')
        return str.charAt(0).toUpperCase() + str.slice(1);
}
columnsFamilyApplied.push({
    key: 'guest.home',
    label: 'Guest/home',
    render: renderGuest
})
columnsFamilyApplied.push({
    key: 'families.gender',
    label: 'Gender Pref',
    render: function (val, path) {
        const groupApply = _.findWhere(this.families, {familyId: FlowRouter.getParam('familyId') || Meteor.userId()})
        if (!groupApply) return
        return capitalize(groupApply.gender)
    }

})
columnsFamilyApplied.push({
    key: 'families.guests',
    label: 'Guest Pref',
    render: function (val, path) {
        const groupApply = _.findWhere(this.families, {familyId: FlowRouter.getParam('familyId') || Meteor.userId()})
        if (!groupApply) return
        return capitalize(groupApply.guests)
    }
})
columnsFamilyApplied.push({
    key: 'guest.welcome',
    label: 'Welcome guests',
    render: function () {
        const groupApply = _.findWhere(this.families, {familyId: FlowRouter.getParam('familyId') || Meteor.userId()})
        if (!groupApply) return
        if (groupApply.minimum == groupApply.maximum) {
            return groupApply.minimum
        }
        return groupApply.minimum + ' to ' + groupApply.maximum
    }
})
columnsFamilyApplied.push(columnsKeys(['payments'])[0])
columnsFamilyApplied.push({
    key: 'action',
    label: 'Action',
    render: () => '<button class="btn btn-default btn-xs applyGroup pull-right">Update <i class="fa fa-pencil"></i></button>'
})
Groups.autoTableFamilyApplied = new AutoTable(
    {
        id: 'groupFamilyApplied',
        collection: Groups,
        columns: columnsFamilyApplied,
        schema: groupFilterSchema,
        publish: function () {
            return Roles.userIsInRole(this.userId, ['family','admin','staff'])
        },
        publishExtraFields: ['families', 'guestsTo', 'guestsFrom'],
        settings: {
            options: {
                columnsSort: true,
                columnsDisplay: false,
                showing: true,
                filters: true,
            },
            msg: {
                noRecords: 'You haven\'t apply for any groups yet',
            },
            klass: {
                //  tableWrapper: ''
            }
        },

        link: function (row, path) {
            if (path != 'action' && Roles.userIsInRole(Meteor.userId(), ['staff', 'admins'])) {
                return FlowRouter.path('groupEdit', {groupId: row._id})
            }
            return ''
        }
    }
)
columnsFamilyApplied.pop()
Groups.autoTableFamilyConfirmed = new AutoTable(
    {
        id: 'groupFamilyConfirmed',
        collection: Groups,
        columns: columnsFamilyApplied,
        schema: groupFilterSchema,
        publishExtraFields: ['families', 'guestsTo', 'guestsFrom'],
        publish: function () {
            return Roles.userIsInRole(this.userId, ['family','admin','staff'])
        },
        settings: {
            options: {
                columnsSort: true,
                columnsDisplay: false,
                showing: true,
                filters: true,
            },
            msg: {
                noRecords: 'There are not any groups confirmed at this time',
            },
            klass: {
                //  tableWrapper: ''
            }
        },

        link: function (row, path) {
            if (path != 'action' && Roles.userIsInRole(Meteor.userId(), ['staff', 'admins'])) {
                return FlowRouter.path('groupEdit', {groupId: row._id})
            }
            return ''
        }
    }
)


/*

 Groups.autoTable = new AutoTable(
 {
 id: 'groupStaff',
 collection: Groups,
 columns,
 schema: groupFilterSchema,
 settings: {
 options: {
 columnsSort: true,
 columnsDisplay: true,
 showing: true,
 filters: true,
 }
 }
 }
 )

 */