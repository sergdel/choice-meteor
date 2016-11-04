/**
 * Created by cesar on 26/9/16.
 */
import {SimpleSchema} from "meteor/aldeed:simple-schema";
export const petSchema = new SimpleSchema({
    type: {
        label: "Type of animal",
        allowedValues: ["Bird", "Cat", "Chicken", "Dog", "Duck", "Fish", "Goat", "Guinea Pig", "Horse", "Lizard", "Mouse", "Other", "Rabbit", "Rat", "Snake", "Wildlife"],
        type: String,
        autoform: {
            options: "allowed",
            capitalize: true,
            afFieldInput: {
                class: 'form-control'
            },
            afFormGroup: {
                "formgroup-class": 'col-xs-6',
            }
        }
    },
    status: {
        allowedValues: ["Indoor", "Outdoor"],
        type: String,
        autoform: {
            options: "allowed",
            capitalize: true,
            afFieldInput: {
                class: 'form-control'
            },
            afFormGroup: {
                "formgroup-class": 'col-xs-6',
                iconHelp: {
                    icon: 'fa fa-info-circle',
                    type: 'popover',
                    title: 'Status',
                    content: 'Indoor/Outdoor, if animal live inside the house or outside'
                },
            }
        }
    }
});