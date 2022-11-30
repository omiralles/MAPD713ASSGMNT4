'use strict'

/*
@Autors
Name: Oscar Miralles
Student ID: 301250756
Name: Carlos Hernandez
Student ID: 301290263
*/

//Program requeriments
var seneca = require('seneca')()
const entities = require('seneca-entity');
const mongo_store = require('seneca-mongo-store');
const web = require("seneca-web");


//Pluguins declarations
var express = require('express');
  var app = express();
  var config = {
    routes:[{
        prefix : '/users',
        pin: "area:users,action:*",
        map:{
            login: {GET: true, alias: '/user/login/'},
            list_user: {GET: true, alias: '/user/:id'},
            list_users: {GET: true, alias: '/users/'},
            create_user: {POST: true, alias: '/users/'},
            delete_user: {DELETE:true, alias: '/user/:id'},
            change_password: {PUT: true, alias: '/user/changepass/'},
            modify_user: {PUT: true, alias: '/users/'}
        }
    },
    {
        prefix : '/residents',
        pin: "area:residents,action:*",
        map:{
            create_resident: {POST: true, alias: '/residents/'},
            list_resident: {GET: true, alias: '/resident/bysin/:sin'},
            list_resident_by_user_id: {GET: true, alias: '/resident/byid/:user_id'},
            list_residents: {GET: true, alias: '/residents/'},
            modify_resident: {PUT: true, alias: '/residents/'},
            delete_resident: {DELETE: true, alias: '/residents/:id'}
        }
    },
    {
      prefix : '/services',
      pin: "area:services,action:*",
      map:{
          create_service: {POST: true, alias: '/services/'},
          list_service: {GET: true, alias: '/services/:id'},
          list_services: {GET: true, alias: '/services/'},
          modify_service: {PUT: true, alias: '/services/'},
          delete_service: {DELETE: true, alias: '/services/:id'}
      }
  },
    {
        prefix : '/residentRecords',
        pin: "area:residentRecords,action:*",
        map:{
            create_record: {POST: true, alias: '/residentRecords/'},
            list_record: {GET: true, alias: '/residentRecords/record/:id'},
            list_records: {GET: true, alias: '/residentRecords/:user_id'},
            list_all_records: {GET: true, alias: '/residentRecords/'},
            modify_record: {PUT: true, alias: '/residentRecords/'},
            delete_record: {DELETE: true, alias: '/residentRecords/:id'}
        }
    }],
    adapter: require('seneca-web-adapter-express'),
    options: {parseBody: false},
    context: app
};

app.use( require("body-parser").json() );

//Import pluguins and create service
seneca
  .use(entities)
  .use('./loginMngt.js')
  .use('./residentsMngt.js')
  .use('./residentRecordsMngt.js')
  .use('./servicesMngt.js')
  .use(web, config)
  .use(mongo_store, {
    uri: 'mongodb://127.0.0.1:27017/clinicDB'
  })
  .ready(() => {
    var server = seneca.export('web/context')()

    server.listen('3000', () => {
      console.log('server started on: 3000')
    })
    console.log("Server listening on: //localhost:"+3000);
    console.log("--- Actions -----------");
    console.log("http://localhost:3000/users/login/?email=email&password=password");
    console.log("http://localhost:3000/users/<userid>");
    console.log("http://localhost:3000/users/");
    console.log("http://localhost:3000/users/user=username&password=password&profile=profile");
    console.log("http://localhost:3000/users/<userid>");
    console.log("http://localhost:3000/residents/");
    console.log("http://localhost:3000/residents/<user_id>");
    console.log("http://localhost:3000/residents/sin=sinnumber&completename=complitename&age=age&address=address&servicetype=servicetype&day=day&hour=hour");
    console.log("http://localhost:3000/residents/<id>");
    console.log("http://localhost:3000/residents/<id>");
  })