var express = require('express')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var cors = require('cors')

var app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(cors());
app.options('*', cors());

//import mongoose from 'mongoose';

const port = 8000;

//DATABASE CONNECTION

mongoose.connect('mongodb+srv://Intern:surya@1999@cluster0-gsvf1.mongodb.net/surya',
{
    dbName : 'surya',
    user : 'Intern',
    pass : 'surya@1999',
    useNewUrlParser : true,
    useUnifiedTopology : true
})
.then( ()=> {
    console.log("Database Connected");
}).catch( err => {
    console.error('unable to connect to Database');
});

app.listen(port, () => {
    console.log('server started at port ' +port);
});

//TABLES CREATION

//user table

const User = new mongoose.Schema({
    uname: {
    type: String
    },
    uemail: {
    type: String
    },
    profilepic: {
    type: String
    }

});

//const uss = new model(uss,UserSchema)
module.exports = mongoose.model('uss',User);

//todo table

const To_do = new mongoose.Schema({

    title: {
        type : String
    },
    description:{
        type : String

    },
	status : {
	type: Boolean,
    },
    deleted: {
        type: Boolean,
    },
    uid : {
        type: String
    }
});

module.exports = mongoose.model('td',To_do);

//const td = new model(td,To_doSchema)

//login table

// const Login = new mongoose.Schema({

//     email: {
//         type: Sequelize.STRING,
    
//     }
// });

// const logi =new model(logi,LoginSchema)

//test api

app.get("/",(req,res)=>{

    res.send('<h1>working')
});

//create user api

app.post('/create/user',async (req,res) => {
    try{

        console.log("api called");
    var user = {
		'name': req.body.uname,
		'email': req.body.uemail,
        'dp':req.body.profilepic
    }
    

        var user_created = User(user);
        await user_created.save((err,user)=>{
            if(err)
                {
                    res.status(400).send("error");

                }
                else
                {
                    console.log("user added");
                    res.status(200).json({
                        success:true,
                        message:'user added to db'

                    });
                }
            })
        }
        catch(error){
            res.status(500)
        }
    });

//         console.log(user_created);

//         if(user_created)
//         {
//             res.status(200).json({
//                 message: "user created successfully !!"
//             });
//             return;
//         }
//    }
//    catch(err){
//     console.log(err);
//     res.status(500).json({
//         message: "user not created !!",
//         error: err
//     });
//     return;
//    }
//     });

