import './autoform-auto-table.html'
import {Template} from 'meteor/templating'
import {AutoForm} from 'meteor/aldeed:autoform'
import {ReactiveVar} from 'meteor/reactive-var'
import {createFilter} from 'meteor/cesarve:auto-table/list'
AutoForm.addInputType("auto-table", {
    template: "afAutoTable",
    valueOut: function (val) {
        const autoTableDataTemplate = Blaze.getData(this.get(0).firstElementChild)
        const autoTableViewTemplate = Blaze.getView(this.get(0).firstElementChild)
        const filter = createFilter(autoTableViewTemplate.templateInstance().columns.get(), autoTableDataTemplate.at.schema)
        return filter
    },
    contextAdjust: function (context) {
        //console.log(' autoform-auto-table context', context)
        context.at = context.atts.at
        return context;
    },
    valueIn: function (val) {
        //console.log(' autoform-auto-table valuein',val,this)
        return val
    }
});



Template.afAutoTable.onCreated(function(){

});
Template.afAutoTable.helpers({
    customQuery: function () {
        console.log("this.at.id +'_customQuery'",this.at.id +'_customQuery', Session.get(this.at.id +'_customQuery'))
        return ()=>Session.get(this.at.id +'_customQuery')
    },
    atts: function () {
        const atts = _.clone(this.atts)
        delete atts.at
        return atts
    }
});
