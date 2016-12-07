// Lead author: Danny/Joanna
$(document).ready(function() { 

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
					flagCountSpan.text(data.flagCount)
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
					flagCountSpan.text(data.flagCount)
				},
				error: function(xhr, status, error) {
					console.log("A problem occurred" + error);
				}
			})
		}
	});

	$('.delete_post').click(function(){
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
	 });
	
	$('.delete_comment').click(function(){
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
	 });
	
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
	
	$('#moveEnrolledClass*').click(function(){
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
	 });
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

});