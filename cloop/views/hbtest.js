var comment_template = Handlebars.templates['comment.hbs'];
console.log(Handlebars.templates);
//comments data
var data = {
	numUpvotes: "^ 5",
	author: "Ming",
	relevantTime: "Updated 10 hours ago by Ming",
	text: "A basic comment"
};
var comm_html = comment_template(data);

$(function(){
	$("#hb").html(comm_html);	
});
