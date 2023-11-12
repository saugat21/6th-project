import express from 'express'
import { registerController, loginController, testController, forgotPasswordController, updateProfileController, getOrdersController, getAllOrdersController, orderStatusController } from '../controllers/authController.js';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
// router object 
const router = express.Router();

//routing 

//FOR REGISTER || Method POST
router.post('/register', registerController);

//FOR LOGIN  || METHOD POST
router.post('/login', loginController);

//FORGOT PASSWORD || METHOD POST
router.post('/forgot-password', forgotPasswordController)

//FOR TEST || METHOD GET
router.get('/test', requireSignIn, isAdmin, testController);

//PROTECTED ROUTE AUTH || METHOD GET FOR USER
router.get('/user-auth', requireSignIn, (req, res) => {
    res.status(200).send({
        ok: true
    })
})

//PROTECTED ROUTE AUTH || METHOD GET FOR ADMIN
router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({
        ok: true
    })
})

//UPDATE PROFILE || METHOD PUT
router.put('/profile', requireSignIn, updateProfileController);

//ORDERS
router.get('/orders', requireSignIn, getOrdersController);

//ALL ORDERS
router.get('/all-orders', requireSignIn, isAdmin, getAllOrdersController);

// ORDER STATUS UPDATE
router.put('/order-status/:orderId', requireSignIn, isAdmin, orderStatusController);


export default router;