// Lead author: Danny
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

});