const validUrl = require('valid-url')
const shortid = require('shortid')
const urlModel = require('../models/urlModel');
const redis = require("redis")
const { promisify } = require("util");

//Connect to redis
const redisClient = redis.createClient(
    14460,
    "redis-14460.c212.ap-south-1-1.ec2.cloud.redislabs.com",
    { no_ready_check: true }
  );
  redisClient.auth("KhdlDgB38NRfzNoQquVc1D1CeedzkHdB", function (err) {
    if (err) throw err;
  });
  
  redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
  });
  
  //Connection setup for redis
  
  const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
  const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);

const isValid = (val) =>{
    if(typeof val === "undefined" || typeof val === null )return false;
    if(typeof val === "string" && val.trim().length === 0)return false;
    return true;
}
const isValidRequestBody = (requestBody) =>{
    return Object.keys(requestBody).length > 0
}
const createUrl = async function (req, res){
    try{
    const baseUrl = 'http:localhost:3000'
     let longUrl = req.body.longUrl
    
     if(!isValidRequestBody(req.body)){
         return res.status(400).send({status:false,message:'Invalid request body'})
     }
     if(!isValid(longUrl)){
        return res.status(400).send({status:false, message: 'Please provide longUrl'})
     }
     if(!validUrl.isUri(longUrl)){
        return res.status(400).send({status:false, message: 'Invalid longUrl'})
    }
    if(!isValid(baseUrl)){
        return res.status(400).send({status:false, message: 'Please provide baseUrl'})
     }
    if(!validUrl.isUrl(baseUrl)){
        return res.status(400).send({status:false, message: 'Invalid baseUrl'})
    }
    
    const urlCode = shortid.generate().toLowerCase()
    const shortUrl = baseUrl + '/' + urlCode
    const obj = { 
        "urlCode":urlCode,
        "longUrl":longUrl,
        "shortUrl":shortUrl
}
let longUrlexist= await urlModel.findOne({longUrl}).select()
if(longUrlexist){
    return res.status(200).send({status:true,data:longUrlexist})
}else{
 let createUrl = await urlModel.create(obj)
return res.status(201).send({status:true, data:createUrl})
} 
    
    }catch(err){
        return res.status(500).send({status:false,err:err.message})
}
}
const getUrl = async function(req, res) {
    try{
        let urlCode = req.params
    let originalUrl = await urlModel.findOne(urlCode)
    if(!originalUrl){
        return res.status(400).send({status:false,message:"url not found"})
    }else{
        return res.status(302).redirect(originalUrl.longUrl)
    }
}catch(err){
    return res.status(500).send({status:false,err:err.message})
}
}
module.exports={createUrl,getUrl}
