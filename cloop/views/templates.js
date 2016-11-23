(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['comment.hbs'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<!--relevantTime: displays timeCreated if not edited, and \"edited\" + timeEdited if edited --> \n	<div class=\"comment_header\">\n		<span class=\"upvotes\">"
    + alias4(((helper = (helper = helpers.numUpvotes || (depth0 != null ? depth0.numUpvotes : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"numUpvotes","hash":{},"data":data}) : helper)))
    + "</span>\n		<span class=\"comment_author\">"
    + alias4(((helper = (helper = helpers.author || (depth0 != null ? depth0.author : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"author","hash":{},"data":data}) : helper)))
    + "</span>\n		<span class=\"comment_time\">"
    + alias4(((helper = (helper = helpers.relevantTime || (depth0 != null ? depth0.relevantTime : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"relevantTime","hash":{},"data":data}) : helper)))
    + "</span>\n	</div>\n\n	<div class=\"comment_body\">\n		<p>"
    + alias4(((helper = (helper = helpers.text || (depth0 != null ? depth0.text : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"text","hash":{},"data":data}) : helper)))
    + "</p>\n	</div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"comment\">\n"
    + ((stack1 = helpers.unless.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.removed : depth0),{"name":"unless","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>\n";
},"useData":true});
templates['post.hbs'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "			<!-- render the comment handlebar template -->\n"
    + ((stack1 = container.invokePartial(partials.render_comment,depth0,{"name":"render_comment","data":data,"indent":"\t\t\t","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<!-- helper to only display if removed is false, and checks the number of flags-->\n<!-- register a helper function to evaluate the number of flags and change removed? -->\n\n<div class=\"post\">\n\n	<div class=\"post_header\">\n		<span class=\"upvotes\">"
    + alias4(((helper = (helper = helpers.numUpvotes || (depth0 != null ? depth0.numUpvotes : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"numUpvotes","hash":{},"data":data}) : helper)))
    + "</span>\n		<span class=\"post_author\">"
    + alias4(((helper = (helper = helpers.author || (depth0 != null ? depth0.author : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"author","hash":{},"data":data}) : helper)))
    + "</span>\n		<!--relevantTime: displays timeCreated if not edited, and \"edited\" + timeEdited if edited --> \n		<span class=\"post_time\">"
    + alias4(((helper = (helper = helpers.relevantTime || (depth0 != null ? depth0.relevantTime : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"relevantTime","hash":{},"data":data}) : helper)))
    + "</span>\n	</div>\n\n	<div class=\"post_body\">\n		<p>"
    + alias4(((helper = (helper = helpers.text || (depth0 != null ? depth0.text : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"text","hash":{},"data":data}) : helper)))
    + "</p>\n		<!-- icon to represent resource? -->\n		<p> Attached resource: "
    + alias4(((helper = (helper = helpers.resource || (depth0 != null ? depth0.resource : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"resource","hash":{},"data":data}) : helper)))
    + " </p>\n	</div>\n\n	<div class=\"post_footer\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.comment : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "		<!-- add a text input for adding a comment, action tag -->\n		<form id=\"new_comment\">\n			Reply to this thread: <input type=\"text\"><input type=\"submit\" value = \"Post\">\n		</form>\n	</div>\n</div>\n";
},"usePartial":true,"useData":true});
templates['class_page.hbs'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials.render_post,depth0,{"name":"render_post","data":data,"indent":"\t\t\t","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"class\">\n\n	<div class=\"class_header\">\n		<span class=\"class_information\">\n			<span class=\"class_title\">Welcome to "
    + alias4(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + "</span>\n			<span class=\"class_description\">"
    + alias4(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"description","hash":{},"data":data}) : helper)))
    + "</span>\n			<span><button class=\"class_options\">options</button></span>\n		</span\n	<div class=\"class_header\">\n\n	<div class=\"class_body\">\n	<form class=\"new_post\">\n		Create a post: <input type=\"text\"><input type=\"submit\" value = \"Post\"> <input type=\"submit\" value=\"Attach\">\n	</form>\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.post : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "	<div class=\"class_body\">\n\n</div>";
},"usePartial":true,"useData":true});
})();