/**
 *Rajat Bajaj
**/

//route for setting end points
var editDetails = require('express').Router();

console.log('Am I HERE');
editDetails.get('/',function(req,res){
	console.log(req);
	res.json({'hey':'Het'});
}) ;

module.exports = editDetails;