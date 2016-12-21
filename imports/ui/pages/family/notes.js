import './notes.html'

Template.familySearchNotes.helpers({
    //add you helpers here
});

Template.familySearchNotes.events({
    'change textarea'(e,instance){
        const notes=$(e.currentTarget).val()
        Meteor.call('updateFamilySearchNotes',this._id,notes)
    }
});

Template.familySearchNotes.onCreated(function () {
    //add your statement here
});

Template.familySearchNotes.onRendered(function () {
    //add your statement here
});

Template.familySearchNotes.onDestroyed(function () {
    //add your statement here
});

