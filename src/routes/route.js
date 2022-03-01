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





module.exports = router;