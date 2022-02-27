const obj = require('../logger/logger.js')
const helper = require('../util/helper.js')
const formatter = require('../validator/formatter.js')
const express = require('express');
const router = express.Router();
const lodash = require('lodash')

router.get('/test-me', function (req, res) {
    formatter.trim(' Function Up   ')
    formatter.upperCase(' Function Up   ')
    formatter.lowerCase(' Function Up   ')
    helper.printDate()
    helper.printMonth()
    helper.getBatchInfo("Thorium, W4D1, the topic for today is nodejs module system")
    obj.myPrintText("Welcome to my application. i am Suraj Dubey and  a part of FunctionUp Thorium cohort.")
    res.send('My first ever api!')
});


router.get('/hello', function (req, res) {
   let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
   console.log(lodash.chunk(months, 3))
   let oddNumbers = [1,3,5,7,9,11,13,15,17,19]
   console.log(lodash.tail(oddNumbers))
   let array1 = [1,2,3,4,5]
   let array2 = [2,3,4,5,6]
   let array3 = [3,4,5,6,7]
   let array4 = [4,5,6,7,8]
   let array5 = [5,6,7,8,9]
   console.log(lodash.union(array1,array2,array3,array4,array5))
   const pairs = [["horror","The Shining"],["drama","Titanic"],["thriller","Shutter Island"],["fantasy","Pans Labyrinth"]]
   console.log(lodash.fromPairs(pairs))
    res.send('My first ever !')
});

module.exports = router;