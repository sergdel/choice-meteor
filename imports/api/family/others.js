/**
 * Created by cesar on 26/9/16.
 */

import {SimpleSchema} from "meteor/aldeed:simple-schema";
export const otherSchema = new SimpleSchema({
    preferredGender: {
        optional: true,
        type: String,
        allowedValues: ['either', 'female', 'male'],
        autoform: {
            options: 'allowed',
            capitalize: true,
            afFieldInput: {
                class: 'form-control'
            },
            afFormGroup: {
                "formgroup-class": 'col-md-3',
            }
        }
    },
    wiFiInternet: {
        optional: true,
        type: Boolean,
        autoform: {
            afFormGroup: {
                "formgroup-class": 'col-md-3',
            }
        }
    },
    /*schoolTransport: {
        optional: true,
        type: Boolean,
        autoform: {
            afFormGroup: {
                "formgroup-class": 'col-md-3',
            }
        }

    },*/
    drive: {
        optional: true,
        type: String,
        allowedValues: ['Yes', 'No', 'Maybe'],
        autoform: {
            options: 'allowed',
            afFormGroup: {
                "formgroup-class": 'col-md-3',
            }
        }

    },

    indoorSmoking: {
        optional: true,
        type: Boolean,
        autoform: {
            afFormGroup: {
                "formgroup-class": 'col-md-3',
            }
        }
    },
    dietaryNotes: {
        optional: true,
        type: String,
        autoform: {
            rows: 6,
            afFieldInput: {
                class: 'form-control'
            },
            afFormGroup: {
                "formgroup-class": 'col-sm-12   ',
            }
        }
    },
    familyInterests: {
        optional: true,
        type: String,
        autoform: {
            rows: 6,
            afFieldInput: {
                class: 'form-control'
            },
            afFormGroup: {
                "formgroup-class": 'col-sm-12',
            }
        }
    },
    contactDate: {
        type: Date,
        optional: true,

    },
});