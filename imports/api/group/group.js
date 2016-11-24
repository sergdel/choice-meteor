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
        if (group.adults || group.students) {
            group.adults = group.adults || 0
            group.students = group.students || 0
            modifier.$set.guests = group.students + group.adults
        }
        return super.update(_id, modifier, callback);
    }

}
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
    adults: {
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
    guests: {
        type: Number,

        autoform: {
            type: 'readonly',
            class: 'readonly-bordered',
            afFormGroup: {
                //"formgroup-class": 'col-sm-3',
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
}
const groupNewSchema = new SimpleSchema(_.pick(schemaObject, 'id', 'name'))
const groupEditNewSchema = new SimpleSchema(_.omit(schemaObject, 'id', 'name'))


export const Groups = new GroupCollection('groups');
Groups.schemas = {
    new: groupNewSchema,
    edit: groupEditNewSchema,
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
        //homes: true,
        guests: true
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

const columns = [
    {
        key: 'id',
        operator: '$regex',
    },
    {
        key: 'name',
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
        operators: [  // Optional Array works for option filter
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
        ],

    },
    {
        key: 'dates.2',
        label: 'To',
        operator: '$eq',
        operators: [  // Optional Array works for option filter
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
        ],

    },
    {
        key: 'nights',
        operator: '$eq',
        operators: [  // Optional Array works for option filter
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
        ],

    },
    {
        key: 'ages',
        operator: '$eq',
        operators: [  // Optional Array works for option filter
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
        ],

    },
    {
        key: 'city',
        operator: '$eq',
        operators: [  // Optional Array works for option filter
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
        ],

    },
    {
        key: 'location',
        operator: '$eq',
        operators: [  // Optional Array works for option filter
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
        ],

    },
    {
        key: 'students',
        operator: '$eq',
        operators: [  // Optional Array works for option filter
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
        ],

    },
    {
        key: 'adults',
        operator: '$eq',
        operators: [  // Optional Array works for option filter
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
        ],

    },
    {
        key: 'guests',
        operator: '$eq',
        operators: [  // Optional Array works for option filter
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
        ],

    },
    {
        key: 'placed',
        operator: '$eq',
        operators: [  // Optional Array works for option filter
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
        ],

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
    adults: {
        type: Number,
        optional: true,

    },
    guests: {
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
            }
        },
        link: function (row) {
            return FlowRouter.path('groupEdit', {groupId: row._id})
        }
    }
)

Groups.autoTableFamilyAvailable = new AutoTable(
    {
        id: 'groupFamily',
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


Groups.aautoTableFamilyApplied = new AutoTable(
    {
        id: 'groupFamily',
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