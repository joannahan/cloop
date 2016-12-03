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
	
	$('.delete_post').click(function(){
		var $postId = $(this).closest('.post');
		var $id = $postId.attr('id');
		$.ajax({
			context:this,
			type:'DELETE',
			url:'/post/'+ $id,
			success:function(result){	
				if (result.remove === false) {
					alert(result.message);
				} else {
		    		$postId.remove();		
				}
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
			success:function(result){	
				if (result.remove === false) {
					alert(result.message);
				} else {
		    		$commentId.remove();		
				}
			},
			error:function(){
				alert(status.message);
			}
			
		});
	 });
	
	$('#takenClass*').click(function(){
		var $id = $(this).data('taken');
		console.log($id);
		$.ajax({
			context:this,
			type:'PUT',
			url:'/group/'+ $id,
			data:{
				action:'add',
			},
			success:function(result){	
				//TODO
				console.log("HELLO ADDED");
			},
			error:function(){
				//TODO
				alert(status.message);
			}			
		});		
	 });
	
	$('#archivedClass*').click(function(){
		var $name = $(this).data('archived');
		console.log("$name: "+ $name);
	    $.get('/group/'+$name, function(err, _class) {
    		if (err) {
    			//TODO
    			console.log(err);
    		} else {
    			//TODO
    			console.log("ALKFJ:AKLDFJ");
    		}
		});
	 });
	
	

});