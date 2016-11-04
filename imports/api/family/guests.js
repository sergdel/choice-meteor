/**
 * Created by cesar on 26/9/16.
 */
/**
 * Created by cesar on 26/9/16.
 */
import {SimpleSchema} from "meteor/aldeed:simple-schema";
import {genderType} from "./gender";
import {blueCardSchema} from "./bluecard";
const clonedGenderType=_.clone(genderType);
clonedGenderType.autoform.afFormGroup["formgroup-class"]= 'col-sm-3';
export const  guestSchema = new SimpleSchema({
    firstName: {
        optional: true,
        type: String,
        autoform: {
            afFormGroup: {
                "formgroup-class": 'col-sm-3',
            }
        }
    },
    surname: {
        optional: true,
        type: String,
        autoform: {
            afFormGroup: {
                "formgroup-class": 'col-sm-3',
            }
        }
    },
    gender: genderType,
    dateOfBirth: {
        autoform: {
            afFormGroup: {
                "formgroup-class": 'col-sm-3',
            }
        },
        optional: true,
        type: Date,
    },
    blueCard:{
        optional:true,
        type: blueCardSchema,
        autoform: {
            template: 'clean'
        }
    },
});