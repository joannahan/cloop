var comm_template = Handlebars.templates['comment.hbs'];
var post_template = Handlebars.templates['post.hbs'];
var class_template = Handlebars.templates['class_page.hbs'];
//register partials
Handlebars.registerPartial("render_comment", comm_template);
Handlebars.registerPartial("render_post", post_template);

//comments data
var comm_data_1 = {
	numUpvotes: "^ 5",
	author: "Ming Wang",
	relevantTime: "posted 10 hours ago",
	text: "A basic comment"
};
var comm_data_2 = {
	numUpvotes: "^ 1",
	author: "Ming Wang",
	relevantTime: "posted 8 hours ago",
	text: "jk i fixed it"
};

//post data
var post_data_1 = {

	numUpvotes: "^ 3",
	author: "Ming Wang",
	relevantTime: "posted 10h ago",
	text: "What constitutes a RESTful route?",
	resource: "rec5.pdf",
	comment: [
		comm_data_1, 
		comm_data_2
	]
};

var post_data_2 = {

	numUpvotes: "^ 7",
	author: "Jalapeno",
	relevantTime: "posted 2d ago",
	text: "taco",
	resource: "None",
	comment: []
};

//class data
var class_data = {
	title: "6.170",
	description: "Software Studio",
	post: [
		post_data_1,
		post_data_2
	]
};

var class_html = class_template(class_data);

$(function(){
	$("#hb").html(class_html);	
});
