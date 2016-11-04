import "./form";
import "./edit.html";
import {Template} from "meteor/templating";
import {AutoForm} from "meteor/aldeed:autoform";
import {FlowRouter} from "meteor/kadira:flow-router";
import {groupStatus} from "/imports/api/group/group-status";
import {_} from "meteor/underscore";
import {groupSchema} from "/imports/api/group/group";

import "/imports/ui/componets/autoform/afArrayField_clean"
import "/imports/ui/componets/autoform/afObjectField_clean"
import "/imports/ui/componets/autoform/afFormGroup_clean"
import {emailTemplateSchema} from "/imports/api/group/email-template";


AutoForm.debug();

Template.groupEdit.onCreated(function () {
    this.autorun(()=> {
        this.data.groupId = FlowRouter.getParam("groupId");
        this.subscribe('group', this.data.groupId)

    })
});

Template.groupEdit.onRendered(function () {

});

Template.groupEdit.onDestroyed(function () {
    //add your statement here
});

Template.groupEdit.helpers({
    groupSchema: groupSchema,
    group: ()=> {
        const groupId = FlowRouter.getParam("groupId") || Meteor.userId(); //if groupId is undifed is because is a group user
        return Meteor.users.findOne(groupId)
    },
    found:()=>{
        const groupId = FlowRouter.getParam("groupId") || Meteor.userId(); //if groupId is undifed is because is a group user
        return !!Meteor.users.findOne(groupId)
    },

    groupStatusOptions: ()=> {

        if (Roles.userIsInRole(Meteor.userId(), ['staff', 'admin'])) {
            const group = Meteor.users.findOne(FlowRouter.getParam("groupId"));
            const currentStatus = (group && group.office && group.office.groupStatus );
            if (currentStatus===undefined)
                return [{label: "Loading", value: 0}];
            return function () {
                const filtered = _.filter(groupStatus, function (val) {
                    return _.indexOf(groupStatus[currentStatus].map, val.id) >= 0
                });
                return _.map(filtered, function (status) {
                    return {label: status.label, value: status.id}
                })
            }
        }
    }

})
;

Template.groupEdit.events({
    'click [href="#audit"]': function (e, instance) {
        Blaze.renderWithData(Template.auditList, {groupId: this.groupId}, instance.$('#audit').get(0))
    }
});


AutoForm.hooks({
    groupFormOfficeOnly: {
        before: {
            "method-update": function (modifier) {
                // if groupStatus is being changed
                if (modifier && modifier.$set && modifier.$set["office.groupStatus"] && this.currentDoc.office.groupStatus != modifier.$set["office.groupStatus"]) {
                    const newGroupStatus = modifier.$set["office.groupStatus"];
                    const status = groupStatus[newGroupStatus];
                    //if i have to prompt for email template
                    if (status.emailTemlate && status.emailTemlate.type == 'editable') {
                        BootstrapModalPrompt.prompt({
                            title: 'Updating group status to ' + groupStatus[newGroupStatus].label,
                            content: 'Need to send  email',
                            autoform: {
                                id: 'emailTemplateSchema',
                                doc: {body: groupStatus[newGroupStatus].emailTemlate.text},
                                type: 'normal',
                                schema: emailTemplateSchema,
                                buttonContent: false,
                            },
                            btnDismissTextClass: 'btn-danger',
                            btnOkTextClass: 'btn-primary',
                            btnDismissText: 'Not now',
                            btnOkText: 'Update and send email',
                        }, (data)=> {
                            if (data) {
                                modifier.$set["office.groupStatusEmailTemplate"] = data.body;
                                this.result(modifier)
                            } else {
                                this.result(false);
                            }
                        })
                    } else {
                        this.result(modifier)
                    }
                } else {
                    this.result(modifier)

                }
            },
        },
    }
});