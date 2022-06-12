const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('../utils/apiFeatures');


exports.deleteOne = Model => catchAsync(async(req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if(!doc){
      return next(new AppError('No document found with that ID',404));
    }
    res.status(204).json({
      status: `Record successfully deleted at ${req.requestTime}`,
      data: null
    });
  });

  exports.updateOne = Model => catchAsync(async(req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body,{new: true, runValidators:true});//update and validate the modal again

    if(!doc){
      return next(new AppError('No document found with that ID',404));
    }

    res.status(200).json({
      status: `document successfully updated at ${req.requestTime}`,
      data: {
        data: doc
      }
    });
  });

  exports.createOne = Model => catchAsync(async(req, res, next) => {
      const doc = await Model.create(req.body);
      res.status(201).json({
        status: `document successfully created at ${req.requestTime}`,
        data: {
          data: doc
        }
      });
  });

exports.getOne = (Model, popOptions) =>  catchAsync(async(req, res, next) => {

  let query = Model.findById(req.params.id)

  if(popOptions) query = query.populate(popOptions);

  const doc = await query;

  if(!doc){
    return next(new AppError('No document found with that ID', 404));
  }
  res.status(200).json({
    status: `Record successfully obtained at ${req.requestTime}`,
    data: {
      doc
    }
  });
});

exports.getAll = Model => catchAsync(async(req, res, next) => {
  // to allow nested GET reviews on tour

  let filter = {};
  if(req.params.tourId) filter = {tour: req.params.tourId};
  //EXECUTE QUERY
  const features = new APIFeatures(Model.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

  const doc = await features.query;

  res.status(200).json({
    status: `Record successfully obtained at ${req.requestTime}`,
    results: doc.length,
    data: {
      data: doc
    }
  }); 
});
