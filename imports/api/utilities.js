/**
 * Created by cesar on 28/9/16.
 */
export const delay = (function () {
    var timer = 0;
    //change ms to 400 when families are more than 300
    return function (callback, ms = 0) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
})();


export const beginSubmit = function () {
    var $form = $('#' + this.formId);
    var $button = $form.find('[data-original]').prop("disabled", true);
    $button.html($button.data('begin'))
};
export const endSubmit = function () {
    var $form = $('#' + this.formId);
    var $button = $form.find('[data-original]').prop("disabled", false);
    if (this.validationContext._invalidKeys.length > 0)
        $button.html($button.data('original'));
    else
        $button.html($button.data('end'));
    $form.one('keyup change', 'input, select, textarea', function () {
        $button.html($button.data('original'));
        $button.show();
    });

};

export const sendVerificationEmailTemplateForStaff = function (userId) {
     console.log('sendVerificationEmail',userId );
    console.log('sendVerificationEmail',Accounts.sendVerificationEmail(userId));
    //Accounts.sendVerificationEmail(userId)

};
export const sendVerificationEmailTemplateForFamily = function (userId) {
    //Todo
    Accounts.sendVerificationEmail(userId)
};

export const sendEnrollmentEmailTemplateForStaff = function (userId) {
    console.log('sendEnrollmentEmailTemplateForStaff',Accounts.sendEnrollmentEmail(userId)  );
    //Todo

};
export const sendEnrollmentEmailTemplateForFamily = function (userId) {
    //Todo
    Accounts.sendEnrollmentEmail(userId)
};

export const sendUpdateFamilyStatusEmail = function (userId, body) {
    const user=Meteor.users.find(userId);
    Email.send({
        to: user.emails[0].address,
        form: Accounts.emailTemplates.form,
        html: body,
        subject: "Status updated"
    })
};

export const getDistanceFromLatLonInKm = function (lat1, lon1, lat2, lon2) {
    function deg2rad(deg) {
        return deg * (Math.PI / 180)
    }

    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    if (d < 1) {
        return (d * 1000).toFixed(0).toString() + ' mts'
    }
    if (d < 99) {
        return (d).toFixed(1).toString() + ' Km'
    } else {
        return (d).toFixed(0).toString() + ' Km'
    }


};


