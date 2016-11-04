/**
 * Created by cesar on 26/9/16.
 */
import {familySchema} from "./family";
import {genderType} from "./gender";
import {SimpleSchema} from "meteor/aldeed:simple-schema";
import {blueCardSchema} from "./bluecard";
export const parentSchema = new SimpleSchema({
    email: {
        type: String,
        regEx: SimpleSchema.RegEx.Email,
        custom: function () {
            if (Meteor.isClient && this.isSet) {
                const isNotThisFamilyId=this.isUpdate ? this.docId : null;
                Meteor.call("emailExist", this.value, isNotThisFamilyId , (error, exist)=> {
                    if (exist === true && (this.isInsert || this.isUpdate)) {
                        familySchema.namedContext("familyForm").addInvalidKeys([{
                            name: this.key,
                            type: "notUnique"
                        }])
                    }
                })
            }
        },
        autoform: {
            afFormGroup: {
                "formgroup-class": 'col-sm-4',
            }
        }
    },
    firstName: {
        optional: true,
        type: String,
        autoform: {
            afFormGroup: {
                "formgroup-class": 'col-sm-4',
            }
        }
    },
    surname: {
        optional: true,
        type: String,
        autoform: {
            afFormGroup: {
                "formgroup-class": 'col-sm-4',
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
            }
        }
    },
    birthCountry: {
        optional: true,
        type: String,
        autoform: {
            afFormGroup: {
                "formgroup-class": 'col-sm-3',
            }
        }
    },
    mobilePhone: {
        optional: true,
        type: String,
        autoform: {
            afFormGroup: {
                "formgroup-class": 'col-sm-3',
            }
        }
    },
    blueCard:{
        optional:true,
        type: blueCardSchema,
        autoform: {
            template: 'clean'
        }
    },

});