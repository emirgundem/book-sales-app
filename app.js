const express = require('express');
const keys = require('./config/keys')
const stripe = require('stripe')(keys.stripeSecretKey);
const bodyParser = require('body-parser');
const { engine } = require('express-handlebars');

const app = express();


//Handlebars Middleware
app.engine('handlebars', engine({defaultLayout:'main'}));
app.set('view engine', 'handlebars');
app.set('views', './views');

//Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//Set static folder
app.use(express.static(`${__dirname}/public`));


app.get('/',(req,res)=>{
    res.render('index',{
        stripePublishableKey : keys.stripePublishableKey
    });
})


app.post('/charge',(req,res)=>{
    const amount = 100;
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken

    })
    .then(customer => stripe.charges.create({
        amount,
        description : 'Web development E-book',
        currency:'usd',
        customer:customer.id,
    }))

    .then(charge => res.render('success'));
})



app.get('/success',(req,res)=>{
    res.render('success');
})






const port = process.env.PORT || 5000;
app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
})