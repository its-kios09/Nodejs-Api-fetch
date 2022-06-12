const User = require('./../Model/UserModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handleFactory');



const filterObj = (obj, ...allowedFields)=>{
  const newObj = {};
  Object.keys(obj).forEach(el =>{
    if(allowedFields.includes(el)) newObj[el]=obj[el]
  });
  return newObj;
};
exports.getMe = (req, res, next)=>{
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async(req, res, next) => {
  //Create error if user post password data
  if(req.body.password || req.body.passwordConfrim){
    return next(new AppError('This route is not for passwords updates. Please use api/v1/users/updateMyPassword', 400));
  }
  // update user documents

    const filteredBody = filterObj(req.body,'name','email')
    const updatedUser = await User.findByIdAndUpdate(req.user.id,filteredBody,{
      new:true,
      runValidators:true 
    });


  res.status(200).json({
    status:"Success",
    data:{
      user:updatedUser
    }
  }); 
});

exports.deleteMe = catchAsync(async(req, res, next)=>{
  await User.findByIdAndUpdate(req.user.id,{active: false})

  res.status(204).json({
    status:"success",
    data:null
  })
});



exports.createUser = catchAsync((req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup instead!'
  });
});
exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
//Do not update passwords with this!
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);