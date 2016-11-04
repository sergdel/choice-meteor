import './export.css'
import './export.html'
import {exportFields} from '/imports/api/group/export-fields'
import {saveAs} from 'node-safe-filesaver'
Template.exportCVS.helpers({
    showedList(){
        const showedList = Template.instance().showedList;
        const result = [];
        for (const key in showedList)
            result.push({label: key, value: showedList[key]})
        return result
    },
    hiddenList(){
        const hiddenList = Template.instance().hiddenList;
        const result = [];
        for (const key in hiddenList)
            result.push({label: key, value: hiddenList[key]})
        return result
    },
});

Template.exportCVS.events({
    'click .moveToLeft'(){
        $("#hiddenList li").detach().appendTo('#showedList');
        updateList()

    },
    'click .moveToRight'(){
        jQuery("#showedList li").detach().appendTo('#hiddenList');
        updateList()
    },
    'submit form#exportCVS'(e, instance){
        e.preventDefault();
        $('.export i').removeClass('fa-file-excel-o btn-danger').addClass(' fa-spinner fa-spin fa-fw');
        Meteor.call('exportGroups', Session.get('searchGroupListForm.query'), Session.get('searchGroupListForm.orderBy'), Session.get('export.showedList'), (err, file)=> {
            var blob = new Blob([file], {type: "text/csv;charset=utf-8"});
            $('.export i').addClass('fa-file-excel-o').removeClass(' fa-spinner fa-spin fa-fw');
            if (err){
                $('.export i').addClass('btn-danger');
                setTimeout(()=>{
                    $('.export i').removeClass('btn-danger')
                },5000);
                return
            }

            saveAs(blob, 'families.csv')

        })
    }
});

Template.exportCVS.onCreated(function () {
    Session.setDefaultPersistent('export.showedList', exportFields);
    Session.setDefaultPersistent('export.hiddenList', {});
    this.showedList = Session.get('export.showedList');
    this.hiddenList = Session.get('export.hiddenList')
});

Template.exportCVS.onRendered(function () {
    $("#showedList, #hiddenList").sortable({
        connectWith: ".connectedSortable",
        update: updateList,
    }).disableSelection();
});

Template.exportCVS.onDestroyed(function () {
    //add your statement here
});


const updateList = function () {
    const getQueryParameters = function (str) {
        return str.replace(/(^\?)/, '').split("&").map(function (n) {
            return n = n.split("="), this[n[0]] = n[1], this
        }.bind({}))[0];
    };
    let showedList = $("#showedList").sortable('serialize', {
        attribute: 'data-value'
    }).replace(/\[\]/gi, '');
    let hiddenList = $("#hiddenList").sortable('serialize', {
        attribute: 'data-value'
    }).replace(/\[\]/gi, '');
    showedList = getQueryParameters(showedList);
    hiddenList = getQueryParameters(hiddenList);
    Session.setPersistent('export.showedList', showedList);
    Session.setPersistent('export.hiddenList', hiddenList)
};
