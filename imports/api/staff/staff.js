import {phoneSchema} from "/imports/api/family/phones";
/**
 * Created by cesar on 28/9/16.
 */
export const staffSchema = new SimpleSchema({
    email: {
        type: String,
        regEx: SimpleSchema.RegEx.Email,
        custom: function () {

            if (Meteor.isClient && this.isSet) {
                const isNotThisFamilyId = this.isUpdate ? this.docId : null;
                Meteor.call("emailExist", this.value, isNotThisFamilyId, (error, exist)=> {
                    if (exist === true) {
                        staffSchema.namedContext("staffForm").addInvalidKeys([{name: this.key, type: "notUnique"}]);
                    }
                });
            }
        }
    },
    firstName: {
        type: String
    },
    surname: {
        type: String
    },
    phones: {
        optional: true,
        type: [Object]
    },
    "phones.$": {
        type: phoneSchema,
        autoform: {
            atts: {
                template: "bootstrap3"
            }
        }
    },
    roles: {
        label: "Roles",
        type: [String],
        allowedValues: ['inactive','admin', 'staff'],
        autoform: {
            options: function () {
                return [
                    {label: "Inactive", value: "inactive"},
                    {label: "Staff", value: "staff"},
                    {label: "Admin", value: "admin"},
                ]
            },
            type: "select-radio-inline",
            afFormGroup: {
                iconHelp: {
                    title: 'Roles',      //required, allowed values any String
                    content: 'You can\'t inactivete your self',  //required if type is 'popover'
                    type: 'popover',               //optional, allowed values  'popover'|'tooltip',  'tooltip' as default
                    icon: 'fa fa-info-circle',             //optional, allowed values  any Glyphicons normaly 'info-sign' or 'question-sign'  'info-sign' as default. ('glyphicon glyphicon-' is include)
                }
            }
        },
        custom: function () {
            if (this.isSet && this.docId == this.userId && Array.isArray(this.value) && this.value[0]!='admin') {
                staffSchema.namedContext("staffForm").addInvalidKeys([{name: this.key, type: "inactivateYourSelf"}]);
            }
        }
    },
});
staffSchema.messages({
    notUnique: "[label] already exist",
    inactivateYourSelf: 'You can\'t inactivate yourself'
});
