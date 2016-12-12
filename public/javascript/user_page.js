// Lead author: Joanna
// user_page javascript
$(document).ready(function() { 
	// add new class click handler (admin can create custom classes)
	$('#addNewClass').click(function(){
		var $newClassName=$('#newClassName');
		if ($newClassName.val()===''){
			alert('Please enter a new class name.');
			return;
		}
		$.post('/group/class', {className:$newClassName.val()}, function(err, newClass) {
			if (err) {
				if (err.message !== undefined){
					alert(err.message);
				}
				location.reload();
			} else {
				location.reload();
			}
		});
	}); 
	
	// move enrolled class to taken class click handler
	$('#moveEnrolledClass*').click(function(){
		if (confirm('Are you sure you want to mark this class as taken? You will not be able to undo this action.')) {
			var $id = $(this).data('taken');
			$.post('/group/user/move_enrolled_class', {classId:$id}, function(err, _class) {
				if(err){
					if (err.message !== undefined){
						alert(err.message);
					}
					location.reload();
				} else {
					location.reload();
				}
			});
		}

	 });
	
	// add untaken class to enrolled class click handler
	$('#untakenClassesList').delegate('.untakenClass','click', function(){

		var $id = $(this).data('classid');
		$.post('/group/user/enroll_class', {classId:$id}, function(err, untakenClass) {
			if (err) {
				if (err.message !== undefined){
					alert(err.message);
				}
				location.reload();
			} else {
				location.reload();
			}
		});
	 });	
	
	// download courses from MIT coursesv2 API click handler
	$('#downloadCourses').click(function(){
		$.post('/group/admin/download_courses',  function(err, data) {
			if (err) {
				if (err.message !== undefined){
					alert(err.message);
				}
				$(this).hide();
			} else {
				alert(data.message);
			}
		});
	});
	
	// import and update (package) course data from local json files click handler
	$('#packageCourseData').click(function(){
		$.post('/group/admin/package_course_data',  function(err, data) {
			if (err) {
				if (err.message !== undefined){
					alert(err.message);
				}
			} else {
				alert(data.message);
			}
		});
	});	
});