const express=require('express');
const {registerUser,authUser,allUsers,verifyEmail} = require('../controllers/userController')
const router=express.Router();
const { protect } = require('../middleware/authMiddleware')

router.route('/:id/verify/:token').get(verifyEmail)
router.route('/').post(registerUser).get(protect, allUsers);
router.post('/login',authUser);


module.exports=router;