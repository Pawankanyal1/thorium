const express = require('express');
const router = express.Router();
const CowinController = require('../controllers/cowinController')
const WeatherController = require('../controllers/weatherController')
const MemeController = require('../controllers/memeController')



router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

// GETOTP and vaccine sessions by district APIs
router.post('/getOtp', CowinController.getOtp )
router.get('/sessionsByDistrict', CowinController.sessionsByDistrict)

// getWeather, tempOfLondon, tempOfCities
router.get('/getWeather', WeatherController.getWeather)
router.get('/tempOfLondon', WeatherController.tempOfLondon)
router.get('/tempOfCities', WeatherController.tempOfCities)

// getMemes
router.get('/getMemes', MemeController.getMemes )
router.post('/createMemes', MemeController.createMemes)

module.exports = router;