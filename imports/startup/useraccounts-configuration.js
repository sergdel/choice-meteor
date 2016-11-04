import {AccountsTemplates} from "meteor/useraccounts:core";
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
    privacyUrl: 'privacy',
    termsUrl: 'terms-of-use',

    // Redirects
    homeRoutePath: '/family/list',
    redirectTimeout: 4000,

    // Hooks
    /*
    onLogoutHook: myLogoutFunc,
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
AccountsTemplates.addField({
    _id: 'type',
    type: 'select',
    required: true,
    minLength: 6,
    displayName: "¿Que buscas?",
    select: [
        {
            text: "Busco un gestor para realizar mis tramites",
            value: "client",
        },
        {
            text: "Busco ofrecer mis servicios de gestoria",
            value: "manager",
        },
    ],
});

    AccountsTemplates.configureRoute('signIn');
    /** no creation users from client side at moment
    AccountsTemplates.configureRoute('signUp',{
    })
     **/
    AccountsTemplates.configureRoute('changePwd');
    AccountsTemplates.configureRoute('enrollAccount');
    AccountsTemplates.configureRoute('forgotPwd');
    AccountsTemplates.configureRoute('resetPwd');
    AccountsTemplates.configureRoute('verifyEmail');
    AccountsTemplates.configureRoute('resendVerificationEmail');





