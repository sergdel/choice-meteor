import './apply.html'
import {Template} from 'meteor/templating'
import {Groups} from '/imports/api/group/group'
//import {Families} from '/imports/api/family/family'

Template.groupApply.helpers({
    exists: ()=> Template.instance().data.groups && Template.instance().data.groups[0]
});

Template.groupApply.events({
    'click .applyGroup'(e, instance){
        let familyId = this._id
        const group = Template.parentData(6).group
        let groupApply =  this.groups && this.groups[0] || {} //grops[0] allways will be the actual group bause we use $matchElem projection in custompublication  on autotable see imports/api/gropus/placement/families publish function
        const cancelButton = !_.isEmpty(groupApply) ? '<button class="btn btn-danger btn-xs groupCancelApply" data-group-id="' + group._id + '" data-family-id="' + familyId + '">Cancel application <i class="fa fa-trash"></i></button>' : ''

        const moment1 = group.dates && group.dates[0] && moment(group.dates[0])
        const moment2 = group.dates && group.dates[1] && moment(group.dates[1])
        const dates = moment1 && moment2 && moment1.isValid() && moment2.isValid() ? `(${moment1.format('Do MMM YY')} to ${moment2.format('Do MMM YY')})` : ""
        const location = group.location ? `(Location: ${group.location})` : ""
        const title = `Welcome guests from ${group.name} group ${dates} ${location}`
        const content = (this.requirements || ' ') + (group.requirements && group.other ? ' <br>' : '') + (group.other || ' ')
        BootstrapModalPrompt.prompt({
            attachTo: instance.firstNode,
            title,
            content: content,
            content1: cancelButton,
            autoform: {
                schema: Groups.schemas.apply,
                type: "normal",
                doc: groupApply,
                id: 'applyGroup',
                buttonContent: false,
                omitFields: ['familyId', 'status']
            },
            btnDismissText: 'Cancel',
            btnOkText: 'Save'
        }, (data) => {
            if (data) {
                console.log( 'groupApply',group._id, familyId, data)
                Meteor.call('groupApply', group._id, familyId, data, function (err, res) {
                    if (err)
                        console.error('groupApply', err)
                })
            }
            else {
            }
        });
    }
});


Template.groupApply.onCreated(function () {
    //add your statement here
});

Template.groupApply.onRendered(function () {
    //add your statement here
});

Template.groupApply.onDestroyed(function () {
    //add your statement here
});

