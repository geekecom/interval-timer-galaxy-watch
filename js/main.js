window.onload = function() {
	// TODO:: Do your initialization job

	// add eventListener for tizenhwkey
	document.addEventListener('tizenhwkey', function(e) {
		if (e.keyName === "back") {
			try {
				tizen.application.getCurrentApplication().exit();
			} catch (ignore) {
			}
		}
	});
	main();
};

function main() {
	// these variables must be global
	var workValue;
	var restValue;
	var setsValue;
	var pauseValue;
	var cyclesValue;

	initializeParameters();
	// show body after code is loaded
	$("body").css("display", "block");
}

function initializeParameters() {
	const
	DEFAULT_WORK = 30;
	const
	DEFAULT_REST = 60;
	const
	DEFAULT_SETS = 10;
	const
	DEFAULT_PAUSE = 90;
	const
	DEFAULT_CYCLES = 3;

	setupParameter("work", DEFAULT_WORK);
	setupParameter("rest", DEFAULT_REST);
	setupParameter("sets", DEFAULT_SETS);
	setupParameter("pause", DEFAULT_PAUSE);
	setupParameter("cycles", DEFAULT_CYCLES);

	setupButtons('work');
	setupButtons('rest');
	setupButtons('sets');
	setupButtons('pause');
	setupButtons('cycles');

	setupOptions();
}

function setupParameter(paramName, defaultValue) {
	if (typeof paramName === 'string' && typeof defaultValue === 'number') {
		var element = document.getElementById(paramName + "-value");
		window[paramName + "Value"] = localStorage.getItem(paramName);
		if (window[paramName + "Value"] === null) {
			localStorage.setItem(paramName, defaultValue);
			window[paramName + "Value"] = parseInt(localStorage.getItem(paramName));
		}
		element.innerHTML = window[paramName + "Value"];
	} else {
		console.error("The input values must be a string and a number. Types: [" + typeof paramName + ", " + typeof defaultValue + "]");
	}
}

function setupButtons(paramName) {
	var durationIncreaseButtonElement = document.getElementById(paramName + "-increase-button");
	var durationDecreaseButtonElement = document.getElementById(paramName + "-decrease-button");

	durationIncreaseButtonElement.addEventListener("click", function() {
		increaseParameter(paramName);
	});
	durationDecreaseButtonElement.addEventListener("click", function() {
		decreaseParameter(paramName);
	});
}

function increaseParameter(paramName) {
	var paramValueVarName = paramName + "Value";
	if (window[paramValueVarName] < 999) { // avoids values higher than 999
		window[paramValueVarName]++;
		document.getElementById(paramName + "-value").innerHTML = window[paramValueVarName];
		localStorage.setItem(paramName, window[paramValueVarName]);
	}
}

function decreaseParameter(paramName) {
	var paramValueVarName = paramName + "Value";
	if (window[paramValueVarName] > 1) { // avoids values lower than 1
		window[paramValueVarName]--;
		document.getElementById(paramName + "-value").innerHTML = window[paramValueVarName];
		localStorage.setItem(paramName, window[paramValueVarName]);
	}
}

function setupOptions() {
	if (localStorage.getItem("vibration") == null) {
		localStorage.setItem("vibration", true);
	}

	if (localStorage.getItem("sound") == null) {
		localStorage.setItem("sound", false);
	}
}