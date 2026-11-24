import express, { response } from 'express';
import bodyParser from 'body-parser';
import expressSession from 'express-session';

const app = express();
app.use(bodyParser.json());

app.use(
    expressSession({
        secret: 'cst2120 secret',
        cookie: {maxAge: 60000},
        resave: false,
        saveUninitialized: true
    })
);

const userArray = [];

app.post('/M01088086/users', (request,response)=> {
    const newUser = request.body;
    console.log("Data recieved: " +JSON.stringify(newUser));

    if(newUser.email === undefined || newUser.password === undefined || newUser.name === undefined || newUser.dob === undefined || newUser.gender === undefined){
        response.send({error: true, message: "New user must have completed given fields."});
        return;
    }

    userArray.push(newUser);

    response.send({registration:true, email: newUser.email});
});

app.post('/M01088086/login', (request,response)=> {
    const userLogin = request.body;
    console.log(userLogin);

    for(let user of userArray){
        if(user.email === userLogin.email  && user.password === userLogin.password){

            request.session.email = user.email;
            console.log(request.session);

            response.send({login:true, email: user.email});
            return;
    }
}

response.send({login:false, message:"Username or password incorrect."});
});

// ===== Login Status ====
app.get('/M01088086/login', (request,response)=> {
    if(!("email" in request.session))
        response.send({login:false});
    else{;;
        response.send({login:true, name: request.session.email});
    }
});

// ==== Sign Out =====
app.delete('/M01088086/login', (request,response) => {
    request.session.destroy( err => {
        if(err)
            response.send({error: JSON.stringify(err)});
        else
            response.send({login:false});
    });
});

app.get('/M01088086/feed', (request,response)=> {
    if(!("email" in request.session)){
        response.send({login:false, message:"You are not authorized to view feeds."});
        return;
    }

    const userEmail = request.session.email;

    response.send({login:true, name:userEmail, feed:"Demo feed"});
});

app.listen(8080, () => console.log("Listening on http://localhost:8080"));