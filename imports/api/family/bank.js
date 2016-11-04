/**
 * Created by cesar on 26/9/16.
 */

import {SimpleSchema} from "meteor/aldeed:simple-schema";
export const bankSchema = new SimpleSchema({
    bankName: {
        optional: true,
        type: String,
        autoform: {
            afFieldInput: {
                class: 'form-control'
            },
        }
    },
    accountName: {
        optional: true,
        type: String,
        autoform: {
            afFieldInput: {
                class: 'form-control'
            },
        }
    },
    accountBSB: {
        optional: true,
        type: String,
        autoform: {
            afFieldInput: {
                class: 'form-control'
            },
        }
    },
    accountNumber: {
        optional: true,
        type: String,
        autoform: {
            afFieldInput: {
                class: 'form-control'
            },
        }
    },
});