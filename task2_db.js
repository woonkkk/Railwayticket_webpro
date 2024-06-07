const express = require('express');
const path = require('path');
const dotenv = require("dotenv");
const app = express();
dotenv.config();
const router = express.Router();
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const secret = "ThaiRailways";

// connect two port web service
const cors = require('cors');
app.use(cors());

// req.body --> put, post
// req.params --> get

// for cennect to database
var dbConn = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
});

dbConn.connect(function (err) {
    if (err) throw err;
    console.log(`Connect DB: ${process.env.MYSQL_DATABASE}`)
});

app.use(router);
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

app.listen(process.env.PORT, function () {
    console.log(`Server listening on port: ${process.env.PORT}`)
});

router.use(express.static(__dirname));
router.get('/', (req, res) => {
    res.send('Port work !');
    console.log('Someone accessed localhost: 3000')
});

// 2.1 Authentication Service
router.post('/db_login', function (req, res) {
    let username = req.body.username;
    dbConn.query('SELECT * FROM adminlogin WHERE admin_username = ? AND admin_password = ?', [req.body.username, req.body.password],
    function (error, results, fields) {
        if (error){
            res.json({'status': 'error', 'message': error})
        }else if(results.length == 0){
            res.json({'status': 'error', 'message': 'Invalid username or password'})
        }else{
            //create token for help http remember login username and password 
            let tokens = jwt.sign({username}, 'secretkey', {expiresIn: '1h'});
            res.json({status: 'success', token: tokens, message: 'Login Success'})
        }
    });
});

// Checking admin username and password
// method: POST
// URL: http://localhost:3000/db_login
// body: raw JSON

// Test case 1 

// input:body
// {
//     "username": "foxzfoxzfoxz",
//     "password": "08041999"
// }
// output:
// {
//     "status": "success",
//     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImZveHpmb3h6Zm94eiIsImlhdCI6MTY4MjI0NzE2OSwiZXhwIjoxNjgyMjUwNzY5fQ.qj7Rh14TRy797qFUN3fXxCe_KnsrBKioLqfwmEvc-rM",
//     "message": "Login Success"
// }

// Test case 2 

// input:body
// {
//     "username": "nishinoya",
//     "password": "10101995"
// }
// output:
// {
//     "status": "success",
//     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5pc2hpbm95YSIsImlhdCI6MTY4MjI1ODE5MCwiZXhwIjoxNjgyMjYxNzkwfQ.K1B2sjNVVPJ1rWEQ9E6NmfWGiiUFkAwz-lxZSVLYj8w",
//     "message": "Login Success"
// }

// check token is valid or not
router.post('/db_authen', function (req, res) {
    try {
        let checktoken = req.headers.authorization.split(' ')[1];
        let decoded = jwt.verify(checktoken, 'secretkey');
        res.json({status: 'success', message: 'Token is valid'})
    }
    catch (err) {
        res.json({status: 'error', message: 'Token is invalid'})
    }
});

// Testing token
// method: POST
// URL: http://localhost:3000/db_authen
// body: raw JSON

// output:
// {
//     "status": "success",
//     "message": "Token is valid"
// }


// 2.2 Administrators Service
// SELECT admin info
router.post('/getadmin', function (req, res) {
    let admin_id = req.body.adminID;
    let admin_username = req.body.admin_username;
    let admin_fullname = req.body.admin_fullname;
    dbConn.query('SELECT * FROM adminregister', function (error, results, fields) {
        if (error) throw error;
        else{
            let query_json = [];
            let count = 0;
            for(let i = 0; i < results.length; i++){
                if (admin_id != "" && results[i].adminID != admin_id){
                    continue;
                }
                if (admin_username != "" && results[i].admin_username != admin_username){
                    continue;
                }
                if (admin_fullname != "" && results[i].admin_fullname != admin_fullname){
                    continue;
                }
                query_json[count] = results[i];
                console.log(results[i])
                count++;
            }
            return res.send({ status: 'success', data: query_json, message: 'Admin list.' });
        }

    });
});

// Testing select a admin
// method: POST
// URL: http://localhost:3000/getadmin
// body: raw JSON

// Test case 1
// input:
// {
//     "adminID": "111",
//     "admin_username" : "",
//     "admin_fullname" : ""
// }
// output:
// {
//     "status": "success",
//     "data": [
//         {
//             "adminID": 111,
//             "admin_fullname": "Manee Meethong",
//             "admin_username": "Manee",
//             "admin_email": "Manee.mee@student.mahidol.edu",
//             "admin_phonenum": "0800751590",
//             "admin_role": "admin",
//             "admin_address": "229/11",
//             "admin_password": "11113888",
//             "admin_confpassword": "11113478"
//         }
//     ],
//     "message": "Admin list."
// }

// Test case 2
// input:
// {
//     "adminID": "99",
//     "admin_username" : "",
//     "admin_fullname" : ""
// }
// output:
// {
//     "status": "success",
//     "data": [
//         {
//             "adminID": 99,
//             "admin_fullname": "Sasasuang Pattanakitjaroenchai",
//             "admin_username": "Sasasuang",
//             "admin_email": "Sasasuang.pat@student.mahidol.edu",
//             "admin_phonenum": "0830753204",
//             "admin_role": "manager",
//             "admin_address": "229/33",
//             "admin_password": "12345678",
//             "admin_confpassword": "12345678"
//         }
//     ],
//     "message": "Admin list."
// }

// INSERT admin
router.post('/add_admin', function (req, res) {
    try{
        dbConn.query('INSERT INTO adminregister (admin_fullname, admin_username, admin_email, admin_phonenum, admin_role, admin_address, admin_password, admin_confpassword) VALUES (?,?,?,?,?,?,?,?)',
        [req.body.admin_fullname, req.body.admin_username, req.body.admin_email, req.body.admin_phonenum, req.body.admin_role, req.body.admin_address, req.body.admin_password, req.body.admin_confpassword],
        function (error, results, fields) {
            if (error) throw error;
            return res.send({ status: 'success', data: results, message: 'Admin has been created successfully.' });
        });
    }
    catch(error){
        console.log(error);
    }
});

// Testing add a new admin
// method: POST
// URL: http://localhost:3000/add_admin
// body: raw JSON

// Test case 1

// {
//     "adminID": 12,
//     "admin_fullname": "Itthirit Ngamsaard",
//     "admin_username": "Itthirit",
//     "admin_email": "Itthirit.nga@student.mahidol.edu",
//     "admin_phonenum": "0830753211",
//     "admin_role": "manager",
//     "admin_address": "229/33",
//     "admin_password": "08041999",
//     "admin_confpassword": "08041999"
// }
// output:
// {
//     "status": "success",
//     "data": {
//         "fieldCount": 0,
//         "affectedRows": 1,
//         "insertId": 113,
//         "info": "",
//         "serverStatus": 2,
//         "warningStatus": 0
//     },
//     "message": "Admin has been created successfully."
// }

// Test case 2

// {
//     "adminID": 33,
//     "admin_fullname": "Prin Suparat",
//     "admin_username": "Prin",
//     "admin_email": "Prin.sup@student.mahidol.edu",
//     "admin_phonenum": "0914624556",
//     "admin_role": "manager",
//     "admin_address": "229/33",
//     "admin_password": "19032533",
//     "admin_confpassword": "19032533"
// }
// output:
// {
//     "status": "success",
//     "data": {
//         "fieldCount": 0,
//         "affectedRows": 1,
//         "insertId": 114,
//         "info": "",
//         "serverStatus": 2,
//         "warningStatus": 0
//     },
//     "message": "Admin has been created successfully."
// }

router.post('/deleteadmin', function (req, res) {
    dbConn.query('DELETE FROM adminregister WHERE adminID = ?', [req.body.adminID], function (error, results) {
        if (error) throw error;
        return res.send({ status: 'success', data: results.affectedRows, message: 'Admin has been deleted successfully.' });
    });
});

// Testing delete a admin
// method: POST
// URL: http://localhost:3000/deleteadmin
// body: raw JSON

// Test case 1

// input:
// {
//     "adminID": 99
// }
// output:
// {
//     "status": "success",
//     "data": 1,
//     "message": "Admin has been deleted successfully."
// }

// Test case 2

// {
//     "adminID": 100
// }
// output:
// {
//     "status": "success",
//     "data": 1,
//     "message": "Admin has been deleted successfully."
// }


//UPDATE admin 
router.put('/updateadmin', function (req, res) {
    let adminregister = req.body.adminregister;
    console.log("admin body:", adminregister)
    let adminID = req.body.adminregister.adminID;
    console.log("adminID", adminID)
    if (!adminID || !adminregister) {
        return res.status(400).send({ error: adminregister, message: 'Please provide admin information' });
    }
    dbConn.query("UPDATE adminregister SET ? WHERE adminID = ?", [adminregister, adminID], function (error, results) {
        if (error) throw error;
        return res.send({ status: 'success', data: results.affectedRows, message: 'Admin has been updated successfully.' })
    });
    // console.log("finish task2_bd > updateadmin");
});

// Testing Update a admin
// method: PUT
// URL: http://localhost:3000/updateadmin
// body: raw JSON

// test case 1

// {
//     "adminregister":
//          {
//              "adminID": 111,
//              "admin_fullname": "Manee Meejai",
//              "admin_username": "Manee",
//              "admin_email": "Manee.mee@student.mahidol.edu",
//              "admin_phonenum": "0814825757",
//              "admin_role": "creator",
//              "admin_address": "229/32",
//              "admin_password": "11113888",
//              "admin_confpassword": "11113888"
//          }
//  }

// test case 2
// {
//     "adminregister":
//          {
//              "adminID": 99,
//              "admin_fullname": "Sasasuang Pattanakitjaroenchai",
//              "admin_username": "qndska",
//              "admin_email": "Sasasuang.pat@student.mahidol.edu",
//              "admin_phonenum": "0830753204",
//              "admin_role": "manager",
//              "admin_address": "229/33",
//              "admin_password": "12345678",
//              "admin_confpassword": "12345678"
//          }
//  }

//SELECT> search ticket
router.post('/gettickets', function (req, res) {
    let departure_station = req.body.departure_station;
    let terminal_station = req.body.terminal_station;
    let available_date = req.body.available_date;
    dbConn.query('SELECT * FROM new_tickets', function (error, results, fields) {
        if (error)
            throw error;
        else{
            //console.log(results)
            //create empty json
            let query_json = [];
            let count = 0;
            for (let i = 0; i < results.length; i++) {
                if (departure_station != "" && departure_station != results[i].departure_station) {
                    continue;
                }
                if (terminal_station != "" && terminal_station != results[i].terminal_station) {
                    continue;
                }
                if (available_date != "" && available_date != results[i].available_date) {
                    continue;
                }
                query_json[count] = results[i];
                count++;
            }
            return res.send({ status: 'success', data: query_json, message: 'Tickets list.' });
        }
    });
});

// Testing select all ticket
// method: POST
// URL: http://localhost:3000/gettickets
// body: raw JSON

//test case 1

// input: select all tickets
// {
//     "departure_station": "",
//     "terminal_station": "",
//     "available_date": ""
// }

//test case 2

// input: Select terminal_station = Chiang Mai
// {
//     "departure_station": "",
//     "terminal_station": "Chiang Mai",
//     "available_date": ""
// }
// output:
// {
//     "status": "success",
//     "data": [
//         {
//             "id": 7,
//             "departure_station": "Kra Bi",
//             "terminal_station": "Chiang Mai",
//             "ticket_type": "KAS",
//             "train_number": "7",
//             "available_date": "2023-04-23"
//         }
//     ],
//     "message": "Tickets list."
// }

// UPDATE ticket 
router.put('/updatetickets', function (req, res) {
    let id = req.body.new_tickets.id;
    console.log("ticketid:", id)
    let new_tickets = req.body.new_tickets;
    console.log("ticket body:",new_tickets)
    if (!id|| !new_tickets) {
        return res.status(400).send({ error: new_tickets, message: 'Please provide ticket information' });
    }
    dbConn.query("UPDATE new_tickets SET ? WHERE id = ?", [new_tickets, id], function (error, results) {
        if (error) throw error;
        return res.send({ status: 'success', error: false, data: results.affectedRows, message: 'Tickets has been updated successfully.' })
    });
});

// Testing Update a ticket
// method: PUT
// URL: http://localhost:3000/updatetickets
// body: raw JSON

// test case 1

// {
//     "new_tickets":
//          {
//              "id": 7,
//              "departure_station": "Kra Bi",
//              "terminal_station": "Chiang Mai",
//              "ticket_type": "KAS",
//              "train_number": "7",
//              "available_date": "2023-04-23"
//          }
//  }
//Output
// {
//     "error": false,
//     "data": 1,
//     "message": "Tickets has been updated successfully."
// }

// test case 2

// {
//     "new_tickets":
//          {
//              "id": 2,
//              "departure_station": "Chiang Mai",
//              "terminal_station": "BKK",
//              "ticket_type": "FAS",
//              "train_number": "5",
//              "available_date": "2023-04-22"
//          }
//  }
//Output
// {
//     "error": false,
//     "data": 1,
//     "message": "Tickets has been updated successfully."
// }

//INSERT new ticket
router.post('/addtickets', function (req, res) {
    let departure_station = req.body.departure_station;
    let terminal_station = req.body.terminal_station;
    let ticket_type = req.body.ticket_type;
    let train_number = req.body.train_number;
    let available_date = req.body.available_date;
    if (!departure_station || !terminal_station || !ticket_type || !train_number || !available_date) {
        return res.status(400).send({ status: 'infomation is have null', message: 'Please provide all required information' });
    }
    dbConn.query("INSERT INTO new_tickets (departure_station, terminal_station, ticket_type, train_number, available_date) VALUES (?, ?, ?, ?, ?)", [departure_station, terminal_station, ticket_type, train_number, available_date],
    function (error, results) {
        if(error){
            res.json({status: 'error' , message: error});
        }else{
            res.json({status: 'success' , message: 'Ticket added successfully'});
        }
    });
});

// Testing add a ticket
// mathod: POST
// URL: http://localhost:3000/addtickets
// body: raw JSON

//test case 1

// {
//     "id": 12,
//     "departure_station": "Rayong",
//     "terminal_station": "BKK",
//     "ticket_type": "KAS",
//     "train_number": "5",
//     "available_date": "2023-05-11"    
// }
//Output
// {
//     "status": "success",
//     "message": "Ticket added successfully"
// }

//test case 2
// {
//     "id": 16,
//     "departure_station": "Nakhon Pathom",
//     "terminal_station": "BKK",
//     "ticket_type": "SAD",
//     "train_number": "1",
//     "available_date": "2023-08-27"    
// }
//Output
// {
//     "status": "success",
//     "message": "Ticket added successfully"
// }

router.post('/deletetickets', function (req, res) {
    let ticket_id = req.body.ticket_id;
    if (!ticket_id) {
        return res.status(400).send({ error: true, message: 'Please provide ticket_id' });
    }
    dbConn.query('DELETE FROM new_tickets WHERE id = ?', [ticket_id], function (error, results) {
        if (error){
            res.json({status: 'error' , message: error});
        }
        else{
            res.json({status: 'success' , message: 'Ticket has been deleted successfully.' });
        }
    });
})

// Testing Delete a ticket
// mathod: POST
// URL: http://localhost:3000/deletetickets
// body: raw JSON

// test case 1

// {
//     "ticket_id": 1
// }
// Output
// {
//     "status": "success",
//     "message": "Ticket has been deleted successfully."
// }

// test case 2

// {
//     "ticket_id": 2
// }
// Output
// {
//     "status": "success",
//     "message": "Ticket has been deleted successfully."
// }

router.use((req, res, next) => {
    res.status(404)
})

module.exports = router;

