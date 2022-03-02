const { count } = require("console")
const authorModel = require("../models/authorModel")
const bookModel= require("../models/bookModel")
const publisherModel = require("../models/publisherModel")


const createBook= async function (req, res) {
    let data = req.body
    let auId = data.author
    let pbId = data.publisher
    // console.log(data)

    let author1 = await authorModel.findById(auId)
    let publisher1 = await publisherModel.findById(pbId)
    
    
    
    if(data.hasOwnProperty("author")){
        
        if(author1 === null)  {
            return  res.send({error: "author is not present"})
        }else{
           if (data.hasOwnProperty("publisher")){
            if(publisher1 === null){
                return res.send({error : "publisher is not present"})
            }else{
                let bookData = await bookModel.create(data)
                return res.send({book : bookData})
            }
           } else{
               return res.send({error : "publisher id is required" })
           }
           
           
        }
    
    }
    else {
        return  res.send({error: "author id is required"})
    }
}


const getBooksData= async function (req, res) {
    let books = await bookModel.find().populate("author").populate("publisher")
    res.send({data: books})
}



module.exports.createBook= createBook
module.exports.getBooksData= getBooksData
