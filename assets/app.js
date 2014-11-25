$(document).ready(function() {

	//"Regex" and "Text" field design and initialization code
	function initializeArea(id, spanCode) {
		var clickedArea = false;
		var jqId = "#"+id; //I hate reusing quote marks and plus signs
		$(jqId).html(spanCode);

		$(jqId).click(function() {
			if (!clickedArea) {
				$(jqId).html("");
				clickedArea=true;
			}
		});

		$(jqId).keypress(function() {
			if ($(this).children(".startingText").size()>0) {
				$(this).html("");				
			}
		});

		$(document).click(function(e) {
			if (e.target.id !== id && $.trim($(jqId).text()) == "") {
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

	//Utility function: replace part of string at given index
	function replaceAt(str, index, replacement) {
    	return str.substr(0, index) + replacement + str.substr(index+replacement.length);
	}

	function colorTextBackground(regex, matchesArr) {
		var currText = $("#text").text();
		matchesArr.forEach(function(match) {
			var spanCode="<span class='highlight'>"+match[0]+"</span>";
			$("#text").html(currText.replace(regex, spanCode));
		});
		// var currentText = $("#text").text();
		// var htmlString = currentText;
		// var resString = "";
		// console.log("matchesArr: ", matchesArr);
		// matchesArr.forEach(function(match, arrIndex) {
		// 	console.log("htmlString pre-replacement: ", htmlString);
		// 	console.log("match: 0="+match[0]+", index="+match["index"]);
		// 	var replacement = "<span class='highlighted'>"+match[0]+"</span>";
		// 	resString = replaceAt(htmlString, match["index"], replacement);
			
		// 	console.log("htmlString post replacement number "+arrIndex+": ", htmlString);
		// });
		// // for (var match in matchesArr) {
		// // 	console.log("match:", matchesArr[match]);
		// // 	var replacement = "<span class='highlighted'>"+matchesArr[match][0]+"</span>";
		// // 	htmlString = replaceAt(htmlString, matchesArr[match].index, replacement);
		// // }
		// console.log(htmlString);
		// $("#text").html(htmlString);
		// // htmlString.repl
		// // for (var arrayIndex=0; arrayIndex<matchesArr.length; arrayIndex++) {
		// // 	htmlString.
		// // }
	}

	// function colorBackground(match) {
	// 	var htmlString=$("#text").html();

	// }

	//dfdd, reg='d' --> <sp>d</sp>f<sp>d</sp><sp>d</sp>

	function checkRegex(id) {
		if (!testedRegex && id !== "regex") return; //no regex yet

		if (regexChanged || modifiersChanged) {
			//checking for /i, /m
			modifiers="g";
			if ($(iCheckboxJqId).prop("checked")) {modifiers += "i"};
			if ($(mCheckboxJqId).prop("checked")) {modifiers += "m"};

			//retrieving regex pattern and creating regex
			var pattern = $("#regex").text();
			if ($.trim(pattern)!=="") {
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
			colorTextBackground(testedRegex, arr);
			// if (arr.length>0) {
			// 	// colorTextBackground(arr);
			// 	console.log(arr);
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

