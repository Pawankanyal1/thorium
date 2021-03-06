const express = require("express");
const router = express.Router();
const BookController = require('../controller/bookController')

router.get('/test', function(req, res){
  res.send({API: "WORKING"})
})

router.post('/createBook', BookController.createBook)

router.get('/bookList', BookController.getBook)


router.post('/getBooksInYear', BookController.booksInYear)

router.post('/getParticularBooks', BookController.particularBooks)

router.get('/getXINRBooks', BookController.getINRBooks)

router.get('/getRandomBooks', BookController.getRandomBooks)





router.post("/updateBooks", BookController.updateBooks)
router.post("/deleteBooks", BookController.deleteBooks)

//MOMENT JS
const moment = require('moment');
router.get("/dateManipulations", function (req, res) {
    
    // const today = moment();
    // let x= today.add(10, "days")

    // let validOrNot= moment("29-02-1991", "DD-MM-YYYY").isValid()
    // console.log(validOrNot)
    
    const dateA = moment('01-01-1900', 'DD-MM-YYYY');
    const dateB = moment('01-01-2000', 'DD-MM-YYYY');

    let x= dateB.diff(dateA, "days")
    console.log(x)

    res.send({ msg: "all good"})
})

module.exports = router;