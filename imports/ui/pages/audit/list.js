import "./list.css"
import "./list.html"
import {Template} from "meteor/templating"
import {AuditAutoTable} from '/imports/api/audit/audit'
Template.auditList.onCreated(function () {
   this.subscribe('staffs')
});
Template.auditList.onRendered(function () {

});

Template.auditList.onDestroyed(function () {
});


Template.auditList.helpers({
    insideView: ()=>!Template.instance().data.familyId,
    customQuery: function(){
        const familyId=Template.instance().data.familyId
        if (familyId){
            return {familyId}
        }else{
            return {}
        }
    },
    autoTable: AuditAutoTable
});

Template.auditList.events({
    'click .td'(e, instance){
        const $td = $(e.currentTarget)
        const $child = $td.parent().next('.child')
        if ($child.length == 0) {
            let table = `<tr  class='child' ><td colspan="4" ><table class='table table-condensed' style="background-color: #c5c5c5"><thead><tr><th>Path</th><th>Operation</th><th>Before</th><th>After</th></tr></thead><tbody>`
            for (let key in this.result) {
                const result = this.result[key]
                table += `<tr><td>${result.path}</td><td>${result.operation}</td><td>${result.before}</td><td>${result.after}</td></tr>`
            }
            table += '</tbody></table></td></tr>'
            $td.parent().after(table)
        } else {
            $child.toggle()
        }


    },
});

