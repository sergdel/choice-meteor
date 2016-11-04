/**
 * Created by cesar on 29/9/16.
 */
import {SimpleSchema} from 'meteor/aldeed:simple-schema'
export const phoneSchema=new SimpleSchema({
    typePhone:{
        label: "Type",
        type: String,
        allowedValues: ['mobile','home','office','other'],
        autoform:{
            options: 'allowed',
            capitalize: true
        }
    },
    phone:{
        type: String
    }
});