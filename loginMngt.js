'use strict'

const { arrayify } = require("seneca-entity/lib/common");

//Pluguin to manage app users
var plugin = function(options) {
    var seneca = this;
    //Login management
    seneca.add("area:users,action:login", function(msg, done){
        console.log("-->login_user: " + msg.args.query.email + " password : " + msg.args.query.password);        
        var users = this.make("users");
        users.list$({ email:msg.args.query.email, password:msg.args.query.password }, done);
    });

    //List a app user
    seneca.add("area:users,action:list_user", function(msg, done){
        console.log("-->list_user: " + msg.args.params.id);
        var users = this.make("users");
        users.list$({ id:msg.args.params.id }, done);
    });

    //list all users
    seneca.add("area:users,action:list_users", function(msg, done){
        console.log("-->list_users");
        var users = this.make("users");
        users.list$({}, done);
    });

    //Create a new user
    seneca.add("area:users,action:create_user", function(msg, done) {
        console.log("-->create_user, username: "+ msg.args.query.email );
       
        var users = this.make("users");
        users.name = msg.args.query.name;
        users.email = msg.args.query.email;
        users.password = msg.args.query.password;
        users.profile = msg.args.query.profile;

        users.save$(function(err, users) {
            done(err, users.data$(false));
        })
    });

    //Delete a user
    seneca.add("area: users,action:delete_user", function(msg, done) {
        console.log("-->delete_user, id: " + msg.args.params.id );
        var users = this.make("users");
        users.remove$(msg.args.params.id, function(err) {
            done(err, null);
        });
    });

     //Change password
     seneca.add("area:users,action:change_password", function(msg, done){
        console.log("-->user_id: " + msg.args.query.id);
        var users = this.make("users");
        users.list$({ id: msg.args.query.id }, function (err, result) {
            if (result[0] == null) { 
                return done(err); 
            }
            console.log("-->-->: result[0]: " + result[0].id);
            var user = result[0]; // first element
            //Data to upload
            user.data$(
                {
                    password: msg.args.query.password,                    
                }
            );
            console.log("-->-->: user.save$");
            user.save$(function (err, result) {
                console.log("-->-->-->: user.data$, user: " + user);
                done(err, result.data$(false));
            });
        });
    });

    //Modify user
    seneca.add("area:users,action:modify_user,fatal$:false", function(msg, done){
        console.log("-->user_id: " + msg.args.query.id);
        var users = this.make("users");
        users.list$({ id: msg.args.query.id }, function (err, result) {
            //Error
            if (result[0] == null) {
                err = {Status: '500', Message: 'Data not found'};
                console.log("Error: " + err);
                return done(err);
            }
            console.log("-->-->: result[0]: " + result[0].id);
            var user = result[0]; // first element
            //Data to upload
            user.data$(
                {
                    user: msg.args.query.user,
                    email: msg.args.query.email,
                    profile: msg.args.query.profile,
                }
            );
            console.log("-->-->: user.save$");
            user.save$(function (err, result) {
                console.log("-->-->-->: user.data$, user: " + user);
                done(err, result.data$(false));
            });
        }); 
    });
}
module.exports = plugin;