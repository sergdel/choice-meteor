/**
 * Created by cesar on 5/12/16.
 */
/*
import {FilesCollection} from "meteor/ostrio:files";
var knox, bound, client, Request, cfdomain
var Fiber = require('fibers');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

knox = Npm.require('knox');
Request = Npm.require('request');
bound = Meteor.bindEnvironment(function (callback) {
    return callback();
});
var Fiber = require('fibers');
cfdomain = 'https://dn369dd0j6qea.cloudfront.net'; // <-- Change to your Cloud Front Domain
client = knox.createClient({
    key: Meteor.settings.aws.AWSAccessKeyId,
    secret: Meteor.settings.aws.AWSSecretKey,
    bucket: 'choicehomestay', //
    region: 'us-east-1'
});
var FindFiles = require("node-find-files");

kirkFiles = new Mongo.Collection('borrar-file-index')

let goods = 0
let bads = 0
let missing = 0
const version=3

WebApp.connectHandlers.use("/import-files", function (req, res, next) {
    const files = Files.collection.find({version: {$ne: version}}, {})
    Fiber(function () {

        files.forEach((file) => {
            var fiber = Fiber.current;
            const match = kirkFiles.findOne({name: file.name, size: file.size})

            if (!match) {
                missing++
                res.write('missing: ' + file.name +'\n')
                console.error(file)

            } else {
                const filePath = 'files/' + file._id + '-original' + file.extensionWithDot
                client.putFile(match._id, filePath, function (error, resp) {
                    bound(function () {
                        if (error) {
                            bads++
                            res.write('bads: ' + file.name +'\n')
                            console.error('error', error);

                        } else {
                            const upd = {$set: {}}
                            goods++
                            upd['$set']["versions.original.meta.pipeFrom"] = cfdomain + '/' + filePath;
                            upd['$set']["versions.original.meta.pipePath"] = filePath;
                            upd['$set']["version"] = version;
                            const update = Files.collection.update(file._id, upd)
                        }

                    })
                });
            }
        })

    }).run()
    res.write('cesar1')
})






findFile = function (file) {
    var fiber = Fiber.current;
    var finder = new FindFiles({
        rootFolder: "/Users/cesar/Desktop/Family Photos/_Update",
        filterFunction: function (path, stat) {
            stat._id = path
            stat.name= path.split('/').pop()
            Fiber(function(){
                kirkFiles.insert(stat)
            }).run()
            return false;
        }
    });
    finder.on("match", function (strPath, stat) {
        console.log(strPath + " - " + stat);
    })
    finder.on("complete", function () {
        fiber.run();
        console.log("Finished")
    })
    finder.on("patherror", function (err, strPath) {
        console.log("Error for Path " + strPath + " " + err)  // Note that an error in accessing a particular file does not stop the whole show
    })
    finder.on("error", function (err) {
        console.log("Global Error " + err);
    })
    finder.startSearch();
    Fiber.yield();
}

WebApp.connectHandlers.use("/index-files", function (req, res, next) {
    const files = Files.collection.find({}, {limit: 1})
    files.forEach((file) => {

        Fiber(function () {
                findFile(file)
            }
        ).run()
    })
    res.write('cesar22')
    res.end()
})
*/