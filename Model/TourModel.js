const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');



const tourSchema = new mongoose.Schema({

    name:{
        type:String,
        required:[true,'A tour must have a name'],
        unique: true, 
        trim: true,
        maxlength:[40, 'A tour must have less or equal than 40 characters'],
        minlength:[10, 'A tour must have more or equal than 10 characters']
    },
    slug:String,
    duration:{
        type:Number,
        required:[true,'A tour must have a duration']
    },
    maxGroupSize:{
        type:Number,
        required:[true,' A tour must have a group size']
    },
    difficulty: {
        type:String,
        required:[true,'A tour must have a difficulty'],
        enum:{
            values:['easy','medium','difficult'],
            message:'Difficulty is either: easy, medium, difficult'
        }//only for strings and dates
    },
    rating:{
        type:Number,
        default: 4.5
    },
    ratingsAverage:{
        type:Number,
        default:4.5,
        min:[1,'Rating must be above 1.0'],
        max:[5,'Rating must be below 5.0'],
        set: val => math.round(val * 10)/10 //4.6666 4.7 *10 47/10
    },
    ratingsQuantity:{
        type:Number,
        defualt:0
    },                          
    price:{
        type:Number,
        required:[true, 'A tour must have a price']
    },
    priceDiscount:{
        type:Number,
        validate:{
            validator: function(val){
                            return val < this.price;
                        },
            message:'Discount price ({VALUE}) should be below regular price'

        }
    
    },
    summary:{
        type:String,
        trim:true,
        required:[true,'A tour must have a summary']
    },
    description:{
            type:String,
            trim:true
    },
    imageCover:{
        type:String,
        required: [true,'A tour must have a cover image']
    },
    images:[String],
    createdAt:{
        type:Date,
        default:Date.now(),
        select:false
    },
    startDates:[Date],
    sercetTour:{
        type:Boolean,
        default:false 

    },
    startLocation:{
        //GeoJSON
        type:{
            type:String,
            defualt:'Point',
            enum:['Point']
        },
        coordinates:[Number],
        address:String,
        description: String
    },
    locations:[
        {
            type:{
            type:String,
            defualt:'Point',
            enum:['Point']
        },
        coordinates:[Number],
        address:String,
        description: String,
        day:Number
    }
    ],
    guides: [
        {
            type: mongoose.Schema.ObjectId,
            ref:'User'
        }
    ],
    
},
{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});
tourSchema.index({price: 1, ratingsAverage: -1 });
tourSchema.index({slug:1});

tourSchema.index({startLocation: '2dsphere'})
tourSchema.virtual('durationWeeks').get(function(){
    return this.duration / 7;
});
//virtual populate
tourSchema.virtual('reviews',{
    ref: 'Review',
    foreignField: 'tour',
    localField:'_id'
});
//DOCUMENT MIDDLEWARE: runs before .save() and .create()

tourSchema.pre('save',function(next){
    this.slug = slugify(this.name,{lower:true});
    next();
});

// tourSchema.pre('save', async function(next){
//     const guidesPromises = this.guides.map( async id=> await User.findById(id))
//     this.guides = await Promise.all(guidesPromises);
//     next(); ??EMBEDDING THE GUIDES
// });
//QUERY MIDDLEWARE
tourSchema.pre(/^find/,function(next){//irregular expression for all expression
    this.find({sercetTour: {$ne: true}});
    this.start = Date.now()
    next();
});
tourSchema.pre(/^find/,function(next){
    this.populate({
        path:'guides',
        select:'-__v -passwordChangedAt'
      });// populating the guides where the query is happening
next();
});             
tourSchema.post(/^find/,function(docs, next){//irregular expression for all expression
    console.log(`The query request took ${Date.now() - this.start} milliseconds...`)
    next();
});


//AGGREGATION MIDDLEWARE
// tourSchema.pre('aggregate', function(next){
//     this.pipeline().unshift({$match:{sercetTour: {$ne: true}}});
//     next();
// });
const Tour = mongoose.model('Tour',tourSchema);



module.exports = Tour;