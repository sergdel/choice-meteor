import './accordion.css'
import './accordion.html'
import {Template} from 'meteor/templating'


var camelCase = function (name) {
    var parts = name.split(' ');
    parts[0] = parts[0].toLowerCase();
    for (var i = 1; i < parts.length; ++i) {
        parts[i] = parts[i].charAt(0).toUpperCase() + parts[i].substr(1);
    }
    return parts.join('');
};


Template.accordionPanel.helpers({
    collapsed: function () {
        if (window.location.hash == "#" + Template.instance().data.id)
            return false;
        else
            return true


    },
    id(){
        return Template.instance().data.id
    },
    headingId(){
        return 'heading-id-' + Template.instance().data.id
    },
    parentId: function () {
        return 'parentId'
    }
});

Template.accordionPanel.events({
    'click a'(e){
        if(history.replaceState) {
            console.log(history.replaceState);
            history.replaceState(null, null, $(e.currentTarget).attr('href'));
        }
        else {
            location.hash = $(e.currentTarget).attr('href');
        }
    }
});

Template.accordionPanel.onCreated(function () {
    //add your statement here
});

Template.accordionPanel.onRendered(function () {
    //add your statement here
});

Template.accordionPanel.onDestroyed(function () {
    //add your statement here
});

