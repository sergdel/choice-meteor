import "/imports/startup/server";
import "/imports/startup/server/migrations.js";
Meteor.startup(()=> {
    if (Meteor.isProduction) {
        console.log('Kadira.connect')
        Kadira.connect('i2z9F8pZAPd8sP9Mk', '4aea5bb6-ccd8-40d0-8cae-9af2f022996f');
    }


    /*
     App key
     6la6adpm7hcinpw
     App secret
     9xrwgcukrnd4ldf*/

});

