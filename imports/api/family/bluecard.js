/**
 * Created by cesar on 30/10/16.
 */
import {moment} from 'meteor/momentjs:moment'
export const blueCardSchema = new SimpleSchema({
    number: {
        optional: true,
        type: String,
        autoform: {
            afFormGroup: {
                "formgroup-class": 'col-sm-3',
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
                "formgroup-class": 'col-sm-3',
            },
            afFieldInput: {
                class: 'form-control'
            },
        }
    },
    status: {
        optional: true,
        type: String,
        allowedValues: ['apply', 'reapply', 'reapply', 'sent', 'send', 'approved', 'excempt', 'declined', 'expired', 'n/a'],
        autoform: {
            options: function (x) {
               /* const parent = this.name.replace('blueCard.status', 'dateOfBirth');
                const dateOfBirth = AutoForm.getFieldValue(parent, AutoForm.getFormId());
                if (!dateOfBirth) {
                    return [
                        {label: 'Apply', value: 'apply',},
                        {label: 'Reapply', value: 'reapply'},
                        {label: 'Sent', value: 'sent'},
                        {label: 'Send', value: 'send'},
                        {label: 'Approved', value: 'approved'},
                        {label: 'Excempt', value: 'excempt'},
                        {label: 'Declined', value: 'declined'},
                        {label: 'Expired', value: 'expired' },
                        {label: 'n/a', value: 'n/a'}]
                }
                if (dateOfBirth instanceof Date && moment(dateOfBirth).add(18, 'years').toDate() <= new Date()) {
                    return [
                        {label: 'Apply', value: 'apply'},
                        {label: 'Reapply', value: 'reapply'},
                        {label: 'Sent', value: 'sent'},
                        {label: 'Send', value: 'send'},
                        {label: 'Approved', value: 'approved'},
                        {label: 'Excempt', value: 'excempt'},
                        {label: 'Declined', value: 'declined'},
                        {label: 'Expired', value: 'expired' },
                        {label: 'n/a', value: 'n/a'}]
                }*/
                return [
                    {label: 'Apply', value: 'apply'},
                    {label: 'Reapply', value: 'reapply'},
                    {label: 'Sent', value: 'sent'},
                    {label: 'Send', value: 'send'},
                    {label: 'Approved', value: 'approved'},
                    {label: 'Excempt', value: 'excempt'},
                    {label: 'Declined', value: 'declined'},
                    {label: 'Expired', value: 'expired' },
                    {label: 'n/a', value: 'n/a'}]
            },
            afFieldInput: {
                class: 'form-control'
            },
            afFormGroup: {
                "formgroup-class": 'col-sm-3'
            }
        }
    },
    registered: {
        optional: true,
        type: String,
        allowedValues: ['', 'sponsored', 'authorised'],
        autoform: {
            firstOption: false,
            options: [
                {label: 'N/A', value: ''},
                {label: 'Sponsored', value: 'sponsored'},
                {label: 'Authorised', value: 'authorised'}],
            afFieldInput: {
                class: 'form-control'
            },
            afFormGroup: {
                "formgroup-class": 'col-sm-3'
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