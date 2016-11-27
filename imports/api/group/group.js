import  {LocalCollection} from 'meteor/minimongo'
import {SimpleSchema} from "meteor/aldeed:simple-schema";
import {AutoTable} from "meteor/cesarve:auto-table";
import {moment} from 'meteor/momentjs:moment'

const custom = function () {
    if (this.isUpdate && (!this.isSet || !this.value)) {
        return 'required'
    }
    return true
}

class GroupCollection extends Mongo.Collection {
    insert(group, callback) {
        return super.insert(group, callback);
    }

    remove(_id, callback) {
        return super.remove(_id, callback);
    }

    update(_id, modifier, callback) {
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
        /*
         if (group.adults || group.students) {
         group.adults = group.adults || 0
         group.students = group.students || 0
         modifier.$set.guests = group.students + group.adults
         }*/
        return super.update(_id, modifier, callback);
    }

}

const groupApplySchema = new SimpleSchema({
    familyId: {
        type: String,
        autoValue: function () {
            return this.userId
        }
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
    }
})


const schemaObject = {
    id: {
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
    location: {
        type: String,
        autoform: {
            afFormGroup: {
                //"formgroup-class": 'col-sm-3',
            }
        }
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
    guests: {
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
        type: Number,
        min: 1,
    },
    guestsTo: {
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
        allowedValues: ["potential", "confirmed", "cancelled"],
        autoform: {
            options: "allowed",
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
    notes: {
        type: String,
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
            afFormGroup: {
                //"formgroup-class": 'col-sm-6',
            }
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
    familiesApplying: {
        label: 'Are you happy to welcome',
        type: Array,
        optional: true,
    },
    "familiesApplying.$": {
        type: groupApplySchema,
        optional: true,
    }
}
const groupNewSchema = new SimpleSchema(_.pick(schemaObject, 'id', 'name'))
const groupEditNewSchema = new SimpleSchema(_.omit(schemaObject, 'id', 'name'))

groupEditNewSchema.messages({
    guestToMismatch: "[label] has to be more or equal than guest from"
})
groupApplySchema.messages({
    maximumMismatch: "[label] has to be more or equal than minimun"
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
        guests: true,
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
        key: 'dates.1',
        label: 'From',
        operator: '$eq',
        operators,
        render: function (val) {
            const m = moment(val)
            if (!m.isValid()) return val
            return m.format('Do MMM YYYY')
        },

    },
    {
        key: 'dates.2',
        label: 'To',
        operator: '$eq',
        operators,
        render: function (val) {
            const m = moment(val)
            if (!m.isValid()) return val
            return m.format('Do MMM YYYY')
        },


    },
    {
        key: 'nights',
        operator: '$eq',
        operators

    },
    {
        key: 'ages',
        operator: '$eq',
        operators

    },
    {
        key: 'city',
        operator: '$eq',
        operators

    },
    {
        key: 'location',
        label: 'Study Location',
        operator: '$eq',
        operators

    },
    {
        key: 'students',
        operator: '$eq',
        operators

    },
    {
        key: 'guests',
        label: 'Guests',
        operator: '$eq',
        operators

    },
    {
        key: 'guestsFrom',
        label: 'Guests from',
        operator: '$eq',
        operators,

    },
    {
        key: 'guestsTo',
        label: 'Guests to',
        operator: '$eq',
        operators,

    },

    {
        key: 'placed',
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
    location: {
        type: String,
        optional: true,
    },
    students: {
        type: Number,
        optional: true,
    },
    guests: {
        type: Number,
        optional: true,


    },
    guestsTo: {
        type: Number,
        optional: true,
    },
    guestsFrom: {
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
    availablePlacements: {
        type: Number,
        optional: true,
    },


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
        schema: groupFilterSchema,
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
const columnsFamilyAvailable = columnsKeys(['id', 'name', 'nationality', 'dates.1', 'dates.2', 'nights', 'ages', 'city', 'location'])
columnsFamilyAvailable.push({
    key: 'guest.home',
    label: 'Guest/home',
    render: function () {
        console.log('columnsFamilyAvailable render', this)
        if (this.guestsTo == this.guestsFrom) {
            return this.guestsTo
        }
        return this.guestsFrom + ' to ' + this.guestsTo
    }
})
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
        publishExtraFields: ['familiesApplying', 'guestsTo', 'guestsFrom'],
        settings: {
            options: {
                columnsSort: false,
                columnsDisplay: false,
                showing: true,
                filters: false,
            },
            msg: {
                noRecordsCriteria: 'There are not any groups available at this time',
            },
            klass: {
                tableWrapper: ''
            }
        },

    }
)

const columnsFamilyApplied = columnsKeys(['id', 'name', 'nationality', 'dates.1', 'dates.2', 'nights', 'ages', 'city', 'location'])
const capitalize = function (str) {
    if (typeof str == 'string')
        return str.charAt(0).toUpperCase() + str.slice(1);
}
columnsFamilyApplied.push({
    key: 'guest.home',
    label: 'Guest/home',
    render: function () {
        console.log('columnsFamilyAvailable render', this)
        if (this.guestsTo == this.guestsFrom) {
            return this.guestsTo
        }
        return this.guestsFrom + ' to ' + this.guestsTo
    }
})
columnsFamilyApplied.push({
    key: 'groupApply.gender',
    label: 'Gender Pref',
    render: function (val, path) {
        const groupApply = _.findWhere(this.familiesApplying, {familyId: Meteor.userId()})
        return capitalize(groupApply.gender)
    }

})
columnsFamilyApplied.push({
    key: 'groupApply.adults',
    label: 'Adults',
    render: function (val, path) {
        const groupApply = _.findWhere(this.familiesApplying, {familyId: Meteor.userId()})
        return capitalize(groupApply.adults)
    }
})
columnsFamilyApplied.push({
    key: 'guest.welcome',
    label: 'Welcome guests',
    render: function () {
        const groupApply = _.findWhere(this.familiesApplying, {familyId: Meteor.userId()})
        console.log('columnsFamilyApplied',groupApply)
        if (groupApply.minimum == groupApply.maximum) {
            return groupApply.minimum
        }
        return groupApply.minimum + ' to ' + groupApply.maximum
    }
})
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
        publishExtraFields: ['familiesApplying', 'guestsTo', 'guestsFrom'],
        settings: {
            options: {
                columnsSort: false,
                columnsDisplay: false,
                showing: true,
                filters: false,
            },
            msg: {
                noRecordsCriteria: 'You haven\'t apply for any groups yet',
            },
            klass: {
                tableWrapper: ''
            }
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