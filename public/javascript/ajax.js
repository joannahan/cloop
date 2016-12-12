// Lead author: Danny/Joanna
$(document).ready(function() { 
	// upvote click handler
	$(".upv").click(function() {
		var textObject = $(this).parent().parent().parent();
		var upvoteCountSpan = textObject.find(".upvoteCount").first()
		var isPostUpvote = textObject.hasClass("post");
		var textId = textObject.attr("id")

		if (isPostUpvote) {
			$.ajax({
				url: '/post/upvote',
				data: {postId: textId},
				type: 'POST',
				success: function(data) {
					upvoteCountSpan.text(data.upvoteCount)
				},
				error: function(xhr, status, error) {
					console.log("A problem occurred" + error);
				}
			});
		} else /* isCommentUpvote */ {
			$.ajax({
				url: '/comment/upvote',
				data: {commentId: textId},
				type: 'POST',
				success: function(data) {
					upvoteCountSpan.text(data.upvoteCount)
				},
				error: function(xhr, status, error) {
					console.log("A problem occurred" + error);
				}
			})
		}
	});
	// flag click handler
	$(".flg").click(function() {
		var textObject = $(this).parent().parent().parent();
		var flagCountSpan = textObject.find(".flagCount").first()
		var isPostFlag = textObject.hasClass("post");
		var textId = textObject.attr("id")

		if (isPostFlag) {
			$.ajax({
				url: '/post/flag',
				data: {postId: textId},
				type: 'POST',
				success: function(data) {
					flagCountSpan.text(data.flagCount);
					if (data.flagCount >= 10) textObject.remove()
				},
				error: function(xhr, status, error) {
					console.log("A problem occurred" + error);
				}
			});
		} else /* isCommentFlag */ {
			$.ajax({
				url: '/comment/flag',
				data: {commentId: textId},
				type: 'POST',
				success: function(data) {
					flagCountSpan.text(data.flagCount);
					if (data.flagCount >= 10) textObject.remove();
				},
				error: function(xhr, status, error) {
					console.log("A problem occurred" + error);
				}
			})
		}
	});
	// delete post click handler
	$('.delete_post').click(function(){
		if (confirm('Are you sure you want to delete this post? You will not be able to bring it back.')) {
			var $postId = $(this).closest('.post');
			var $id = $postId.attr('id');
			$.ajax({
				context:this,
				type:'DELETE',
				url:'/post/'+ $id,
				success:function(result){	
					if (result.remove)	$postId.remove();
					else 				alert(result.message);
				},
				error:function(){
					alert(status.message);
				}
				
			});
		} 
	 });
	// delete comment click handler
	$('.delete_comment').click(function(){
		if (confirm('Are you sure you want to delete this comment? You will not be able to bring it back.')) {
			var $commentId = $(this).closest('.comment');
			var $id = $commentId.attr('id');
			$.ajax({
				context:this,
				type:'DELETE',
				url:'/comment/'+ $id,
				success: function(result) {
					if (result.remove)	$commentId.remove();
					else				alert(result.message);
				},
				error: function() {
					alert(status.message);
				}
				
			});
		}
	 });
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