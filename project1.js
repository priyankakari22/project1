"use strict";
var hapi=require("@hapi/hapi");
var joi=require("@hapi/joi");
require("dotenv").config();
var mysql=require("mysql");
var server=new hapi.server({
	host:"localhost",
	port:8000
});
// section 1:/api/producer
server.route({
	method:"GET",
	path:"/",
	handler:(request,reply)=>{
		return "welcom to api server";

	}
})
//1.1

server.route({
    method:"GET",
    path:"/api/producer",
 handler:(request,reply)=>{
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
})

//1.2
server.route({
	method:"POST",
	path:"/api/producer",
	handler:(request,reply)=>{
		var error=[];
		var c=0;
		var data=request.payload;
		if(data.producerName.length>32){
			error.push("producerName must be less than 32 characters and can't contain XxXxStr8exXxX");
			c++;
		}
		if(data.producerName.includes( "XxXxStr8exXxX")==true){
			error.push("producerName can't containt text like XxXxStr8exXxX");
			c++;
		}
		if(data.Email.includes("@gmail.com")==false){
			error.push("Email must be valid");
			c++;
		}
		if(data.Email.length>256){
			error.push("Email must be less than 256");
			c++;
		}
		if(data.twitterName.length>16){
			error.push("twitterName is must be less than 16");
			c++;
		}
		if(data.soundcloudName.length>32){
			error.push("soundcloudName is must be less than 32");
			c++;
		}
		if((data.producerStatus!="not ready")&&(data.producerStatus!="none")&&(data.producerStatus!="featured")){
			error.push("producerStatus doesn't exist");
			c++;

		}
		if(c!=0)
			return error;

		
		else
		{
			return new Promise((resolve,reject)=>{
			var connection=mysql.createConnection({
				host     : process.env.DB_HOST,
                user     : process.env.DB_USER,
               
                database : process.env.DB_NAME
            });
              connection.connect();
              var sql="insert into producer(producerName, Email, passwordHash, twitterName, soundcloudName,producerStatus) values('"+data.producerName+"','"+data.Email+"','"+data.passwordHash+"','"+data.twitterName+"','"+data.soundcloudName+"','"+data.producerStatus+"')";
              connection.query(sql,function(error,producer,feilds){
                if (error) reject(error);
                resolve(producer);
              });
               
              connection.end();
     

		
		})
		}
	}
})
//1.3
server.route({
	method:"GET",
	path:"/api/producer/{id}",
	handler:(request,reply)=>{
		var id=request.params.id;
		return new Promise((resolve,reject)=>{
			var connection=mysql.createConnection({
				host:process.env.DB_HOST,
				user:process.env.DB_USER,
				database:process.env.DB_NAME
			})
			connection.connect();
			connection.query(`SELECT * from producer where producerId=${id}`,function(error,producer,feilds){
				if(error)reject(error);
				resolve(producer);
			})
			connection.end();

		})

	}
})
server.route({
	method:"DELETE",
	path:"/api/producer/{id}",
	handler:(request,reply)=>{
		var id=request.params.id;
		var data=request.payload;
		return new Promise((resolve,reject)=>{
			var connection=mysql.createConnection({
				host: process.env.DB_HOST,
				user:process.env.DB_USER,
				database:process.env.DB_NAME
			});
			connection.connect();
			var sql=`delete from producer  where producerId=${id}`;
			connection.query(sql,function(error,producer,feilds){
				if(error) reject(error);

				resolve(producer);
				
			});
			connection.end();
		})
	}
})
server.route({
	method:"PUT",
	path:"/api/producer/{id}",
	handler:(request,reply)=>{
		var id=request.params.id;
		var error=[];
		var c=0;
		var data=request.payload;
		if(data.producerName.length>32){
			error.push("producerName must be less than 32 characters and can't contain XxXxStr8exXxX");
			c++;
		}
		if(data.producerName.includes( "XxXxStr8exXxX")==true){
			error.push("producerName can't containt text like XxXxStr8exXxX");
			c++;
		}
		if(data.Email.includes("@gmail.com")==false){
			error.push("Email must be valid");c++;
		}
		if(data.Email.length>256){
			error.push("Email must be less than 256");c++;
		}
		if(data.twitterName.length>16){
			error.push("twitterName is must be less than 16");c++;
		}
		if(data.soundcloudName.length>32){
			error.push("soundcloudName is must be less than 32");c++;
		}
		if((data.producerStatus!="not ready")&&(data.producerStatus!="none")&&(data.producerStatus!="featured")){
			error.push("producerStatus doesn't exist");c++;

		}
		if(c!=0)
			return error;
		else
		{
			return new Promise((resolve,reject)=>{
			var connection=mysql.createConnection({
				host     : process.env.DB_HOST,
                user     : process.env.DB_USER,
               
                database : process.env.DB_NAME
            });
              connection.connect();
              var sql=`update producer set producerName='${data.producerName}'where producerId=${id}`;
              connection.query(sql,function(error,producer,feilds){
                if (error) reject(error);
                resolve(producer);
              });
               
              connection.end();
          })
		}
	}
})

server.route({
	method:"GET",
	path:"/api/producer/{id}/approvedBeats",
	handler:(request,reply)=>{
		var id=request.params.id;
		var data=request.payload;
		return new Promise((resolve,reject)=>{
			var connection=mysql.createConnection({
				host: process.env.DB_HOST,
				user:process.env.DB_USER,
				database:process.env.DB_NAME
			});
			connection.connect();
			var sql=`SELECT beatName ,producerName from producer inner join beat on producer.producerId=beat.producer_id where approvalDate is not null and postDate_time is not null and approved=1 and producerId=${id}`;
			connection.query(sql,function(error,beat,feilds){
				if(error) reject(error);

				resolve(beat);
			});
			connection.end();
		})

	}

})
server.route({
	method:"GET",
	path:"/api/producer/submitDate",
	handler:(request,reply)=>{
		//var id=request.params.id;
		var data=request.payload;
		return new Promise((resolve,reject)=>{
			var connection=mysql.createConnection({
				host: process.env.DB_HOST,
				user:process.env.DB_USER,
				database:process.env.DB_NAME
			});
			connection.connect();
			var sql=`SELECT beatName,producerName,approved from producer inner join beat on producer.producerId=beat.producer_id where approved=1 || approved=0`;
			connection.query(sql,function(error,beat,feilds){
				if(error) reject(error);
				resolve(beat);
			});
			connection.end();
		})

	}

})
server.route({
	method:"GET",
	path:"/api/beat/submitted",
	handler:(request,reply)=>{
		//var id=request.params.id;
		var data=request.payload;
		return new Promise((resolve,reject)=>{
			var connection=mysql.createConnection({
				host: process.env.DB_HOST,
				user:process.env.DB_USER,
				database:process.env.DB_NAME
			});
			connection.connect();
			var sql=`SELECT * from beat where submitDate!= "null" and approved=0 `;
			connection.query(sql,function(error,beat,feilds){
				if(error) reject(error);
				resolve(beat);
			});
			connection.end();
		})

	}

})
server.route({
	method:"GET",
	path:"/api/beat/approved",
	handler:(request,reply)=>{
		//var id=request.params.id;
		var data=request.payload;
		return new Promise((resolve,reject)=>{
			var connection=mysql.createConnection({
				host: process.env.DB_HOST,
				user:process.env.DB_USER,
				database:process.env.DB_NAME
			});
			connection.connect();
			var sql=`select * from beat where approved=1 and postDate_time between "1800-01-01 01:01:01" and "2000-01-10 01:01:01" `;
			connection.query(sql,function(error,beat,feilds){
				if(error) reject(error);
				resolve(beat);
			});
			connection.end();
		})

	}

})
server.route({
	method:"GET",
	path:"/api/beat/posted/{id}",
	handler:(request,reply)=>{
		var id=request.params.id;
		//var data=request.payload;
		return new Promise((resolve,reject)=>{
			var connection=mysql.createConnection({
				host: process.env.DB_HOST,
				user:process.env.DB_USER,
				database:process.env.DB_NAME
			});
			connection.connect();
			var sql=`select * from beat where approved=1 && postDate_time >'${id}' &&  postDate_time < current_timestamp `;
			connection.query(sql,function(error,beat,feilds){
				if(error) reject(error);
				resolve(beat);
			});
			connection.end();
		})

	}

})
server.route({
	method:"GET",
	path:"/api/beat/pending",
	handler:(request,reply)=>{
		var id=request.params.id;
		//var data=request.payload;
		return new Promise((resolve,reject)=>{
			var connection=mysql.createConnection({
				host: process.env.DB_HOST,
				user:process.env.DB_USER,
				database:process.env.DB_NAME
			});
			connection.connect();
			var sql=`select * from beat where approved=1 and approvalDate > current_timestamp `;
			connection.query(sql,function(error,beat,feilds){
				if(error) reject(error);
				resolve(beat);
			});
			connection.end();
		})

	}

})
server.route({
	method:"POST",
	path:"/api/beats",
	handler:(request,reply)=>{
		var id=request.params.id;
		var data=request.payload;
		var a=[];
		var c=0;
		if(data.beatName.length>64)
		{
			a.push("length must be less than 64");
			c++;
		}
		if(data.beatName.includes("must listen")== true){
			a.push("plss enter proper text");
			c++;
		}
		if(c!=0)
		{
			return a;
		}
		else
		{
		return new Promise((resolve,reject)=>{
			var connection=mysql.createConnection({
				host: process.env.DB_HOST,
				user:process.env.DB_USER,
				database:process.env.DB_NAME
			});
			connection.connect();
			var sql=`insert into beat(beatName,beatURL,Approved,producer_id,approvalDate,submitDate,postDate_time) values('${data.beatName}','${data.beatURL}',${data.approved},${data.producer_id}
			,'${data.approvalDate}','${data.submitDate}','${data.postDate_time}')`;
			connection.query(sql,function(error,beat,feilds){
				if(error) reject(error);

				resolve(beat);
			});
			connection.end();
		})

	}

}

})
server.route({
	method:"GET",
	path:"/api/beat/{id}",
	handler:(request,reply)=>{
		var id=request.params.id;
		var data=request.payload;
		return new Promise((resolve,reject)=>{
			var connection=mysql.createConnection({
				host: process.env.DB_HOST,
				user:process.env.DB_USER,
				database:process.env.DB_NAME
			});
			connection.connect();
			var sql=`select * from beat where beatId=${id}`;
			connection.query(sql,function(error,beat,feilds){
				if(error) reject(error);
				resolve(beat);
			});
			connection.end();
		})

	}

})
server.route({
	method:"DELETE",
	path:"/api/beats/{id}",
	handler:(request,reply)=>{
		var id=request.params.id;
		var data=request.payload;
		return new Promise((resolve,reject)=>{
			var connection=mysql.createConnection({
				host: process.env.DB_HOST,
				user:process.env.DB_USER,
				database:process.env.DB_NAME
			});
			connection.connect();
			var sql=`delete from beat where beatId=${id}`;
			connection.query(sql,function(error,beat,feilds){
				if(error) reject(error);
				resolve(beat);
			});
			connection.end();
		})

	}

})
server.route({
	method:"PUT",
	path:"/api/beats3/{id}",
	handler:(request,reply)=>{
		var id=request.params.id;
		var data=request.payload;
		return new Promise((resolve,reject)=>{
			var connection=mysql.createConnection({
				host: process.env.DB_HOST,
				user:process.env.DB_USER,
				database:process.env.DB_NAME
			});
			connection.connect();
			var sql=`update beat set beatName='${data.beatName}' where beatId=${id}`;
			connection.query(sql,function(error,beat,feilds){
				if(error) reject(error);
				resolve(beat);
			});
			connection.end();
		})

	}

})
server.route({
	method:"PUT",
	path:"/api/beats/unapprove/{id}",
	handler:(request,reply)=>{
		var id=request.params.id;
		var data=request.payload;
		return new Promise((resolve,reject)=>{
			var connection=mysql.createConnection({
				host: process.env.DB_HOST,
				user:process.env.DB_USER,
				database:process.env.DB_NAME
			});
			connection.connect();
			var sql=`update beat set approved='${data.approved}',approvalDate='${data.approvalDate}',postDate_time='${data.postDate_time}' where beatId=${id}`;
			connection.query(sql,function(error,beat,feilds){
				if(error) reject(error);
				resolve(beat);
			});
			connection.end();
		})

	}

})
server.route({
	method:"GET",
	path:"/api/beattable",
	handler:(request,reply)=>{
		var id=request.params.id;
		var data=request.payload;
		return new Promise((resolve,reject)=>{
			var connection=mysql.createConnection({
				host: process.env.DB_HOST,
				user:process.env.DB_USER,
				database:process.env.DB_NAME
			});
			connection.connect();
			var sql=`select * from beat`;
			connection.query(sql,function(error,beat,feilds){
				if(error) reject(error);
				resolve(beat);
			});
			connection.end();
		})

	}

})
server.route({
	method:"PUT",
	path:"/api/beats/approve/{id}",
	handler:(request,reply)=>{
		var id=request.params.id;
		var data=request.payload;
		return new Promise((resolve,reject)=>{
			var connection=mysql.createConnection({
				host: process.env.DB_HOST,
				user:process.env.DB_USER,
				database:process.env.DB_NAME
			});
			connection.connect();
			var sql=`update beat set approvalDate='${data.approvalDate}',postDate_time='${data.postDate_time}' where beatId=${id}`;
			connection.query(sql,function(error,beat,feilds){
				if(error) reject(error);
				resolve(beat);
			});
			connection.end();
		})

	}

})
server.start((err)=>{
    if(err) throw err;
})
console.log("Server is started");
