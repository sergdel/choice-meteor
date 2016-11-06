/**
 * Created by cesar on 3/10/16.
 */
import {hints} from'/imports/api/globals'


export const adultSchema = new SimpleSchema({
    status: {
        type: String,
        optional: true,
        allowedValues: ['n/a', 'applying', 'approved', 'declined'],
        autoform: {

            options: [
                {
                    label: 'N/A',
                    value: 'n/a'
                },
                {
                    label: 'Applying',
                    value: 'applying'
                },
                {
                    label: 'Approved',
                    value: 'approved'
                },
                {
                    label: 'Declined',
                    value: 'declined'
                }
            ]
        },
        autoValue: function () {
            if (!this.isSet)
                return 'n/a'
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
            },


        },
    },
    requirements: {
        label: "Are you comfortable providing for all of the listed requirements",
        type: Boolean,
        autoform: {
            defaultValue: true,
            firstOption: false,
            type: "boolean-radios",
            trueLabel: "Yes",
            falseLabel: "No, I have some questions or concerns I want to discuss",
        }
    },
    activities1: {
        label: "What activities will you share with your guests on the evening of their arrival, from 3pm?",
        type: String,
        autoform: {
            rows: 3
        }
    },
    activities2: {
        label: "What ways will you share your 2nd evening with your guests (e.g. talking, playing games, watching a movie)",
        type: String,
        autoform: {
            rows: 3
        }
    },
    highlights: {
        optional: true,
        label: "What are some of the promotional highlights of your home",
        type: [String],
        autoform: {
            type: "select-checkbox-create-option",
            options: function () {
                return [
                    {label: "Air conditioning bedroom/s", value: "Air conditioning bedroom/s"},
                    {label: "Waterfront", value: "Waterfront"},
                    {label: "Within 10 minutes walk of the beach", value: "Within 10 minutes walk of the beach"},
                    {label: "Swimming pool", value: "Swimming pool"},
                    {label: "Tennis court", value: "Tennis court"},
                    {label: "Guest bedroom/s have ensuite", value: "Guest bedroom/s have ensuite"}
                ];
            }
        }
    },
    description: {
        optional: true,
        label: "Please provide a description of your family and for guests (optional)",
        type: String,
        autoform: {
            rows: 3
        }
    },
    welcome: {
        optional: true,
        label: "Please provide a welcome piece for guests (optional) ",
        type: String,
        autoform: {
            rows: 3
        }
    },
    photos: {
        label: "Please share some photos of your family & home for us to share privately with potential guests ",
        type: [String],
        optional: true,

    },
    "photos.$": {
        optional: true,
        type: String,
        autoform: {
            afFieldInput: {
                type: 'fileUpload',
                collection: 'Files',
            }
        }
    }

});


//adultSchema.messages({
//    required: "Please complete this field.",
//})

