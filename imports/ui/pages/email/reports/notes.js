import './notes.html'

Template.emailCampaignNotes.helpers({
    //add you helpers here
});

Template.emailCampaignNotes.events({
    'change textarea'(e,instance){
        const notes=$(e.currentTarget).val()
        Meteor.call('updateEmailsCampaignReportNote',this._id,notes)
    }
});

Template.emailCampaignNotes.onCreated(function () {

});

Template.emailCampaignNotes.onRendered(function () {
    //add your statement here
});

Template.emailCampaignNotes.onDestroyed(function () {
    //add your statement here
});

