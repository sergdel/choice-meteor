/**
 * Created by cesar on 17/12/16.

WebApp.connectHandlers.use("/sign-in", function (req, res, next) {
    if (req.headers.host == "dev.choicehomestay.com.au" || req.headers.host == "dev.choicehomestay.com") {
        res.writeHead(302,{'Location': 'https://www.choicehomestay.com/sign-in'});
    }
    res.end()

})

 */