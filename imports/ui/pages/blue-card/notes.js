import './notes.html'

Template.blueCardsNotes.helpers({
    //add you helpers here
});

Template.blueCardsNotes.events({
    'change textarea'(e,instance){
        const notes=$(e.currentTarget).val()
        Meteor.call('updateBlueCardsNote',this._id,notes)
    }
});

Template.blueCardsNotes.onCreated(function () {

});

Template.blueCardsNotes.onRendered(function () {
    //add your statement here
});

Template.blueCardsNotes.onDestroyed(function () {
    //add your statement here
});

