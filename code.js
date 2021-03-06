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
    // dbName : 'surya',
    // user : 'Intern',
    // pass : 'surya@1999',
    useNewUrlParser : true,
    useUnifiedTopology : true
})
.then( ()=> {
    console.log("Database Connected");
}).catch( err => {
    console.error('unable to connect to Database'+err);
});


app.listen(port, () => {
    console.log('server started at port ' +port);
});


// require("./model/localDB")

//TABLES CREATION

//user table

const User = new mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
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

const uss = new mongoose.model('uss',User)
//module.exports = mongoose.model('uss',User);

//todo table

const To_do = new mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,

    title: {
        type : String
    },
    description:{
        type : String

    },
	status : {
    type: Boolean,
    default : false
    },
    deleted: {
        type: Boolean,
        default : false
    },
    uid : {
        required:true,
        type: mongoose.Schema.Types.ObjectId,
        ref : 'uss'
    }
});
const td = new mongoose.model('td',To_do)
//module.exports = mongoose.model('td',To_do);

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
        _id : new mongoose.Types.ObjectId(),
		uname: req.body.name,
		uemail: req.body.email,
        profilepic :req.body.pp
    }
    
    	console.log(user);

        var user_created = uss(user);
        await user_created.save((err,user)=>{
            if(err)
                {
                    res.status(400).send(err);

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

//ctreate todo

app.post('/create/todo',async(req,res) => {
    try{

        console.log("api called");
    	var to_do = {
        _id : new mongoose.Types.ObjectId(),
		title: req.body.tit,
        description: req.body.des,
        uid: req.body.uid
        // status :req.body.sta,
        // deleted :req.body.del,
        
    }
        var todo_created = new td(to_do);
        await todo_created.save((err,todo)=>{
            if(err)
                {
                    res.status(400).send(err);
                    res.status(400).send("error"+err);
                }
                else
                {
                    console.log("todo added");
                    res.status(200).json({
                        success:true,
                        message:'todo added to db',
                        todo_det : todo
                    });
                }
            })
        }
        catch(error){
            res.status(500)
        }
 });

app.get('/get/todo',(req,res)=>{

    console.log("all todos");
    td.find({}).populate("uss").exec((err, td)=> {

        if(err)
        res.status(400).send(err);
        else
            res.status(200).json(td);
    })
})


// app.post('/todo/:id',(req,res)=>{
app.get('/get/user',(req,res)=>{

    console.log("all users");
    uss.find({}).exec((err, users)=> {

        if(err)
        res.status(400).send(err);
        else
            res.status(200).json(users);
    })
})

app.post('/update/todo',(req,res)=>{
    console.log("editing todos");
    var to_do = {
     
		title: req.body.tit,
        description: req.body.des
        // status :req.body.sta,
        // deleted :req.body.del,
        
    }
    td.findByIdAndUpdate(req.body.tid, to_do, {new : true}).exec((err, td)=> {

        if(err)
        res.status(400).send(err);
        else
            res.status(200).json(td);
    })
})



app.post('/delete_todo',async (req,res) => {

    console.log("deleting todos");
    td.findByIdAndDelete(req.body.tid).exec((err, td)=> {

        if(err)
        	res.status(400).send(err);
        else
            res.status(200).json(td);
    })
})



app.post('/tempdelete/todo',(req,res)=>{
    console.log("editing todos");
    var to_do = {
     
		// title: req.body.tit,
        // description: req.body.des
        // status :req.body.sta,
        deleted :req.body.del,
        
    }
    td.findByIdAndUpdate(req.body.tid, to_do, {new : true}).exec((err, td)=> {

        if(err)
        res.status(400).send(err);
        else
            res.status(200).json(td);
    })
})

app.get('/showdeleted/todo',(req,res)=>{

    console.log("all todos");
    td.find({deleted: true}).populate("uss").exec((err, td)=> {

        if(err)
        res.status(400).send(err);
        else
            res.status(200).json(td);
    })
})

app.get('/showdashboard',(req,res)=>{

    console.log("all todos");
    td.find({deleted: false, status:false}).populate("uss").exec((err, td)=> {

        if(err)
        res.status(400).send(err);
        else
            res.status(200).json(td);
    })
})

app.get('/showcompleted/todo',(req,res)=>{

    console.log("all todos");
    td.find({status: true}).populate("uss").exec((err, td)=> {

        if(err)
        res.status(400).send(err);
        else
            res.status(200).json(td);
    })
})



app.post('/completed/todo',(req,res)=>{
    console.log("editing todos");
    var to_do = {
     
		// title: req.body.tit,
        // description: req.body.des
         status :req.body.sta,
        //deleted :req.body.del,
        
    }
    td.findByIdAndUpdate(req.body.tid, to_do, {new : true}).exec((err, td)=> {

        if(err)
        res.status(400).send(err);
        else
            res.status(200).json(td);
    })
})
