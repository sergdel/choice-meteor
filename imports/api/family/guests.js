/**
 * Created by cesar on 26/9/16.
 */
/**
 * Created by cesar on 26/9/16.
 */
import {SimpleSchema} from "meteor/aldeed:simple-schema";
import {genderType} from "./gender";
import {blueCardSchema} from "./bluecard";
const clonedGenderType = _.clone(genderType);
clonedGenderType.autoform.afFormGroup["formgroup-class"] = 'col-sm-3';
export const guestSchema = new SimpleSchema({
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
        optional: true,
        type: Date,
        autoform: {
            afFormGroup: {
                "formgroup-class": 'col-sm-3',
            },
            type: "daterangepicker",
            dateRangePickerOptions: {
                singleDatePicker: true,
                showDropdowns: true,
                maxDate: new Date(),
                locale: {
                    format: 'DD/MM/YYYY',
                },
            },
        },
    },
    blueCard: {
        optional: true,
        type: blueCardSchema,
        autoform: {
            template: 'clean'
        }
    },
});