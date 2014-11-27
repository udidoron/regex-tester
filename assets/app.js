$(document).ready(function() {

	//"Regex" and "Text" field design and initialization code
	function initializeArea(id, spanCode) {
		var clickedArea = false;
		var jqId = "#"+id; //I hate reusing quote marks and plus signs
		$(jqId).html(spanCode);

		$(jqId).on('focus', function() {
			if (!clickedArea) {
				$(jqId).html("");
				clickedArea=true;
			}
		})

		$(document).click(function(e) {
			if (e.target.id !== id && ($(jqId).text()) == "") {
				$(jqId).html(spanCode);
				clickedArea=false;
			}
		});
	}

	var startingRegexSpan = "<span class='startingText'> Enter your regex here. </span>";
	var startingTextSpan = "<span class='startingText'>Enter your text here. </span>";
	initializeArea("regex", startingRegexSpan);
	initializeArea("text", startingTextSpan);



	//Regex initialization and loading code
	var testedRegex;
	var modifiers = "g";
	var regexChanged = false;
	var modifiersChanged = false;
	var prevText = "";

	//Tiny bit of optimization code (yeah yeah, root of all evil, I know)
	var iCheckboxJqId = "#options_case_insensitive_checkbox";
	$(iCheckboxJqId).prop("checked", true);
	var mCheckboxJqId = "#options_search_multilines_checkbox";
	$(mCheckboxJqId).prop("checked", false);

	$(iCheckboxJqId, mCheckboxJqId).click(function(){ 
		modifiersChanged=true; 
		console.log("modifier changed");
	});

	$("#regex").blur(function() {
		regexChanged=true;
		if ($.trim($(this).text()) !== "") {
			testedRegex=true; //it's kinda ugly, I know
		}
	});

	// //Utility function: replace part of string at given index
	// function replaceAt(str, index, replacement) {
 //    	return str.substr(0, index) + replacement + str.substr(index+replacement.length);
	// }

	//Places the caret (pointer) at the end of the contenteditable div.
	//Taken (stolen) from StackOverflow
	function placeCaretAtEnd(el) {
	    el.focus();
	    if (typeof window.getSelection != "undefined"
	            && typeof document.createRange != "undefined") {
	        var range = document.createRange();
	        range.selectNodeContents(el);
	        range.collapse(false);
	        var sel = window.getSelection();
	        sel.removeAllRanges();
	        sel.addRange(range);
	    } else if (typeof document.body.createTextRange != "undefined") {
	        var textRange = document.body.createTextRange();
	        textRange.moveToElementText(el);
	        textRange.collapse(false);
	        textRange.select();
	    }
	}


	function doReplacement(matchesArr, elementChanged) {
		console.log("Entered doReplacement");
		var textIndex=0,
			startingText=$("#text").text(),
			matchArrayCopy = matchesArr, 
			returnedString = "";

		console.log("text before replacement: ", startingText);
		console.log("matchArrayCopy:", matchArrayCopy);

		var currMatchIndex=0;
		for (var textIndex=0; textIndex<startingText.length; textIndex++) {
			console.log("textIndex: ", textIndex);
			if (matchArrayCopy[currMatchIndex]) {
				if (matchArrayCopy[currMatchIndex]["index"] == textIndex) {
					//we've got a match
					console.log("match");
					var currMatchString = matchArrayCopy[currMatchIndex][0];
					textIndex += matchArrayCopy[currMatchIndex][0].length-1; //we've already entered one character
					currMatchIndex++;
					currMatchString="<span class='highlight'>"+currMatchString+"</span>";
					returnedString += currMatchString;

				} else {
					console.log("no match");
					returnedString += startingText[textIndex];
				}
			}
			else {
				console.log("no match (didn't enter if)");
				returnedString += startingText[textIndex];
			}
		}
		console.log("coloring..");
		$("#text").html(returnedString);
		console.log("Returned string:");
		console.log(returnedString);
		if (elementChanged === "text") {
			placeCaretAtEnd(document.getElementById('text'));	
		}
	}

	function checkRegex(id) {
		if (!testedRegex && id !== "regex") return; //no regex yet

		var textChanged = ($("#text").text() != prevText);
		if (!textChanged) { return; }
		else { prevText = $("#text").text(); }

		if (regexChanged || modifiersChanged) {
			//checking for /i, /m
			modifiers="g";
			if ($(iCheckboxJqId).prop("checked")) {modifiers += "i"};
			if ($(mCheckboxJqId).prop("checked")) {modifiers += "m"};

			//retrieving regex pattern and creating regex
			var pattern = $("#regex").text();
			if (pattern!=="") {
				testedRegex = new RegExp(pattern, modifiers);
				regexChanged = modifiersChanged = false;
			}
		}

		if (!regexChanged) {
			var jqId = "#"+id;
			var exec = testedRegex.exec($("#text").text());
			var arr = [];
			while(exec) {
				arr.push(exec);
				exec = testedRegex.exec($("#text").text());
			}
			doReplacement(arr, id);
			// if (id === "text") {
			// 	doReplacement(arr);
			// }
		}
	}

	$("#regex").keyup(function() {
		regexChanged=true;
		checkRegex("regex");
	});

	$("#text").keyup(function() {
		checkRegex("text");
	});

});

