'use strict'

//Pluguin to manage residents
const { arrayify } = require("seneca-entity/lib/common");

var plugin = function(options) {
    var seneca = this;
    //Resident modification
    seneca.add("area:residents,action:modify_resident", function(msg, done){
        console.log("--> modify_resident: " + msg.args.query.user_id);
        var residents = this.make("residents");
        residents.list$({ user_id: msg.args.query.user_id }, function (err, result) {
            //Error
            if (result[0] == null) {
                err = {Status: '500', Message: 'Data not found'};
                console.log("Error: " + err);
                return done(err);
            }
            console.log("-->-->: resident.list$ id: " + msg.args.query.user_id);
            console.log("-->-->: resident.data$");
            var resident = result[0]; // first element
            //Data to upload
            resident.data$(
                {
                    completename: msg.args.query.completename,
                    address: msg.args.query.address,
                    city: msg.args.query.city,
                    phone: msg.args.query.phone,
                    age: msg.args.query.age,
                    sin: msg.args.query.sin,
                }
            );
            console.log("-->-->: resident.save$");
            resident.save$(function (err, result) {
                console.log("-->-->-->: resident.data$, resident: " + resident);
                done(err, result.data$(false));
            });
        }); 
    });

    //List a unique resident
    seneca.add("area:residents,action:list_resident", function(msg, done){
        console.log("-->list_resident by sin: " + msg.args.params.sin);
        var resident = this.make("residents");
        resident.list$({ sin:msg.args.params.sin }, done);
    });
    
    //List a unique resident by user_id
    seneca.add("area:residents,action:list_resident_by_user_id", function(msg, done){
        console.log("-->list_resident by id: " + msg.args.params.user_id);
        var resident = this.make("residents");
        resident.list$({ user_id:msg.args.params.user_id }, done);
    });

    //List all residents
    seneca.add("area:residents,action:list_residents", function(msg, done){
        console.log("-->list_residents");
        var residents = this.make("residents");
        residents.list$({}, done);
    });

    //Create a new resident
    seneca.add("area:residents,action:create_resident", function(msg, done) {
        console.log("-->create_resident, user_id: " + msg.args.query.user_id );
       
        //TO-DO: Don't create resident if resident already exist.
        //Data to introduce
        var resident = this.make("residents");
        resident.user_id = msg.args.query.user_id;

        resident.save$(function(err, resident) {
            done(err, resident.data$(false));
        })
    });

    //Delete existing resident
    seneca.add("area: residents,action:delete_resident", function(msg, done) {
        console.log("-->delete_resident, residenttid: " + msg.args.params.id );
        var resident = this.make("residents");
        resident.remove$(msg.args.params.id, function(err) {
            done(err, null);
        });
    });
}
module.exports = plugin;