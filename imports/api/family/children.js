/**
 * Created by cesar on 26/9/16.
 */
import {SimpleSchema} from "meteor/aldeed:simple-schema";
import {blueCardSchema} from "./bluecard";
export const childSchema = new SimpleSchema({
    firstName: {
        optional: true,
        type: String,
        autoform: {
            afFormGroup: {
                "formgroup-class": 'col-sm-3',
            }
        }
    },
    gender: {
        optional: true,
        type: String,
        allowedValues: ['female', 'male'],
        autoform: {
            options: 'allowed',
            capitalize: true,
            afFieldInput: {
                class: 'form-control'
            },
            afFormGroup: {
                "formgroup-class": 'col-sm-3',
            }
        }
    },
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

        }
    },
    nameOfSchool: {
        optional: true,
        type: String,
        autoform: {
            afFormGroup: {
                "formgroup-class": 'col-sm-3',
            }
        }
    },
    blueCard: {
        optional: true,
        type: blueCardSchema,
        autoform: {
            template: 'clean'
        }
    },

});