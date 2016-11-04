import './information.html'
Template.information.helpers({
    //add you helpers here
});

Template.information.events({
    //add your events here
});

Template.information.onCreated(function () {

});

Template.information.onRendered(function () {
    $(".cat-list a").each(function() {
        $(this).click(function() {
            $('html, body').animate({scrollTop: $("#h"+$(this).attr("id")).offset().top - 110}, 1000);
        });
    });
});

Template.information.onDestroyed(function () {
    //add your statement here
});

