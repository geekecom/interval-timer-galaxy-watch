window.onload = function() {
	// add eventListener for tizenhwkey
	document.addEventListener('tizenhwkey', function(e) {
		if (e.keyName === "back") {
			window.history.back();
		}
	});

	main();
};

function main() {
	setupCheckboxes();

	$("body").css("display", "block");
}

function setupCheckboxes() {
	console.debug("Vibration storage value: " + localStorage.getItem("vibration"));
	console.debug("Sound storage value: " + localStorage.getItem("sound"));

	if (localStorage.getItem("vibration") === 'true') {
		$("#vibration-checkbox").prop("checked", true);
	}

	if (localStorage.getItem("sound") === 'true') {
		$("#sound-checkbox").prop("checked", true);
	}

	$("#vibration-checkbox").click(function() {
		if ($("#vibration-checkbox").is(':checked')) {
			localStorage.setItem("vibration", true);
		} else {
			localStorage.setItem("vibration", false);
		}
		console.debug("Vibration storage value: " + localStorage.getItem("vibration"));
	});

	$("#sound-checkbox").click(function() {
		if ($("#sound-checkbox").is(':checked')) {
			localStorage.setItem("sound", true);
		} else {
			localStorage.setItem("sound", false);
		}
		console.debug("Sound storage value: " + localStorage.getItem("sound"));
	});
}