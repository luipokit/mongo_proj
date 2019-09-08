// Full Documentation - https://www.turbo360.co/docs
const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})
const vertex = require('vertex360')({site_id: process.env.TURBO_APP_ID})
const router = vertex.router()

const Profile = require('../models/Profile')
const Buddha = require('../models/Buddha')

// Paging
// http://localhost:3000/api/buddha?pageNo=1&size=10
router.get('/buddha', (req, res) => {

	const pageNo = parseInt(req.query.pageNo)
	const size = parseInt(req.query.size)
	var query = {}

	const skip = query.skip = size * (pageNo - 1)
	const limit = query.limit = size

	if (pageNo < 0 || pageNo === 0) {
        response = {"error" : true,"message" : "invalid page number, should start with 1"};
        return res.json(response)
	}

	Buddha.count()
		.then(totalCount => {
			find(totalCount, limit, skip);
		})
		.catch(err => {
			res.json({
				confirmation: 'fail',
				message: err.message,
			})
		})

	function find(totalCount, limit, skip) {
		Buddha.find().limit(limit).skip(skip).sort( { 'id': 1 })
			.then(buddha => {
				var totalPages = Math.ceil(totalCount / size)
				res.json({
					confirmation: 'success',
					data: buddha,
					pages: totalPages
				})
			})
			.catch(err => {
				res.json({
					confirmation: 'fail',
					message: err.message,
				})
			})
	}

	// Find some documents (callback)
	// mongoOp.count({},function(err,totalCount) {
	// 	if(err) {
	// 	  response = {"error" : true,"message" : "Error fetching data"}
	// 	}
	// 	mongoOp.find({},{},query,function(err,data) {
	// 		// Mongo command to fetch all data from collection.
	// 		if(err) {
	// 			response = {"error" : true,"message" : "Error fetching data"};
	// 		} else {
	// 			var totalPages = Math.ceil(totalCount / size)
	// 			response = {"error" : false,"message" : data,"pages": totalPages};
	// 		}
	// 		res.json(response);
	// 	});
  	// })
})

router.get('/profile', (req, res) => {

	let filters = req.query;
	if (req.query.age != null) {
		filters = {
			age: {$gt: req.query.age}
		}
	}

	Profile.find(filters)
		.then(profile => {
			res.json({
				confirmation: 'success',
				data: profile,
			})
		})
		.catch(err => {
			res.json({
				confirmation: 'fail',
				data: err.message
			})
		})
})

// NON-RESTful
router.get('/profile/update', (req, res) => {

	const query = req.query // require: id, key=value
	const profileId = query.id
	delete query['id']

	Profile.findByIdAndUpdate(profileId, query, {new: true})
		.then(profile => {
			res.json({
				confirmation: 'success',
				data: profile
			})
		})
		.catch(err => {
			res.json({
				confirmation: 'fail',
				data: err.message
			})
		})
})

router.get('/profile/remove', (req, res) => {
	const query = req.query

	Profile.findByIdAndRemove(query.id)
		.then(data => {
			res.json({
				confirmation: 'success',
				data: 'Profile ' + query.id + ' successfully removed!'
			})
		})
		.catch(err => {
			res.json({
				confirmation: 'fail',
				message: err.message
			})
		})
})

router.get('/profile/:id', (req, res) => {
	const id = req.params.id

	Profile.findById(id)
		.then(profile => {
			res.json({
				confirmation: 'success',
				data: profile
			})
		})
		.catch(err => {
			res.json({
				confirmation: 'fail',
				message: 'Profile "' + id + '" not found!'
			})
		})
})

router.post('/profile', (req, res) => {

	Profile.create(req.body)
		.then(profile => {
			res.json({
				confirmation: 'success',
				data: profile
			})
		})
		.catch(err => {
			res.json({
				confirmation: 'fail',
				message: err.message
			})
		})
})

module.exports = router
