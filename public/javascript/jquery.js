$(document).ready(function() { 

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