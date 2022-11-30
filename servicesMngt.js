'use strict'

//Pluguin to manage user services
const { arrayify } = require("seneca-entity/lib/common");

var plugin = function(options) {
    var seneca = this;
    //Servcie modification
    seneca.add("area:services,action:modify_service", function(msg, done){
        console.log("-->modify_service: " + msg.args.query.id);
        var services = this.make("userServices");
        services.list$({ id: msg.args.query.id }, function (err, result) {
            //Error
            if (result[0] == null) {
                err = {Status: '500', Message: 'Data not found'};
                console.log("Error: " + err);
                return done(err);
            }
            console.log("-->-->: userServives.list$ id:" + msg.args.query.id);
            console.log("-->-->: userServices.data$");
            console.log("-->-->: result[0]: " + result[0].id);
            var service = result[0]; // first element
            //Data to upload
            service.data$(
                {
                    user_id: msg.args.query.user_id,
                    day: msg.args.query.day,
                    speciality: msg.args.query.speciality,
                    center: msg.args.query.center,
                }
            );
            console.log("-->-->: userServices.save$");
            service.save$(function (err, result) {
                console.log("-->-->-->: userServices.data$, sercvice " + service);
                done(err, result.data$(false));
            });
        }); 
    });

    //List a unique service
    seneca.add("area:services,action:list_service", function(msg, done){
        console.log("-->list_service: " + msg.args.params.id);
        var service = this.make("userServices");
        service.list$({ id:msg.args.params.id }, done);
    });

    //List all services
    seneca.add("area:services,action:list_services", function(msg, done){
        console.log("-->list_services");
        var services = this.make("userServices");
        services.list$({user_id:msg.args.query.user_id}, done);
    });

    //Create a new service
    seneca.add("area:services,action:create_service", function(msg, done) {
        console.log("-->create_service, user_id: " + msg.args.query.user_id );
       
        //Data to introduce
        var service = this.make("userServices");
        service.user_id = msg.args.query.user_id;
        service.day = msg.args.query.day;
        service.speciality = msg.args.query.speciality;
        service.center = msg.args.query.center;

        service.save$(function(err, service) {
            done(err, service.data$(false));
        })
    });

    //Delete existing service
    seneca.add("area: services,action:delete_service", function(msg, done) {
        console.log("-->delete_service, serviceid: " + msg.args.params.id );
        var service = this.make("userServices");
        service.remove$(msg.args.params.id, function(err) {
            done(err, null);
        });
    });
}
module.exports = plugin;