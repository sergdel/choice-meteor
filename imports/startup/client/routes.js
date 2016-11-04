/**
 * Created by cesar on 26/9/16.
 */
import "/imports/ui/layouts/loading.html";
import "/imports/ui/layouts/loading.css";
import "/imports/ui/layouts/default";
import "/imports/ui/layouts/public";
import {FlowRouter} from "meteor/kadira:flow-router";
import {BlazeLayout} from "meteor/kadira:blaze-layout";
import "/imports/ui/pages/public/home";
import "/imports/ui/pages/public/information";
import "/imports/ui/pages/family/adult/edit";
import "/imports/ui/pages/family/list";
import "/imports/ui/pages/family/edit";
import "/imports/ui/pages/family/new";
import "/imports/ui/pages/blue-card/list";

import "/imports/ui/pages/staff/list";
import "/imports/ui/pages/staff/edit";
import "/imports/ui/pages/staff/new";
import "/imports/ui/layouts/errors.html";
import "/imports/ui/pages/audit/list";

/*
FlowRouter.wait();
//ensure that the roles are accesible before routerFlow were initialized -> for make a route level auth
Tracker.autorun(function () {
    if (Roles.subscription.ready() ) {
        Session.set('Roles.subscription.ready',true)
        FlowRouter.initialize()

    }
});
*/
FlowRouter.wait();

var self = this;
self.getATReady = () => AccountsTemplates._initialized;

var timer = Meteor.setInterval(function() {
    if (self.getATReady()) {
        tracker.invalidate();
        clearInterval(timer);
    }
}, 100);

var tracker = Tracker.autorun(function() {
    if (!FlowRouter._initialized && Roles.subscription.ready() && self.getATReady()) {
        clearInterval(timer);
        Session.set('Roles.subscription.ready',true);
        FlowRouter.initialize()
    }
});

Accounts.onLogin(function () {
    var redirect;
    redirect = Session.get('redirectAfterLogin');
    if (redirect != null) {
        if (redirect !== '/sign-in') {
            return FlowRouter.go(redirect);
        }
    }
});
export const loggedRoutes = FlowRouter.group({
    name: 'logged',
    triggersEnter: [function () {
        Session.set('loggedRoute', true);
        var route;
        Tracker.autorun(function () {
            if (!Meteor.userId() && Session.get('loggedRoute')) {
                console.log('loggedRoute');
                Session.set('redirectAfterLogin', FlowRouter._current.path);
                return FlowRouter.go('/sign-in');
            }
        });
    }],
    triggersExit: [()=> {
        Session.set('loggedRoute', false)
    }]
});
export const publicRoutes = FlowRouter.group({});


loggedRoutes.route('/logout', {
    name: 'logout',
    action: function () {
        return Meteor.logout(function () {
            return FlowRouter.go(FlowRouter.path());
        });
    }

});

export const familyRoleRoutes = loggedRoutes.group({
    triggersEnter: [function () {
        Session.set('familyRoute', true);
        Tracker.autorun(function () {
            if (!Roles.userIsInRole(Meteor.userId(), 'family') && Session.get('familyRoute')) {
                console.log('familyRoute');
                Session.set('redirectAfterLogin', FlowRouter._current.path);
                return FlowRouter.go('forbidden');
            }
        });
    }],
    triggersExit: [function () {
        Session.set('familyRoute', false)
    }]
});

export const adminRoleRoutes = loggedRoutes.group({
    triggersEnter: [function () {
        Session.set('adminRoute', true);
        Tracker.autorun(function () {
            if (!Roles.userIsInRole(Meteor.userId(), 'admin') && Session.get('adminRoute')) {
                console.log('adminRoute');
                Session.set('redirectAfterLogin', FlowRouter._current.path);
                return FlowRouter.go('forbidden');
            }
        });
    }],
    triggersExit: [function () {
        Session.set('adminRoute', false)
    }]
});
export const staffRoleRoutes = loggedRoutes.group({
    triggersEnter: [function () {
        Session.set('staffRoute', true);
        Tracker.autorun(function () {
            if (!Roles.userIsInRole(Meteor.userId(), ['staff', 'admin']) && Session.get('staffRoute')) {
                Session.set('redirectAfterLogin', FlowRouter._current.path);
                return FlowRouter.go('forbidden');
            }
        });
    }],
    triggersExit: [function () {
        Session.set('staffRoute', false)
    }]
});

/**public**/
publicRoutes.route('/', {
    name: 'home',
    title: 'Home',
    action(params, queryParams) {
        //window.location.replace("http://choicehomestay.com");
        BlazeLayout.render('public', {yield: 'home'})
    }
});

publicRoutes.route('/information', {
    name: 'information',
    parent: 'home',
    title: 'Information',
    action(params, queryParams) {
        BlazeLayout.render('public', {yield: 'information'})
    }
});


/**user**/

const userRoutes = familyRoleRoutes.group({
    prefix: '/user',

});

userRoutes.route('/profile', {
    name: 'userProfile',
    action(params, queryParams) {
        BlazeLayout.render('layout', {yield: 'familyEdit'})
    }

});
userRoutes.route('/adult', {
    name: 'adultEdit',
    action(params, queryParams) {
        BlazeLayout.render('layout', {yield: 'adultEdit'})
    }
});

/**family**/
const familyRoutes = staffRoleRoutes.group({
    prefix: '/family'
});

familyRoutes.route('/list/:limit?', {
    name: 'familyList',
    title: 'Families',
    action(params, queryParams) {
        BlazeLayout.render('layout', {yield: 'familyList'})
    }
});
familyRoutes.route('/edit/:familyId/:limit?', {
    name: 'familyEdit',
    parent: 'familyList',
    title: 'Edit',
    action(params, queryParams) {
        BlazeLayout.render('layout', {yield: 'familyEdit'})
    }
});

familyRoutes.route('/new', {
    name: 'familyNew',
    parent: 'familyList',
    title: 'Create',
    action(params, queryParams) {
        BlazeLayout.render('layout', {yield: 'familyNew'})
    }
});

/**BluCard**/

familyRoutes.route('/bluecard/:limit?', {
    name: 'blueCardList',
    title: 'Blue Card',
    action(params, queryParams) {
        BlazeLayout.render('layout', {yield: 'blueCardList'})
    }
});


/**staff**/
const staffRoutes = adminRoleRoutes.group({
    prefix: '/staff'
});

staffRoutes.route('/list', {
    name: 'staffList',
    title: 'Staff',
    action(params, queryParams) {
        BlazeLayout.render('layout', {yield: 'staffList'})
    }
});
staffRoutes.route('/edit/:staffId', {
    name: 'staffEdit',
    parent: 'staffList',
    title: 'Edit',
    action(params, queryParams) {
        BlazeLayout.render('layout', {yield: 'staffEdit'})
    }
});

staffRoutes.route('/new', {
    name: 'staffNew',
    parent: 'staffList',
    title: 'Create',
    action(params, queryParams) {
        BlazeLayout.render('layout', {yield: 'staffNew'})
    }
});

/**audit**/
const auditRoutes = adminRoleRoutes.group({
    prefix: '/audit'
});

auditRoutes.route('/list', {
    name: 'auditList',
    title: 'Log',
    action(params, queryParams) {
        BlazeLayout.render('layout', {yield: 'auditList'})
    }

});


/**other**/

FlowRouter.notFound = {
    action: function () {
        BlazeLayout.render('layout', {yield: 'notFound'})
    }
};

publicRoutes.route('/forbidden', {
    name: 'forbidden',
    action(params, queryParams) {
        console.log('render forbidden');
        BlazeLayout.render('forbidden')
    }
});

familyRoutes.route('/adult/edit/:familyId', {
    name: 'adultEdit',
    parent: 'familyEdit',
    title: 'Adult group',
    action(params, queryParams) {
        BlazeLayout.render('layout', {yield: 'adultEdit'})
    }
});