"use strict";
var hapi=require("@hapi/hapi");
var joi=require("@hapi/joi");
require("dotenv").config();
var mysql=require("mysql");
var server=new hapi.server({
	host:"localhost",
	port:8000
});

server.auth.strategy("base", "cookie", {
  password: "priyaa", // cookie secret
  cookie: "app-cookie", // Cookie name
});

server.route({
  method: "GET",
  path: "/api/*",
  config: {
    validate: {
      payload: {
        //email: Joi.string().email().required(),
        password: Joi.string().min(2).max(200).required()
      }
    },
    handler: function(request, reply) {

    	
      getValidatedUser(request.payload.password)
      .then(function(user){
        if (user) {
          request.auth.session.set(user);
          return reply("Login Successful!");
        } else {
          return reply(Boom.unauthorized("Bad email or password"));
        }
      })
      .catch(function(err){
        return reply(Boom.badImplementation());
      });
      return new Promise((resolve,reject)=>{
            var connection = mysql.createConnection({
                host     : process.env.DB_HOST,
                user     : process.env.DB_USER,
               
                database : process.env.DB_NAME
              });
              connection.connect();
     
              connection.query('SELECT * from producer', function (error, producer, fields) {
                if (error) reject(error);
                resolve(producer);
              });
               
              connection.end();
        })

    }
  }
});