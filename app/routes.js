var request = require("request");

module.exports = function(app, passport) {

    app.get('/', function(req, res){
        res.render('index');
    });

    app.get('/home', isLoggedIn, function(req, res){
        res.render('webapp');
    });

    app.get('/partial/auth/:name', isLoggedIn, function (req, res) {
        var name = req.params.name;
        res.render('partials/auth/' + name);
    });

    app.get('/partial/:name', function (req, res) {
        var name = req.params.name;
        res.render('partials/' + name);
    });
    
    app.post('/api/login', passport.authenticate('local-login', {
        successRedirect : '/home', // redirect to the secure profile section
        failureRedirect : '/', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    
    // process the signup form
    app.post('/api/signup', passport.authenticate('local-signup', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/#/register', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    
    app.get('/api/logout', isLoggedIn, function(req, res){
        req.logout();
        res.redirect('/');
    });

    app.post('/api/spy', isLoggedIn, function(req, res){
       	
        if(!req.body.players || !req.body.spys || !req.body.broadcasterID){
        	console.log("!!!!!!!!!!!!!" + req.body.broadcasterID);
            
        }
        

        var body = {players : req.body.players, spys : req.body.spys, broadcasterID : req.body.broadcasterID};
        var options = {
            method: 'post',
            url: "http://127.0.0.1:30001/api/spy",
            body: body,
            json: true,
            
        };
       console.log(body);
       request(options, (err, response, body) => {
            if(err){

                res.send({status: "failed", result: err});
            }
            else{
                //console.log(body);
               	
                if(body.error){

                    res.send({status: "fail", result: body.error});
                }
                else{
                    res.send({status: "ok", result: body});
                }
            }
       });
    });
    
    function isLoggedIn(req, res, next) {
        next();
    }

}
