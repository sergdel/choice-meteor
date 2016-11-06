/**
 * Created by cesar on 26/9/16.
 */
import {SimpleSchema} from "meteor/aldeed:simple-schema";
import {familyStatus} from "/imports/api/family/family-status";
import {hints} from'/imports/api/globals'

export const officeSchema = new SimpleSchema({
    familyStatusEmailTemplate: {
        optional: true,
        type: String,
        autoform: {
            type: 'hidden',

        }
    },
    familyStatus: {
        optional: true,
        allowedValues: _.pluck(familyStatus, 'id'),
        type: Number,
        autoform: {
            options:function () {
              return _.map(familyStatus,(status)=>{
                  console.log(status,{label: status.label, value: status.id});
                  return {label: status.label, value: status.id}
              })
            },
            firstOption: false,
            afFieldInput: {
                class: 'form-control'
            },
            afFormGroup: {
                "formgroup-class": 'col-sm-6',
            }
        }
    },

    familySubStatus: {
        optional: true,
        allowedValues: ["unreliable","active", "inactive"],
        type: String,
        autoform: {
            options: "allowed",
            capitalize: true,
            afFieldInput: {
                class: 'form-control'
            },
            afFormGroup: {
                "formgroup-class": 'col-sm-6',
            }
        }
    },

    familyScore: {
        optional: true,
        type: Number,
        decimal: true,
        max: 10,
        autoform: {
            type: 'raty',
            ratyOptions: {
                hints:hints,
            },
            afFormGroup: {
                "formgroup-class": 'col-sm-4',
            }
        },

    },

    homeScore: {
        optional: true,
        type: Number,
        decimal: true,
        max: 10,
        autoform: {
            type: 'raty',
            ratyOptions: {
                hints:hints,
            },
            afFormGroup: {
                "formgroup-class": 'col-sm-4',
            },

        },
    },
    score: {
        optional: true,
        type: Number,
        decimal: true,
        max: 10,
        autoform: {
            type: 'raty',
            ratyOptions: {
                hints:hints,
                readOnly    : true
            },
            afFormGroup: {
                "formgroup-class": 'col-sm-4',
            },

        },
    },
    tags: {
        optional: true,
        type: [String],
        autoform: {
            type: "select2",
            afFieldInput: {
                multiple: true,
                select2Options: {placeholder: 'foo', tags: true, theme: "bootstrap"},
            },
            afFormGroup: {
                "formgroup-class": 'col-sm-12',
            }
        }
    },
    files: {
        label: "Files",
        type: [String],
        optional: true,

    },
    "files.$": {
        optional: true,
        type: String,
        autoform: {
            afFieldInput: {
                type: 'fileUpload',
                collection: 'Files',
            }
        }
    },
});