// Lead author: Danny/Joanna
$(document).ready(function() { 

	$(".upvote.post").click(function() {
		var postId = $(this).parent().parent().parent().attr("id");
		var upvoteSpan = $(this).parent();
		var numCurrentUpvotes = upvoteSpan.text();
		numCurrentUpvotes = parseInt(numCurrentUpvotes) + 1;

		$.ajax({
			url: '/post/upvote',
			data: {
				postId: postId
			},
			type: 'POST',
			success: function(data){
				if (data === "Success!") {
					upvoteSpan.text(numCurrentUpvotes.toString());
				} else {
					console.log(data);
				}
			},
			error: function(xhr, status, error) {
				console.log("A problem occurred" + error);
			}
		});
	});

	$(".upvote.comment").click(function() {
		var commentId = $(this).parent().parent().parent().attr("id");
		var upvoteSpan = $(this).parent();
		var numCurrentUpvotes = upvoteSpan.text();
		numCurrentUpvotes = parseInt(numCurrentUpvotes) + 1;

		$.ajax({
			url: '/comment/upvote',
			data: {
				commentId: commentId
			},
			type: 'POST',
			success: function(data){
				if (data === "Success!") {
					upvoteSpan.text(numCurrentUpvotes.toString());
				} else {
					console.log(data);
				}
			},
			error: function(xhr, status, error) {
				console.log("A problem occurred" + error);
			}
		});
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