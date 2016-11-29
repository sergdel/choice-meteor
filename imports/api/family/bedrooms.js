/**
 * Created by cesar on 26/9/16.
 */
/**
 * Created by cesar on 26/9/16.
 */
import {SimpleSchema} from "meteor/aldeed:simple-schema";
export const  bedroomSchema = new SimpleSchema({
    numberOfBeds: {
        optional: true,
        type: Number,
        autoform: {
            afFormGroup: {
                "formgroup-class": 'col-sm-3',
            }
        }
    },
    desk: {
        'label':'Desk',
        optional: true,
        type: Boolean,
        autoform: {
            afFormGroup: {
                "formgroup-class": 'col-sm-3',
            }
        }
    },
    clothesStorage: {
        optional: true,
        type: Boolean,
        autoform: {
            afFormGroup: {
                "formgroup-class": 'col-sm-3',
            }
        }
    },
    ensuite: {
        optional: true,
        type: Boolean,
        autoform: {
            afFormGroup: {
                "formgroup-class": 'col-sm-3',
            }
        }
    },
});