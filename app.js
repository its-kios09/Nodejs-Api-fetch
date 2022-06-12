const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController')
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');



const app = express();
//set Security HTTP headers

app.use(helmet());

// 1) GLOBAL MIDDLEWARES
// console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}


//Limiting Rates of requests from same IP

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message:"Too Many requests from this IP, Please try again in an Hour!."
});
app.use('/api',limiter);

//Bodyparser reading data from body into req.body
app.use(express.json({ limit:'10kb'}));

//data sanitization against No SQL query injection
app.use(mongoSanitize());
//data sanitization against XSS
app.use(xss());
//prevent parameter pollution
app.use(hpp({
  whitelist:[
    'duration',
    'ratingsQuantity',
    'ratingsAverage',
    'maxGroupSize',
    'difficulty',
    'price'
  ]
}));



app.use(express.static(`${__dirname}/public`));



app.use((req, res, next) => {
  req.requestTime = new Date().toTimeString();
  // console.log(req.headers);
  next();
});

// 3) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

//ERRORING HANDLING UNHANDLE ROUTES
app.all('*',(req,res,next)=>{

  next(new AppError(`Can't find this route: ${req.originalUrl} on this server!`, 404));//pushes the error to the next middleware
});
app.use(globalErrorHandler);
module.exports = app;
