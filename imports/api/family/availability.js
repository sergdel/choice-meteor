/**
 * Created by cesar on 26/9/16.
 */
import {SimpleSchema} from "meteor/aldeed:simple-schema";


export const availabilitySchema = new SimpleSchema({
    dates: {
        type: [Date],
        optional: true,
        autoform:{
            type: 'daterangepicker',
            afFormGroup: {
                "formgroup-class": 'col-sm-6',
            }
        }
    },
    reason: {
        label: 'Reason (optional)',
        type: String,
        optional: true,
        autoform:{
            afFormGroup: {
                "formgroup-class": 'col-sm-6',
            }
        }
    }
})