import './autoform-auto-table.html'
import {Template} from 'meteor/templating'
import {AutoForm} from 'meteor/aldeed:autoform'
import {createFilter} from 'meteor/cesarve:auto-table/list'
AutoForm.addInputType("auto-table", {
    template: "afAutoTable",
    valueOut: function (val) {
        const autoTableDataTemplate=Blaze.getData(this.get(0).firstElementChild)
        const filter=createFilter(autoTableDataTemplate.columns.get(),autoTableDataTemplate.at.schema)
        console.log(filter)
        return filter
    },
    contextAdjust: function (context) {
        console.log(' autoform-auto-table context', context)
        context.at=context.atts.at
        return context;
    },
    valueIn:function(val){
        console.log(' autoform-auto-table valuein',val,this)
        return val
    }
});
Template.afAutoTable.events({

});
Template.afAutoTable.helpers({
    atts:function () {
        const atts=this.atts
        delete atts.at
        return atts
    }
});
