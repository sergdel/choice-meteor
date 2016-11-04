import "./form";
import "./edit.html";
import {Template} from "meteor/templating";
import {AutoForm} from "meteor/aldeed:autoform";
import {FlowRouter} from "meteor/kadira:flow-router";
import {familyStatus} from "/imports/api/family/family-status";
import {_} from "meteor/underscore";
import {familySchema} from "/imports/api/family/family";

import "/imports/ui/componets/autoform/afArrayField_clean"
import "/imports/ui/componets/autoform/afObjectField_clean"
import "/imports/ui/componets/autoform/afFormGroup_clean"
import {emailTemplateSchema} from "/imports/api/family/email-template";


AutoForm.debug();

Template.familyEdit.onCreated(function () {
    this.autorun(()=> {
        this.data.familyId = FlowRouter.getParam("familyId");
        this.subscribe('family', this.data.familyId)

    })
});

Template.familyEdit.onRendered(function () {

});

Template.familyEdit.onDestroyed(function () {
    //add your statement here
});

Template.familyEdit.helpers({
    familySchema: familySchema,
    family: ()=> {
        const familyId = FlowRouter.getParam("familyId") || Meteor.userId(); //if familyId is undifed is because is a family user
        return Meteor.users.findOne(familyId)
    },
    found:()=>{
        const familyId = FlowRouter.getParam("familyId") || Meteor.userId(); //if familyId is undifed is because is a family user
        return !!Meteor.users.findOne(familyId)
    },

    familyStatusOptions: ()=> {

        if (Roles.userIsInRole(Meteor.userId(), ['staff', 'admin'])) {
            const family = Meteor.users.findOne(FlowRouter.getParam("familyId"));
            const currentStatus = (family && family.office && family.office.familyStatus );
            if (currentStatus===undefined)
                return [{label: "Loading", value: 0}];
            return function () {
                const filtered = _.filter(familyStatus, function (val) {
                    return _.indexOf(familyStatus[currentStatus].map, val.id) >= 0
                });
                return _.map(filtered, function (status) {
                    return {label: status.label, value: status.id}
                })
            }
        }
    }

})
;

Template.familyEdit.events({
    'click [href="#audit"]': function (e, instance) {
        Blaze.renderWithData(Template.auditList, {familyId: this.familyId}, instance.$('#audit').get(0))
    }
});


AutoForm.hooks({
    familyFormOfficeOnly: {
        before: {
            "method-update": function (modifier) {
                // if familyStatus is being changed
                if (modifier && modifier.$set && modifier.$set["office.familyStatus"] && this.currentDoc.office.familyStatus != modifier.$set["office.familyStatus"]) {
                    const newFamilyStatus = modifier.$set["office.familyStatus"];
                    const status = familyStatus[newFamilyStatus];
                    //if i have to prompt for email template
                    if (status.emailTemlate && status.emailTemlate.type == 'editable') {
                        BootstrapModalPrompt.prompt({
                            title: 'Updating family status to ' + familyStatus[newFamilyStatus].label,
                            content: 'Need to send  email',
                            autoform: {
                                id: 'emailTemplateSchema',
                                doc: {body: familyStatus[newFamilyStatus].emailTemlate.text},
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
                                modifier.$set["office.familyStatusEmailTemplate"] = data.body;
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