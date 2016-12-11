// Lead author: Joanna
var fs = require("fs");
var request = require('request');
var Class = require('../../models/class');

var DEFAULT_FILENAME = "seeds/courses_data.json";

var CoursePersist = function(targetFileName) {
  var that = Object.create(CoursePersist.prototype);
  //var content;

  /**
   * Write the given JavaScript object to a file.
   * @param {Object} object - The object to write to a file.
   * @param {Function} callback - The function to execute after the object
   *  has been written to a file. It is executed as callback(err), where 
   *  err is the error object and null if there is no error.
   */
  that.persist = function(object, callback) {
    fs.writeFile(targetFileName, JSON.stringify(object), callback);
  };
  
  that.download = function(callback){
	  //API request
	  var file;
	  var fileName;
	  var fileMask = "courses"; //fs.createWriteStream("./seeds/courses.json");
	  var DEFAULT_FILENAME = "seeds/webservices.json";
	  var i=0;
	  fs.readFile(DEFAULT_FILENAME,  function(err, data) {
	  	if (err) {
	    	  callback(err);
	      } else {	 
	      	var webservices=JSON.parse(data.toString()).webservices;
	      	webservices.forEach(function(ws){
	      		i++;
	      		fileName="./seeds/"+fileMask+"_"+i.toString()+".json"
	      		file=fs.createWriteStream(fileName);  		
	  			request({
	  			    url:ws.url, 
	  			    method: ws.method, 
	  			    headers: { 
	  			        'client_id': ws.headers.client_id,
	  			        'client_secret': ws.headers.client_secret
	  			    	}
	  			}).pipe(file , {end: false})
	  			  .on('finish', function(){			        	
	  			    	try {
	  			    		coursePersist.transform(fileName, function(err){
	  			    			if (err){
	  			    				console.log('err');
	  			    			}
	  			    		});
	  			    	}catch (ex) {console.log(ex);}	
	  			        console.log('done');
	  			    })
	  			    .on('error', function(err) {
	  			        console.log(err);
	  			    });
	        });
	      }
	  	callback();
	  });
  };

  that.transfer = function(callback){
	  var file;
	  var fileName;
	  var fileMask = "courses"; //fs.createWriteStream("./seeds/courses.json");
	  var regex = new RegExp("},{", "g");
	  var fileNames=[];
	  
	  for (var i=1; i<23; i++){
		  fileName="./seeds/"+fileMask+"_"+i.toString()+".json"
		  console.log("transfer file name:"+fileName);
		  fileNames.push(fileName);
	  }
	  
	  fileNames.forEach(function(item, i){
		  var content=JSON.parse(fs.readFileSync(item,'utf8'));
	      var courses=content.items.map(function(course){
		    	 return {name:course.subjectId,posts:[],students:[],termCode:course.termcode,title:course.title}; 
		      });
	      var total=0;
	      if (i > 1){
	    	  //if-exists-update, else-insert logic
	    	  courses.forEach(function(item){
	    		  Class.getClass(item.name, function(err, course){
	    			  if(err){
	    				  callback(err);
	    			  }else{
	    				  if (!course){ 
	    					  Class.insertCourse(item, function(err, course){
	    						 if (err){
	    							 callback(err);
	    						 }
	    						 else{
	    							 console.log("insert one course");
	    						 }
	    					  });
	    				  }else{
	    					  if (item.termCode === course.termCode && item.title !== course.title) // course title change
	    						  Class.updateCourse(item, function(err, course){
	    							 if (err){
	    								 callback(err);
	    							 }
	    							 else{
	    								 console.log("update one course title");
	    							 }
	    						  });
	    				  }
	    			  }
	    				  
	    		  });
	    	  });	    	  
	    	  fs.appendFile(DEFAULT_FILENAME, 
		    		  JSON.stringify(courses).toString()
		    		  .replace('[{','{')
		    		  .replace('}]','}')
		    		  .replace(regex,'}{')
		    		  , function(err){
		    	  if(err){
		    		  callback(err);
		    	  }else{
		    		  console.log("Data append to file complete.");
		    	  }
		      });
	      }else{
	    	  console.log("insert file:"+DEFAULT_FILENAME);
	    	  //if-exists-update, else-insert logic
	    	  courses.forEach(function(item){
	    		  Class.getClass(item.name, function(err, course){
	    			  if(err){
	    				  callback(err);
	    			  }else{
	    				  if (!course){ 
	    					  Class.insertCourse(item, function(err, course){
	    						 if (err){
	    							 callback(err);
	    						 }
	    						 else{
	    							 console.log("insert one course");
	    						 }
	    					  });
	    				  }else{
	    					  if (item.termCode === course.termCode && item.title !== course.title) // course title change
	    						  Class.updateCourse(item, function(err, course){
	    							 if (err){
	    								 callback(err);
	    							 }
	    							 else{
	    								 console.log("update one course title");
	    							 }
	    						  });
	    				  }
	    			  }
	    				  
	    		  });
	    	  });

		      fs.writeFile(DEFAULT_FILENAME, 
		    		  JSON.stringify(courses).toString()
		    		  .replace('[{','{')
		    		  .replace('}]','}')
		    		  .replace(regex,'}{')
		    		  , function(err){
		    	  if(err){
		    		  callback(err);
		    	  }else{
		    		  console.log("Data insert to file complete.");
		    	  }
		      });
	      }
	  });
	  callback();
  };
  /**
   * Read the file and parse the result as a JavaScript object.
   * @param {Function} callback - The function to execute after the object
   *  has been read. It is executed as callback(err, object), where 
   *  err is the error object, null if there is no error, object
   *  is the object read from the file. Undefined if err is not null.
   */
  var append=false;
  that.transform = function(fileName, callback) {
      fs.readFile(fileName,  function(err, data) {
 	      if (err) {
	    	  callback(err.message);
	      } else {	 
	    	  //console.log(data);
	    	  var content=JSON.parse(data.toString());
		      var courses=content.items.map(function(course){
		    	 return {name:course.subjectId,posts:[],students:[],termCode:course.termcode,title:course.title}; 
		      });
		      var append=false;
		      if ((append)){
			      fs.appendFile(targetFileName, 
			    		  JSON.stringify(courses).toString()
			    		  .replace('[{','{')
			    		  .replace('}]','}')
			    		  .replace(regex,'}{'), function(err){
			    	  if(err){
			    		  callback(err);
			    	  }else{
			    		  console.log("Data append to file complete");
			    	  }
			      });
		      }else{
		    	  var regex = new RegExp("},{", "g");
			      fs.writeFile(fileName+'.json', 
			    		  JSON.stringify(courses).toString()
			    		  .replace('[{','{')
			    		  .replace('}]','}')
			    		  .replace(regex,'}{'), function(err){
			    	  if(err){
			    		  callback(err);
			    	  }else{
			    		  console.log("Data insert to file complete.");
			    	  }
			    	  append=true;
			      });
		      }
	      }
    });
  };
  
  Object.freeze(that);
  return that;
};
module.exports = CoursePersist(DEFAULT_FILENAME);
