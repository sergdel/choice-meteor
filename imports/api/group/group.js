import  {LocalCollection} from 'meteor/minimongo'
import {SimpleSchema} from "meteor/aldeed:simple-schema";
import moment from 'moment'

const custom = function () {
    if (this.isUpdate && (!this.isSet || !this.value)) {
        console.log('this.isUpdate  this.isSet', this.isUpdate, !this.isSet, !this.value)
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
const groupNewSchema = new SimpleSchema({
    id: {
        type: String,
        autoform: {
            afFormGroup: {
                "formgroup-class": 'col-sm-6',
            }
        }
    },
    name: {
        type: String,
        autoform: {
            afFormGroup: {
                "formgroup-class": 'col-sm-6',
            }
        }
    }
})
const groupEditNewSchema = new SimpleSchema({
    nationality: {
        type: String,
        autoform: {
            afFormGroup: {
                "formgroup-class": 'col-sm-4',
            }
        }
    },
    dates: {
        type: [Date],
        autoform: {
            type: "bs-date-range-picker",
            rangeDatePickerOptions: {
                minDate: moment(),
                timePicker: false,
                locale: {
                    format: 'DD/MM/YYYY',
                },
                linkedCalendars: false,
            },
            afFormGroup: {
                "formgroup-class": 'col-sm-7',
            }
        }
    },

    nights: {
        type: Number,
        autoform: {
            type: 'readonly',
            class: 'readonly-bordered',
            afFormGroup: {
                "formgroup-class": 'col-sm-1',
            }
        },

    },
    ages: {
        type: String,
        autoform: {
            afFormGroup: {
                "formgroup-class": 'col-sm-4',
            }
        }
    },
    city: {
        type: String,
        autoform: {
            afFormGroup: {
                "formgroup-class": 'col-sm-4',
            }
        }
    },
    location: {
        type: String,
        autoform: {
            afFormGroup: {
                "formgroup-class": 'col-sm-4',
            }
        }
    },
    students: {
        min: 0,
        type: Number,
        autoform: {
            afFormGroup: {
                "formgroup-class": 'col-sm-3',
            }
        }
    },
    adults: {
        min: 0,
        type: Number,
        autoform: {
            afFormGroup: {
                "formgroup-class": 'col-sm-3',
            }
        }

    },
    homes: {
        min: 0,
        type: Number,
        autoform: {
            afFormGroup: {
                "formgroup-class": 'col-sm-3',
            }
        }
    },
    guests: {
        type: Number,

        autoform: {
            type: 'readonly',
            class: 'readonly-bordered',
            afFormGroup: {
                "formgroup-class": 'col-sm-3',
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
                "formgroup-class": 'col-sm-4',
            }
        }
    },
    placed: {
        type: Number,

        autoform: {
            type: 'readonly',
            class: 'readonly-bordered',
            afFormGroup: {
                "formgroup-class": 'col-sm-4',
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
                "formgroup-class": 'col-sm-4',
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
                "formgroup-class": 'col-sm-12',
            }
        },
    },
    supervisorsName: {
        label: "Supervisor's Name",
        type: String,
        autoform: {
            afFormGroup: {
                "formgroup-class": 'col-sm-6',
            }
        },
    },
    supervisorsMobile: {
        label: "Supervisor's Mobile",
        type: String,
        autoform: {
            afFormGroup: {
                "formgroup-class": 'col-sm-6',
            }
        },
    },
    requirements: {
        label: "Group Requirements",
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
                "formgroup-class": 'col-sm-6',
            }
        },
    },
    other: {
        label: "Other Hosting Terms",
        type: String,
        autoform: {
            rows: 5,
            afFormGroup: {
                "formgroup-class": 'col-sm-6',
            }
        },
    }

})

export const Groups = new GroupCollection('groups');
Groups.schemas = {
    new: groupNewSchema,
    edit: groupEditNewSchema,
}
/**
 * Publishable fields
 * @type {{}}
 */
Groups.fields = {}
Groups.attachSchema(Groups.schemas.new);
Groups.attachSchema(Groups.schemas.edit);
Groups.deny({
    insert: ()=>true,
    update: ()=>true,
    remove: ()=>true,
})
Groups.allow({
    insert: ()=>false,
    update: ()=>false,
    remove: ()=>false,
})