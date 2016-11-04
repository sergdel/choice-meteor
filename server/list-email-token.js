WebApp.connectHandlers.use("/exportx", function (req, res, next) {
    res.end('');
    return;
    const families = Meteor.users.find({
        "office.familyStatus": 3,
        "office.familySubStatus": "active",
        "contact.address.geometry": {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [153.4161, -28.0006]
                },
                $maxDistance: 12000
            }
        }

    }, {
        limit: 2000, fields: {
            "parents.firstName": 1,
            "parents.surname": 1,
            "parents.email": 1,
            "office.familyStatus": 1
        }
    });
    const show = function (obj) {
        return obj || ""
    };
    let csv = "";
    families.forEach((family)=> {
        LoginToken.setExpiration(new Date().getTime() + 1000 * 22 * 24 * 60 * 60);
        LoginToken.setMaxUse(9999);
        const token = LoginToken.createTokenForUser(family._id);

    });
    res.setHeader('Content-disposition', 'attachment; filename=families.csv');
    res.setHeader('Content-Type', 'text/csv');
    res.end(csv);


});
