import {AccountsTemplates} from "meteor/useraccounts:core";
import {FlowRouter} from 'meteor/kadira:flow-router'
AccountsTemplates.configure({
    // Behavior
    confirmPassword: false,
    enablePasswordChange: true,
    /**
     * No users creation from client
     **/
    forbidClientAccountCreation: true,
    overrideLoginErrors: true,
    sendVerificationEmail: true,
    lowercaseUsername: false,
    focusFirstInput: true,

    // Appearance
    showAddRemoveServices: true,
    showForgotPasswordLink: true,
    showLabels: true,
    showPlaceholders: true,
    showResendVerificationEmailLink: false,

    // Client-side Validation
    continuousValidation: false,
    negativeFeedback: false,
    negativeValidation: true,
    positiveValidation: true,
    positiveFeedback: true,
    showValidating: true,

    // Privacy Policy and Terms of Use
    privacyUrl: '',
    termsUrl: '',

    // Redirects
    homeRoutePath: '/user/profile',
    redirectTimeout: 4000,

    onLogoutHook: function () {
        FlowRouter.go('/sign-in');
    },
    // Hooks
    /*

     onSubmitHook: mySubmitFunc,
     preSignUpHook: myPreSubmitFunc,
     postSignUpHook: myPostSubmitFunc,
     */
    // Texts
    texts: {
        button: {
            signUp: "Register Now!"
        },
        socialSignUp: "Register",
        socialIcons: {
            "meteor-developer": "fa fa-rocket"
        },
        title: {
            forgotPwd: "Recover Your Password"
        },
    },

    defaultLayoutType: 'blaze', // Optional, the default is 'blaze'
    //defaultTemplate: 'myCustomFullPageAtForm',
    defaultLayout: 'public',
    defaultLayoutRegions: {},
    defaultContentRegion: 'yield',
});


const redirect = function () {
    console.log('AccountsTemplates.configureRoute', Meteor.userId(), Roles.userIsInRole(Meteor.userId(), ['staff', 'admin']))
    if (Roles.userIsInRole(Meteor.userId(), ['staff', 'admin'])) {
        FlowRouter.go('familyList')
    } else {
        FlowRouter.go('userProfile')

    }
}


AccountsTemplates.configureRoute('signIn', {
    redirect: redirect
})
/** no creation users from client side at moment
 AccountsTemplates.configureRoute('signUp',{
    })
 **/
AccountsTemplates.configureRoute('changePwd', {
    redirect: redirect
})
AccountsTemplates.configureRoute('enrollAccount', {
    redirect: redirect
})
AccountsTemplates.configureRoute('forgotPwd', {
    redirect: redirect
})
AccountsTemplates.configureRoute('resetPwd', {
    redirect: redirect
})
AccountsTemplates.configureRoute('verifyEmail', {
    redirect: redirect
})
AccountsTemplates.configureRoute('resendVerificationEmail', {
    redirect: redirect
})


AccountsTemplates.configure({

    texts: {
        termsPreamble: "",
        termsPrivacy: "",
        termsAnd: "",
        termsTerms: "",
        title: {
            enrollAccount: "Create a password for your account",
        },
        button: {
            enrollAccount: "Save password",
        }
    },

});



