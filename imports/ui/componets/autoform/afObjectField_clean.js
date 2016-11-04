import './afObjectField_clean.html'
Template.afObjectField_clean.helpers({
    quickFieldsAtts: function () {
        return _.pick(this, 'name', 'id-prefix');
    },

});
