window.onload = function() {
	// add eventListener for tizenhwkey
	document.addEventListener('tizenhwkey', function(e) {
		if (e.keyName === "back") {
			if (isPaused) {
				resumeTimer();
			} else {
				pauseTimer();
			}
		}
	});

	main();
};

var timerCurrentValue;
var setsCurrentValue;
var cyclesCurrentValue;

var intervalFunction;

var vibration = true;
var sound = true;

var state;
var isPaused;

const
states = {
	READY_COUNT : "readyCount",
	WORK : "work",
	REST : "rest",
	PAUSE : "pause"
};

// don't modify the value of these variables
var readyCountValue;
var workValue;
var restValue;
var setsValue;
var pauseValue;
var cyclesValue;

function main() {
	// keeps screen always ON.
	// Ignored when used in web browser for testing purposes
	try {
		tizen.power.request("SCREEN", "SCREEN_NORMAL");
	} catch (ignore) {
	}

	initializeValues();
	initializeViews();

	$("#count-timer-header").html("Get Ready");
	$("#timer").html(timerCurrentValue + 1);

	// show body after code is loaded
	$("body").css("display", "block");

	// Update the count down every 1 second
	intervalFunction = setInterval(readyCountTimerFunction, 1000);
}

function initializeValues() {
	// don't modify the value of these variables
	// minus 1 because second 0 is counted too
	readyCountValue = 3 - 1;
	workValue = parseInt(localStorage.getItem("work")) - 1;
	restValue = parseInt(localStorage.getItem("rest")) - 1;
	pauseValue = parseInt(localStorage.getItem("pause")) - 1;
	setsValue = parseInt(localStorage.getItem("sets"));
	cyclesValue = parseInt(localStorage.getItem("cycles"));

	timerCurrentValue = readyCountValue;
	setsCurrentValue = 1;
	cyclesCurrentValue = 1;
	isPaused = false;

	console.debug("Values of [work, rest, sets, pause, cycles] : [" + workValue + ", " + restValue + ", " + setsValue + ", " + pauseValue + ", " + cyclesValue + "]")
}

function initializeViews() {
	$("#total-sets").html(setsValue);
	$("#total-cycles").html(cyclesValue);
}

function readyCountTimerFunction() {
	state = states.READY_COUNT;
	$("#timer").html(timerCurrentValue);

	console.debug("(readyCountTimerFunction) Timer current value: " + timerCurrentValue);

	if (timerCurrentValue === 0) {
		clearTimer(workValue);
		// call work function when count is finished
		intervalFunction = setInterval(workTimerFunction, 1000);
	} else {
		timerCurrentValue--;
	}
}

function workTimerFunction() {
	state = states.WORK;
	$("#count-timer-header").html("Work!");
	$("#timer").html(timerCurrentValue);

	console.debug("(workTimerFunction) Timer current value: " + timerCurrentValue);

	if (timerCurrentValue === 0) {
		clearTimer(restValue);
		if (setsCurrentValue < setsValue) {
			// call rest function
			intervalFunction = setInterval(restTimerFunction, 1000);
		} else if (cyclesCurrentValue < cyclesValue) {
			// call pause function
			intervalFunction = setInterval(pauseTimerFunction, 1000);
		} else {
			console.debug("Timer finished!");
			// close the app after the vibration has finished
			try {
				vibrate();
				setTimeout(tizen.application.getCurrentApplication().exit(), 500);
			} catch (ignore) {
			}
		}
	} else {
		timerCurrentValue--;
	}
}

function restTimerFunction() {
	state = states.REST;
	$("#count-timer-header").html("Rest");
	$("#timer").html(timerCurrentValue);

	console.debug("(restTimerFunction) Timer current value: " + timerCurrentValue);

	if (timerCurrentValue === 0) {
		clearTimer(workValue);
		if (setsCurrentValue < setsValue) {
			increaseCurrentSet();
			intervalFunction = setInterval(workTimerFunction, 1000);
		} else if (setsCurrentValue === setsValue) {
			intervalFunction = setInterval(workTimerFunction, 1000);
		}
	} else {
		timerCurrentValue--;
	}
}

function pauseTimerFunction() {
	state = states.PAUSE;
	$("#count-timer-header").html("Pause");
	$("#timer").html(timerCurrentValue);

	console.debug("(pauseTimerFunction) Timer current value: " + timerCurrentValue);

	if (timerCurrentValue === 0) {
		clearTimer(workValue);
		if (cyclesCurrentValue < cyclesValue) {
			resetCurrentSet();
			increaseCurrentCycle();
			intervalFunction = setInterval(workTimerFunction, 1000);
		}
	} else {
		timerCurrentValue--;
	}
}

function vibrate() {
	if (localStorage.getItem("vibration") === 'true') {
		try {
			navigator.vibrate(500);
		} catch (ignore) {
		}
	}
}

function makeSound() {
	if (localStorage.getItem("sound") === 'true') {
		try {
			var sound = new Audio('audio/beep.mp3');
			sound.loop = false;
			sound.volume = 1.0;
			sound.play();
		} catch (ignore) {
		}
	}
}

function clearTimer(timerValueNext) {
	clearInterval(intervalFunction);
	timerCurrentValue = timerValueNext;
	makeSound();
	vibrate();
}

function increaseCurrentSet() {
	setsCurrentValue++;
	$("#current-set").html(setsCurrentValue);
}

function increaseCurrentCycle() {
	cyclesCurrentValue++;
	$("#current-cycle").html(cyclesCurrentValue);
}

function resetCurrentSet() {
	setsCurrentValue = 1;
	$("#current-set").html(setsCurrentValue);
}

// pauses the timer when back button has been clicked
function pauseTimer() {
	$("#pause-icon").css("visibility", "visible");
	$("#count-footer").css("visibility", "visible");
	clearInterval(intervalFunction);
	isPaused = true;
}

function resumeTimer() {
	$("#pause-icon").css("visibility", "hidden");
	$("#count-footer").css("visibility", "hidden");
	isPaused = false;
	switch (state) {
	case states.READY_COUNT:
		intervalFunction = setInterval(readyCountTimerFunction(), 1000);
	case states.WORK:
		intervalFunction = setInterval(workTimerFunction, 1000);
		break;
	case states.REST:
		intervalFunction = setInterval(restTimerFunction, 1000);
		break;
	case states.PAUSE:
		intervalFunction = setInterval(pauseTimerFunction, 1000);
		break;
	default:
		console.error("Undetermined state of var 'state':" + state)
		break;
	}
}

$("#stop-button").click(function() {
	tizen.application.getCurrentApplication().exit();
});

// TODO implement settings
