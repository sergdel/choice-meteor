/**
 * Created by cesar on 2/11/16.
 */
import {SimpleSchema} from "meteor/aldeed:simple-schema";
export const familySchema = new SimpleSchema({

    id: {
        type: String,
        optional,
    },
    name: {
        type: String,
        optional,
    },
    nationality: {
        type: String,
        optional,
    },
    dates: {
        type: String,
        optional,
    },
    nights: {
        type: String,
        optional,
    },
    ages: {
        type: String,
        optional,
    },
    city: {
        type: String,
        optional,
    },
    location: {
        type: String,
        optional,
    },
    guestsHome: {
        type: String,
        optional,
    },
    status: {
        type: String,
        allowed: ["potential", "confirmed", "cancelled"],
    },
    students:{
        type: Number,
        optional,
    },
    adults: {
        type: Number,
        optional,
    },
    placed: {
        type: Number,
        optional,
    },
    availablePlacements: {
        type: Number,
        optional,
    },


});
