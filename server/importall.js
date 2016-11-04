/**
 * Created by cesar on 6/10/16.
 */
var fs = Npm.require('fs');

WebApp.connectHandlers.use("/chaphones", function (req, res, next) {

});
WebApp.connectHandlers.use("/impaddress", function (req, res, next) {
    res.end();
    /*
     let data=HTTP.get('http://cesarramos.me/roles.json')
     if (data.statusCode==200){
     let json=JSON.parse(data.content)
     console.log(json[0])
     for (let i in json){
     console.log(json[i])
     break;
     }
     }

     res.end()
     */


    let data = HTTP.get('http://cesarramos.me/data.txt');



    if (data.statusCode == 200) {
        const datas = data.content.split('\n');

        for (let i in datas) {
            var o = JSON.parse(datas[i].replace(/\$date/g, 'date'));
            console.log(o);
            Meteor.users.insert(o)
        }
    }

    res.end()

});
