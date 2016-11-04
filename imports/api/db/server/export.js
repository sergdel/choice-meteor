/**
 * Created by cesar on 31/10/16.
 */
var Future = Npm.require('fibers/future');
var exec = Npm.require('child_process').exec;
const backupDB = function () {
    var future = new Future();
    const file = new Date().toISOString().substring(0, 10) + '-' + Random.id(5);

    let command = `mongodump --db choicehomestay --collection users --out  ./assets/app/db_backups/${file}`;
    exec(command, function (error, stdout, stderr) {
        if (error) {
            console.log('Error0: ', error);
            future.return(false);
            return
        }
        command = `tar -cvf ./assets/app/db_backups/${file}.tar ./assets/app/db_backups/${file}/`;
        exec(command, function (error, stdout, stderr) {
            if (error) {
                console.log('Error1: ', error);
                future.return(false);
                return
            }
            var dbx = new Dropbox({accessToken: 'd4Ntjuf2NoAAAAAAAAAAIdydrmaRh0gNU_ZpMXpueI-i5HUwwvOwNDQk5sERHDUm'});
            fs = require('fs');
            fs.readFile(`./assets/app/db_backups/${file}.tar`, function (error, contents) {
                if (error) {
                    console.log('Error3: ', error);
                    future.return(false);
                    return
                }
                // This uploads basic.js to the root of your dropbox
                dbx.filesUpload({path: `/_Websight Creative Team Folder/DB/${file}.tar`, contents: contents})
                    .then(function (response) {
                        future.return(true);
                    })
                    .catch(function (error) {
                        console.log('Error4: ', error);
                        future.return(false);

                    })
            });
        });
    });
    return future.wait()
};