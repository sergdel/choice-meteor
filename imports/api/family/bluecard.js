/**
 * Created by cesar on 30/10/16.
 */
import moment from 'moment'
export const blueCardSchema = new SimpleSchema({
    number: {
        optional: true,
        type: String,
        autoform: {
            afFormGroup: {
                "formgroup-class": 'col-sm-4',
            },
            afFieldInput: {
                class: 'form-control'
            },
        }
    },
    expiryDate: {
        optional: true,
        type: Date,
        autoform: {
            afFormGroup: {
                "formgroup-class": 'col-sm-4',
            },
            afFieldInput: {
                class: 'form-control'
            },
        }
    },
    status: {
        optional: true,
        type: String,
        allowedValues: ['apply', 'applying', 'approved', 'declined', 'expired', 'n/a'],
        autoform: {
            options: function (x) {
                const parent = this.name.replace('blueCard.status', 'dateOfBirth');
                const dateOfBirth = AutoForm.getFieldValue(parent, AutoForm.getFormId());
                if (!dateOfBirth) {
                    return [
                        {label: 'Apply', value: 'apply'},
                        {label: 'Applying', value: 'applying'},
                        {label: 'Approved', value: 'approved'},
                        {label: 'Declined', value: 'declined'},
                        {label: 'Expired', value: 'expired'},
                        {label: 'n/a', value: 'n/a'}]
                }
                if (dateOfBirth instanceof Date && moment(dateOfBirth).add(18, 'years').toDate() <= new Date()) {
                    return [
                        {label: 'Apply', value: 'apply'},
                        {label: 'Applying', value: 'applying'},
                        {label: 'Approved', value: 'approved'},
                        {label: 'Declined', value: 'declined'},
                        {label: 'Expired', value: 'expired'}]
                }
                return [{label: 'n/a', value: 'n/a'}]
            },
            afFieldInput: {
                class: 'form-control'
            },
            afFormGroup: {
                "formgroup-class": 'col-sm-4'
            }
        }
    }
});
/*
 Template.registerHelper('afFieldValueIs', function autoFormFieldValueIs(options) {
 options = parseOptions(options, 'afFieldValueIs');

 var currentValue = AutoForm.getFieldValue(options.name, options.formId);
 return currentValue === options.value;
 });

 */