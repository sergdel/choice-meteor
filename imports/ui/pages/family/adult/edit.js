/**
 * Created by cesar on 3/10/16.
 */
import "/imports/ui/componets/autoform/select-checkbox-create-option/select-checkbox-create-option";
import "./edit.html";
import {Template} from "meteor/templating";
import "/imports/api/files/files";
import {AutoForm} from "meteor/aldeed:autoform";
import {familySchema} from "/imports/api/family/family";
Template.adultEdit.helpers({
    omitFields: ['adult.status','adult.score'],
    familySchema: familySchema,
    family: ()=> {
        let familyId;
        const userId = Meteor.userId();
        if (Roles.userIsInRole(userId, 'family'))
            familyId = userId;
        else
            familyId = FlowRouter.getParam("familyId");
        return Meteor.users.findOne(familyId)

    },
    adultGroupFirstTime:function () {
        const family=Meteor.users.findOne(FlowRouter.getParam("familyId") || Meteor.userId());
        return !!(family && family.adult && family.adult.activities1)
    }

});
Template.adultEdit.onCreated(function () {
    //todo que solo se suscriba a lo que se esta viendo

});
AutoForm.hooks({
    adultEdit: {
        onSuccess: function () {
            $('.alert-success').slideDown();
            setTimeout(()=> {
                $('.alert-success').slideUp
            }, 10000);
            $('.hideAfterSave').hide()
        }
    }
});