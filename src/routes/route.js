const express = require('express');
const router = express.Router();

const UserController= require('../controllers/userController')
const ProductController= require('../controllers/productController')
const HeaderMiddleware = require('../middleware/headerMiddleware')
const OrderController = require('../controllers/orderController.js')

router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

router.post("/createUser", HeaderMiddleware.headerValidation, UserController.createUser )

//router.get("/getUsers", UserController.getUsersData)

router.post("/createProduct", ProductController.createProduct  )

// router.get("/getAllProducts", ProductController.getAllProducts)

router.post("/createOrder", HeaderMiddleware.headerValidation, OrderController.createOrder )
// router.post("/updateBooks", BookController.updateBooks)
// router.post("/deleteBooks", BookController.deleteBooks)



module.exports = router;