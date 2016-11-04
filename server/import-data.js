/**
 * Created by cesar on 27/9/16.
 */
updateGeo = function (val, place) {

    var loc = {
        lat: '',
        lng: '',
        geometry: {
            type: "Point",
            coordinates: [0, 0]
        },
        fullAddress: val.street + ' ' + val.suburb + ' ' + val.city + ' ' + val.state + ' ' + val.zip + ' ' + val.country,
        street: '',
        suburb: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        placeId: ''
    };

    if (place && place.geometry && place.geometry.location) {
        loc = parseGoogleAddressComponent(place.address_components);
        loc.lat = place.geometry.location.lat;
        loc.lng = place.geometry.location.lng;
        loc.geometry = {
            type: "Point",
            coordinates: [place.geometry.location.lng, place.geometry.location.lat]
        };
        loc.fullAddress = (place.formatted_address) ? place.formatted_address : "";
        loc.placeId = place.place_id;
    }

    return loc
};

parseGoogleAddressComponent = function (addressComponents) {
    var address = {};
    //go through all address components and pull out the matching types and map them to what we want (city, state)
    var map = {
        'street_number': 'street',
        'route': 'street',
        'locality': 'suburb',
        'administrative_area_level_2': 'city',
        'administrative_area_level_1': 'state',
        'postal_code': 'zip',
        'country': 'country'
    };
    var ii, xx;
    for (ii = 0; ii < addressComponents.length; ii++) {
        for (xx in map) {
            //if have a map type we want
            if (addressComponents[ii].types.indexOf(xx) > -1) {
                //have to join street number and route together
                if ((xx === 'street_number' || xx === 'route') && address.street !== undefined) {
                    //prepend
                    if (xx === 'street_number') {
                        address.street = addressComponents[ii].short_name + ' ' + address.street;
                    }
                    //append
                    else if (xx === 'route') {
                        address.street = address.street + ' ' + addressComponents[ii].short_name;
                    }
                }
                else {
                    if (xx === 'locality') {
                        address[map[xx]] = addressComponents[ii].long_name;
                    }
                    else {
                        address[map[xx]] = addressComponents[ii].short_name;
                    }
                }
            }
        }
    }
    return address;
};
WebApp.connectHandlers.use("/diff", function (req, res, next) {
    console.log(req.query);
    if (req.query.field) {
        let query = {"contact.address.geometry.coordinates": {$exists: false}};
        query["contact.address" + query.field] = req.query.old;
        let mod = {};
        mod.$set["contact.address" + query.field] = req.query.new;
        Meteor.users.update(query, mod)
    }
    const families = Meteor.users.find({"contact.address.geometry.coordinates": {$exists: false}});
    res.write(families.count().toString() + "\r");
    families.forEach((family)=> {
        res.write(family.contact.address.fullAddress + "\n")
    });
    res.end()
});
WebApp.connectHandlers.use("/updateGeo", function (req, res, next) {
    response.end('blocked for now, go to code line 107 list-email.token');
    return;
    res.writeHead(200);
    //"contact.address.geometry.coordinates":[0,0]
    const families = Meteor.users.find({}, {
        limit: 1500, fields: {
            "contact.address": 1
        }
    });
    var count = 0, errores = 0;
    console.log(families.count());
    res.write(families.count().toString());

    families.forEach((family)=> {
        const address = family && family.contact && family.contact.address && family.contact.address;
        console.log(family._id, address);
        let result = {};
        res.write(count.toString());
        count++;

        if (address) {
            var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + encodeURI(address.street) + "&components=country:AU|administrative_area_level_1:QLD&key=AIzaSyBvQMuHDv8gRDTK6oOeHJN-LMniwYSY9wA";
            result = HTTP.get(url);
            if (result.statusCode == 200) {
                if (geo.geometry.coordinates[0] == 0) {
                } else {
                    res.write('success' + family._id + '<br>');
                    console.log('22222', geo);
                    Meteor.users.update(family._id, {$set: {"contact.address": geo}})
                }


            } else {
                res.write('************ERROR*************************************<br>')
            }

        }


    });
    res.write('count' + count.toString());
    res.write('errors' + errores.toString());
    res.end()
});


WebApp.connectHandlers.use("/updateGeo2", function (req, res, next) {
    //response.end('blocked for now, go to code line 107 list-email.token')
    //return
    res.writeHead(200);
    let query = {"contact.address.geometry.coordinates": {$exists: false}};
    const families = Meteor.users.find(query, {
        limit: 200, fields: {
            "contact.address": 1
        }
    });
    var count = 0, errores = 0;
    console.log(families.count());
    res.write(families.count().toString());
    families.forEach((family)=> {
        count++;
        console.log(count);
        const address = family && family.contact && family.contact.address && family.contact.address;
        let result = {};
        if (address) {
            var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + encodeURI(address.suburb.trim()) + "&components=country:AU|administrative_area_level_2:" + +encodeURI(address.city.trim()) + "&key=AIzaSyBvQMuHDv8gRDTK6oOeHJN-LMniwYSY9wA";
            result = HTTP.get(url);
            if (result.statusCode == 200) {
                var geo = updateGeo(address, result.data.results[0]);
                if (geo.geometry.coordinates[0] == 0) {
                    console.log(result);
                    console.log(url)
                } else {
                    res.write('success' + family._id + '<br>');
                    console.log('22222', geo);
                    Meteor.users.update(family._id, {$set: {"contact.address": geo}})
                }

            } else {
                res.write('************ERROR*************************************<br>')
            }
        }

    });
    res.write('count' + count.toString());
    res.write('errors' + errores.toString());
    res.end()
});