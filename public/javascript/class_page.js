// Lead author: Manuel
// class_page javascript
$(document).ready(function() {
	
	$(".editBtn").click(function() {
		var textObject = $(this).parent().parent();
		var textId = textObject.attr('id');
		var isPost = textObject.hasClass("post");

		var title = "Edit " + (isPost ? "Post" : "Comment")
		var action = (isPost ? "/post" : "/comment") + "/edit/" + textId

		$("#editModalLabel").text(title)
		$("#contentInput").attr("value", textObject.find(".text-body").first().text())
		$("#editText").attr("action", action)
		$("#editModal").modal("show")
	})

	// upvote click handler
	$(".upv").click(function() {
		var upvBtn = $(this);
		var thumb = upvBtn.children();

		var textObject = upvBtn.parent().parent().parent();
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
					if (data.upvotedState) {
						upvBtn.css("background-color", "#BDF5BD");
						thumb.css("color", "green");
					} else {
						upvBtn.removeAttr("style");
						thumb.removeAttr("style");
					}
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
	
	//resource button show/hide click handler
	$(".resource_button").click(function() {
		var resourceObject = $(this).next();

		if ($(this).text() === "Show Preview") {
			$(this).text('Hide Preview');
			resourceObject.show();
		} else {
			$(this).text('Show Preview');
			resourceObject.hide();
		}

	});
});