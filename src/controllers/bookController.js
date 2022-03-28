const bookModel =require('../models/bookModel')
const userModel = require('../models/userModel')
const reviewModel= require('../models/reviewModel')
const validations = require('../validations/validator.js')
const createbook=async function(req, res) {
    try{
        if (!validations.isValidRequestBody(req.body)) 
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide collage details' })
        
        let { title, excerpt, userId ,ISBN ,category,subcategory,reviews,isDeleted,releasedAt,} = req.body

        if (!validations.isValid(title)) 
        return res.status(400).send({ status: false, message: `title is required` })

        if (!validations.isValid(excerpt)) {
        return res.status(400).send({ status: false, message: `excerpt is required` })
        }
        const userDetails=await userModel.findById(_id)
        if(!userDetails) {
            return res.status(400).send({ status: false, message:"No user exist by this id"})
        }
        var {_id} = userDetails;
        if(!validations.isValid(_id)){
            return res.status(400).send({ status: false, message: "userId is required" })
        }
        if(!validations.isValidObjectId(_id)) {
            return res.status(400).send({ status: false, message:`${_id} is not a valid userId`})
       }
       if(!validations.isValid(ISBN)){
           return res.status(400).send({ status: false, message:"Isbn is required"})
       }
       const isISBNalreadyexist=await bookModel.findOne({ISBN})
       if(isISBNalreadyexist){
           return res.status(400).send({ status: false, message:"This ISBN is already exist"})
       }
       if(!validations.isValid(category)){
           return res.status(400).send({ status: false, message:"Category is required"})
       }
       if(!validations.isValid(subcategory)){
           return res.status(400).send({ status: false, message:"Subcategory is required"})
        }
        if (!isValid(releasedAt)) {
            return res.status(400).send({ status: false, message: ' Please provide a valid ReleasedAt date' })

        }
        if (!/((\d{4}[\/-])(\d{2}[\/-])(\d{2}))/.test(releasedAt)) {
            return res.status(400).send({ status: false, message: ' \"YYYY-MM-DD\" this Date format & only number format is accepted ' })
        }
        const bookData = {
            title, excerpt,userId,ISBN,category, subcategory, reviews, releasedAt,
            isDeleted: isDeleted ? isDeleted : false,
             deletedAt: isDeleted ? new Date() : null
        }
        const newBook = await bookModel.create(bookData)
        res.status(201).send({ status: true, message: 'New book created successfully', data: newBook })

    } catch (error) {
        console.log(error)
        res.status(500).send({ status: false, message: error.message });
    }
}
module.exports.createbook = createbook

//-----------------------------------------------------------------------------------------------------------------
const getBook = async (req, res) => {
    try {
        let filter = {
            isDeleted: false
        }
        if (req.query.userId) {

            if (!(isValid(req.query.userId) && isValidObjectId(req.query.userId))) {
                return res.status(400).send({ status: false, msg: "userId is not valid" })
            }
            filter["userId"] = req.query.userId
        }
        if (req.query.category) {

            if (!isValid(req.query.category)) {
                return res.status(400).send({ status: false, message: 'Book category is not valid ' })
            }
            filter["category"] = req.query.category
        }
        if (req.query.subcategory) {

            if (!isValid(req.query.subcategory)) {
                return res.status(400).send({ status: false, message: 'Book subcategory is not valid' })

            }
            filter["subcategory"] = req.query.subcategory
        }
        let book = await bookModel.find(filter).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 }).sort({ title: 1 })

        if (book.length > 0) {
            return res.status(200).send({ status: true, message: "book  list", data: book })

        } else {
            return res.status(404).send({ status: false, message: "no such book found !!" })

        }
    } catch (err) {
        console.log(err)
        res.status(500).send({ status: false, error: err.message })
    }
}

module.exports.getBook = getBook

//-----------------------------------------------------------------------------------------------------------------
const getBookWithreview = async (req, res) => {

    try {

        if (!(isValid(req.params.bookId) && isValidObjectId(req.params.bookId))) {
            return res.status(400).send({ status: false, msg: "bookId is not valid" })
        }

        let tempbook = await bookModel.findOne({ _id: req.params.bookId, isDeleted: false })

        if (tempbook) {

            let reviews = await reviewModel.find({ bookId: req.params.bookId, isDeleted: false })
            let reviewCount = reviews.length

            if (reviews.length > 0) {

                tempbook.reviews = reviewCount
                res.status(200).send({
                    status: true, data: {
                        ...tempbook.toObject(), reviewData: reviews
                    }
                })

            } else {
                res.status(200).send({
                    status: true, data: {
                        ...tempbook.toObject(), reviewData: reviews
                    }
                })
            }
        } else {
            res.status(404).send({ status: false, msg: "book not exist" })

        }

    } catch (err) {

        console.log(err)
        res.status(500).send({ status: false, error: err.message })
    }
}
module.exports.getBookWithreview = getBookWithreview

//--------------------------------------------------------------------------------------------------------------

const updateBook = async (req, res) => {
    try {
        let filter = {
            _id: req.params.bookId,
            isDeleted: false,
            userId: req.decodeToken._id
        }
        let update = {}

        if (!isValidRequestBody(req.body)) {
            return res.status(400).send({ status: false, message: 'body is empty' })

        }
        const book = await bookModel.findOne({ _id: req.params.bookId, isDeleted: false })

        if (!book) {
            return res.status(404).send({ status: false, message: `Book not found` })
        }

        if (book.userId.toString() !== req.decodeToken._id) {
            return res.status(401).send({ status: false, message: `Unauthorized access! Owner info doesn't match` });

        }
        let { title, excerpt, releasedAt, ISBN } = req.body

        if (title) {

            if (!isValid(title)) {
                return res.status(400).send({ status: false, message: 'title is not valid or empty' })
            }
            update['title'] = title
        }
        if (excerpt) {

            if (!isValid(excerpt)) {

                return res.status(400).send({ status: false, message: 'excerpt is not valid ' })
            }
            update['excerpt'] = excerpt
        }

        if (ISBN) {

            if (!isValid(ISBN)) {
                return res.status(400).send({ status: false, message: 'ISBN is not valid ' })
            }
            update['ISBN'] = ISBN
        }
        if (releasedAt) {

            if (!isValid(releasedAt)) {
                return res.status(400).send({ status: false, message: 'releasedAt is not valid value ' })
            }
            if (!/((\d{4}[\/-])(\d{2}[\/-])(\d{2}))/.test(releasedAt)) {
                return res.status(400).send({ status: false, message: ' \"YYYY-MM-DD\" this Date format & only number format is accepted ' })
            }
        }

        let updatedBook = await bookModel.findOneAndUpdate(filter, update, { new: true })
        if (updatedBook) {
            return res.status(200).send({ status: true, message: "success", data: updatedBook })

        }

    } catch (err) {
        console.log(err)
        res.status(500).send({ status: false, error: err.message })
    }

}

module.exports.updateBook = updateBook


//-----------------------------------------------------------------------------------------------------------------
const deleteById = async (req, res) => {

    try {

        if ((!validations.isValid(req.params.bookId) && !validations.isValidObjectId(req.params.bookId))) {
            return res.status(400).send({ status: false, msg: "bookId is not valid" })
        }

        let filter = {

            isDeleted: false,
            _id: req.params.bookId,
            userId: req.decodeToken._id
        }
        const book = await bookModel.findOne({ _id: req.params.bookId, isDeleted: false })

        if (!book) {
            return res.status(404).send({ status: false, message: `Book not found` })
        }

        if (book.userId.toString() !== req.decodeToken._id) {
            return res.status(401).send({ status: false, message: `Unauthorized access! ` });

        }
        let deletedBook = await bookModel.findOneAndUpdate(filter, { isDeleted: true, deletedAt: new Date() })
        if (deletedBook) {
            return res.status(200).send({ status: true, msg: "Book is successfully deleted" })
        }

    } catch (err) {
        console.log(err)
        res.status(500).send({ status: false, error: err.message })
    }
}

module.exports.deleteById = deleteById








