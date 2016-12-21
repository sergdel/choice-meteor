import {Email} from 'meteor/email'
import {_} from 'meteor/underscore'
import {Families} from '/imports/api/family/family'
WebApp.connectHandlers.use("/emails-sents", function (req, res, next) {
    res.writeHeader(200, {"Content-Type": "text/html"});
    let emails=[]
    Email.find({
        "campaign": "Welcome new enquiries"
    }).forEach((email)=>{
        emails.push(email.userId)
    })
    emails=_.uniq(emails)

    emails.forEach((email)=>{

    })
    const families=Families.find({_id:{$nin: emails}, 'office.familyStatus': 0 })
    families.forEach((fa)=>{
        res.write('"'+fa._id+'",<br>')
    })
    res.end('');

});



/*


 */