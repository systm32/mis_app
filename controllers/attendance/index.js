/**
 * @Rajat Bajaj
**/

//route for setting end points
var attendance = require('express').Router();
var attendanceModel = require('models/attendance');
var Session = require('config/session');
var empAttendanceModel = require('models/attendance/emp_attendance_model');

attendance.get('/sessionyear',function(req,res){
	var session = new Session(req.query.access_token,function(err,result){
		if(err)
		{
			res.status(401);
			res.json({
				"status":401,
				"err_code":8,
				"err_msg":'some problem in session'
			});
		}
	});
	var id = session.getId();
	var auth_id = session.getAuthId();
	if(auth_id == 'stu'){
		attendanceModel.getSessionYearForStu(id,function(err,result){
			if(err)
			{
				res.json({
					"success":false,
					"err_msg":err.message
				});
			}
			else
			{
				res.json({
					"success":true,
					"session_year":result
				});
			}
		});		
	}
	else{
		attendanceModel.getSessionYearForEmp(id,function(err,result){
			if(err)
			{
				res.json({
					"success":false,
					"err_msg":err.message
				});
			}
			else
			{
				res.json({
					"success":true,
					"session_year":result
				});
			}
		});	
	}
	
});

attendance.get('/semester',function(req,res){
	var session = new Session(req.query.access_token,function(err,result){
		if(err)
		{
			res.status(401);
			res.json({
				"status":401,
				"err_code":8,
				"err_msg":'some problem in session'
			});
		}
	});
	var adm_no = session.getId();
	attendanceModel.getSemester(adm_no,req.query.sessionyear,req.query.session,function(err,result){
		if(err)
		{
			res.json({
				"success":false,
				"err_msg":err.message
			});
		}
		else
		{
			res.json({
				"success":true,
				"semester":result
			});
		}
		
	});
});

attendance.get('/subjectlist',function(req,res){
	var session = new Session(req.query.access_token,function(err,result){
		if(err)
		{
			res.json({
				"status":401,
				"err_code":8,
				"err_msg":'some problem in session'
			});
		}
	});
	var adm_no = session.getId();
	var data = {};
	data['adm_no'] = adm_no;
	data['session'] = req.query.session;
	data['session_year'] = req.query.sessionyear;
	data['semester'] = req.query.semester;
	attendanceModel.getSubjectList(data,function(err,result){
		if(err)
		{
			res.json({
				"success":false,
				"err_msg":err.message
			});
		}
		else
		{
			res.json({
				"success":true,
				"subjectlist":result
			});
		}
		
	});
});


attendance.get('/studentattendance',function(req,res){
	var session = new Session(req.query.access_token,function(err,result){
		if(err)
		{
			res.json({
				"status":401,
				"err_code":8,
				"err_msg":'some problem in session'
			});
		}
	});
	var adm_no = session.getId();
	var data = {};
	data['adm_no'] = adm_no;
	data['session'] = req.query.session;
	data['session_year'] = req.query.sessionyear;
	data['semester'] = req.query.semester;
	attendanceModel.getAttendanceDetails(data,function(err,result){
		if(err)
		{
			res.json({
				"success":false,
				"err_msg":err.message
			});
		}
		else
		{
			res.json({
				"success":true,
				"attendance":result
			});
		}	
	});
});


attendance.get('/subjectattendance',function(req,res){

	var session = new Session(req.query.access_token,function(err,result){
		if(err)
		{
			res.json({
				"status":401,
				"err_code":8,
				"err_msg":'some problem in session'
			});
		}
	});
	var adm_no = session.getId();
	var data = {};
	data['adm_no'] = adm_no;
	data['sub_id'] = req.query.sub_id;
	data['map_id'] = req.query.map_id;

	attendanceModel.getDetailedAttendanceOfSubject(data,function(err,result){
		if(err){
			res.json({
				"success":false,
				"err_msg":err.message
			});	
		}else{
			res.json({
				"success":true,
				"attendance":result
			});
		}
	});
});


//This is for teacher that can see attendance of all students
attendance.get('/subjectattendanceall',function(req,res){
	var data = [];
	data['adm_no'] = req.query.adm_no;
	data['sub_id'] = req.query.sub_id;
	data['map_id'] = req.query.map_id;

	attendanceModel.getDetailedAttendanceOfSubject(data,function(err,result){
		if(err){
			res.status(401);
			res.json({
				"success":false,
				"err_msg":err.message
			});	
		}else{
			res.json({
				"success":true,
				"attendance":result
			});
		}
	});
});

attendance.get('/subjectmapped',function(req,res){
	var session = new Session(req.query.access_token,function(err,result){
		if(err)
		{
			res.status(401);
			res.json({
				"status":401,
				"err_code":8,
				"err_msg":'some problem in session'
			});
		}
	});

	var emp_id = session.getId();
	var data = [];
	data['emp_id'] = emp_id;
	if(req.query.session && req.query.sessionyear)
	{
		console.log(empAttendanceModel);
		data['session'] = req.query.session;
		data['session_year'] = req.query.sessionyear;
		empAttendanceModel.getSubjectsMappedToEmployee(data,function(err,result){
			if(err)
			{
				res.status(401);
				res.json({
					'success':false,
					'err_msg':err.message
				});
			}
			else{
				res.json({
					'success':true,
					'subjects':result
				});
			}
		});
	}
	else{
		res.status(401);
		res.json({
			'success':false,
			'err_msg':'missing parameters' 
		});
	}
});

attendance.get('/viewattendancesheet',function(req,res){
	var session = new Session(req.query.access_token,function(err,result){
		if(err)
		{
			res.status(401);
			res.json({
				"status":401,
				"err_code":8,
				"err_msg":'some problem in session'
			});
		}
	});
	var data = {};
	data['emp_id'] = session.getId();
	data['session_year'] = req.query.session_year;
	data['branch_name'] = req.query.branch_name;
	data['course_name'] = req.query.course_name;
	data['session'] = req.query.session;
	data['sub_id'] = req.query.sub_id;
	data['branch_id'] = req.query.branch_id;
	data['course_id'] = req.query.course_id;
	data['sub_name'] = req.query.sub_name;
	data['semester'] = req.query.semester;
	if(data['course_id'] == 'comm')
	{
		data['group'] = req.query.group;
		data['section'] = req.query.section;
	}
	empAttendanceModel.viewAttendanceSheet(data,function(err,result){
		if(err)
			{
				res.status(401);
				res.json({
					'success':false,
					'err_msg':err.message
				});
			}
			else{
				res.json({
					'success':true,
					'att_sheet':result
				});
			}
	});
});

attendance.get('/getdefaulterlist',function(req,res){
	var session = new Session(req.query.access_token,function(err,result){
		if(err)
		{
			res.status(401);
			res.json({
				"status":401,
				"err_code":8,
				"err_msg":'some problem in session'
			});
		}
	});
	var data = {};
	data['emp_id'] = session.getId();
	data['session_year'] = req.query.session_year;
	data['branch_name'] = req.query.branch_name;
	data['course_name'] = req.query.course_name;
	data['session'] = req.query.session;
	data['sub_id'] = req.query.sub_id;
	data['branch_id'] = req.query.branch_id;
	data['course_id'] = req.query.course_id;
	data['sub_name'] = req.query.sub_name;
	data['semester'] = req.query.semester;
	if(data['course_id'] == 'comm')
	{
		data['group'] = req.query.group;
		data['section'] = req.query.section;
	}
	empAttendanceModel.getDefaulterList(data,function(err,result){
		if(err)
			{
				res.status(401);
				res.json({
					'success':false,
					'err_msg':err.message
				});
			}
			else{
				res.json({
					'success':true,
					'defaulter_list':result
				});
			}
	});
});

attendance.get('/getsubjectscommon',function(req,res){
	if(req.query.session && req.query.session_year){
		var data = {};
		data['session'] = req.query.session;
		data['session_year'] = req.query.session_year;
		var session = new Session(req.query.access_token,function(err,result){
			if(err)
			{
				res.status(401);
				res.json({
					"status":401,
					"err_code":8,
					"err_msg":'some problem in session'
				});
			}
		});
		data['emp_id'] = session.getId();
		empAttendanceModel.getSubjectsCommon(data,function(err,result){
			if(err){
				res.json({
					'success':false,
					'err_msg':err.message
				});
			}
			else{
				res.json({
					'success':true,
					'subjects':result
				});
			}
		});
	}
	else{
		res.json({
			'success':false,
			'err_msg':'missing parameters'
		});
	}
});

attendance.get('/getsectionscommon',function(req,res){
	if(req.query.session && req.query.session_year && req.query.sub_id){
		var data = {};
		data['session'] = req.query.session;
		data['session_year'] = req.query.session_year;
		data['sub_id'] = req.query.sub_id;
		var session = new Session(req.query.access_token,function(err,result){
			if(err)
			{
				res.status(401);
				res.json({
					"status":401,
					"err_code":8,
					"err_msg":'some problem in session'
				});
			}
		});
		data['emp_id'] = session.getId();
		empAttendanceModel.getSectionCommon(data,function(err,result){
			if(err){
				res.json({
					'success':false,
					'err_msg':err.message
				});
			}
			else{
				res.json({
					'success':true,
					'sections':result
				});
			}
		});
	}
	else{
		res.json({
			'success':false,
			'err_msg':'missing parameters'
		});
	}
});
/*
attendance.get('/studentcomm',function(req,res){
	if(req.query.session && req.query.session_year && req.query.sub_id){
		var data = {};
		data['session'] = req.query.session;
		data['session_year'] = req.query.session_year;
		data['sub_id'] = req.query.sub_id;
		data['section'] = req.query.section;
		var session = new Session(req.query.access_token,function(err,result){
			if(err)
			{
				res.status(401);
				res.json({
					"status":401,
					"err_code":8,
					"err_msg":'some problem in session'
				});
			}
		});
		data['emp_id'] = session.getId();
		empAttendanceModel.getSectionCommon(data,function(err,result){
			if(err){
				res.json({
					'success':false,
					'err_msg':err.message
				});
			}
			else{
				res.json({
					'success':true,
					'sections':result
				});
			}
		});
	}
	else{
		res.json({
			'success':false,
			'err_msg':'missing parameters'
		});
	}
});*/


module.exports = attendance;