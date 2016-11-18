/**
 * Created by cesar on 28/9/16.
 */
import {Meteor} from 'meteor/meteor'
import {Accounts} from 'meteor/accounts-base'



Meteor.startup(()=> {
    const email = 'jonathan@freewill.vision';
    if (!Accounts.findUserByEmail(email)) {
        const userId = Accounts.createUser({
            email,
            password: "2020Vision"

        });
        Meteor.users.update(userId, {
            $set: {
                firstName: "Jonathan",
                surname: "Ersser",
                email
            }
        });
        Roles.addUsersToRoles(userId, 'admin')
    }
    /*
    let users=Meteor.users.find({roles: 'family','parents.blueCard':{$exists: false}});
    users.forEach((user)=>{
        if(Array.isArray(user.parents)){
            for (let i in user.parents){
                const expireDate=user.parents[i].blueCardExpiryDate;
                let status='n/a';
                if (expireDate instanceof Date){
                    if (expireDate>new Date())
                        status='approved';
                    else
                        status='expired'
                }
                user.parents[i].blueCard={
                    number: user.parents[i].blueCardNumber,
                    expiryDate: user.parents[i].blueCardExpiryDate,
                    status
                }
            }
        }

        if(Array.isArray(user.children)){
            for (let i in user.children){
                const expireDate=user.children[i].blueCardExpiry;
                let status='apply';
                if (expireDate instanceof Date){
                    if (expireDate>new Date())
                        status='approved';
                    else
                        status='expired'
                }
                user.children[i].blueCard={
                    number: user.children[i].blueCardNumber,
                    expiryDate: user.children[i].blueCardExpiry,
                    status
                }
            }
        }

        if(Array.isArray(user.guests)){
            for (let i in user.guests){
                const expireDate=user.guests[i].blueCardExpiryDate;
                let status='n/a';
                if (expireDate instanceof Date){
                    if (expireDate>new Date())
                        status='approved';
                    else
                        status='expired'
                }
                user.guests[i].blueCard={
                    number: user.guests[i].blueCardNumber,
                    expiryDate: user.guests[i].blueCardExpiryDate,
                    status
                }
            }
        }
        Meteor.users.update(user._id,user)
    })*/
});