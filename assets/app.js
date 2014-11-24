$(document).ready(function() {
	var clickedText = false;
	var startingTextSpan = "<span id='startingText'>Enter your text here. </span>";
	if (!clickedText) {
		$("#text").html(startingTextSpan);
	}
	$("#text").click(function(e) {
		if (!clickedText) {
			$("#text").html("");
			clickedText=true;
		}
	});
	$(document).click(function(e) {
		if (e.target.id != "text" && $("#text").text().trim() == "") {
			$("#text").html(startingTextSpan);
			clickedText=false;
		}
	})
})

function initiate() {
	document.getElementById("text").addEventListener("keyup", function(e) {
		var elem = e.target;
		var reg = /haw haw/gi;
		console.log(reg.exec(elem.innerHTML));
	});	
}
