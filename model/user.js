var db = require('./databaseConfig.js');
var config = require('../config.js');

var userDB = {
    getUser: function (userid, callback) {

        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else{
                console.log("***Connected!");
				
                var sql = `SELECT userid,email,username FROM user WHERE userid = '${userid}'`;

			
				conn.query(sql, [], function(err, result){

                    conn.end();
                    if(err){
                        console.log(err);
                        return callback(err, null);
                    }
					//V1
					else { 
						console.log(result);
						return callback(null, result);

                    }
					//V2 for showing of only 1 record
					/*else { 
						var arrResult=[]
						console.log(result);
						arrResult.push(result[0]);//show only 1 matching record
                        //return callback(null, result);
						return callback(null, arrResult);

                    }*/
                });
            }
        });
    },

	getUsers: function (callback) {

        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else{
                console.log("***Connected!");
				
                var sql = 'SELECT userid,username,email FROM user ';
                conn.query(sql, [], function(err, result){
                    conn.end();
                    if(err){
                        console.log(err);
                        return callback(err, null);
                    } else {  
                        return callback(null, result);
                    }
                });
            }
        });
    },
    insertUser:function(username,email,role,password,callback){

        var dbConn=db.getConnection();

        dbConn.connect(function(err){

            if(err){
                console.log(err);
                return callback(err,null);

            }else{
                var sql=`insert into user(username,email,role,password) Values('${username}','${email}','${role}','${password}')`;

                dbConn.query(sql,[],function(err,result){

                    dbConn.end();
                    if(err){
                        console.log(err);
                    }else{

                        console.log(result);
                    }
                    return callback(err,result);
                });
            }
        });
    }
};

module.exports = userDB;

