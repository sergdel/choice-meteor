import './public.html'
/**
 * Created by cesar on 1/10/16.
 */
Template.public.helpers({
    logged:()=>{
        return !!Meteor.userId()
    }
});
Template.public.events({
    'click a[href*="#"]:not([href="#"])':function(){
        Meteor.setTimeout(()=>{
            const location=location || document.location
            if (location.pathname.replace(/^\//,'') == location.pathname.replace(/^\//,'') && location.hostname == location.hostname) {
                var target = $(location.hash);
                target = target.length ? target : $('[name=' + location.hash.slice(1) +']');
                if (target.length) {
                    $('html, body').animate({
                        scrollTop: target.offset().top
                    }, 600);
                    return false;
                }
            }
        })

    }
});
