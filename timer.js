document.globalState = {}

window.addEventListener("message", receiveEvent, false);
function receiveEvent(message) {
	var event = message.data
	console.log(event);
	switch (event.type) {
		case "dropdownClicked":
			if (document.globalState.teamSelectionExpanded)
				closeDropdown();
			else
				showDropdown();
			break;
		case "nonDropdownClicked":
			if (document.globalState.teamSelectionExpanded)
				closeDropdown();
			break;
		case "dropdownSelected":
			if (document.globalState.teamSelectionExpanded) {
				closeDropdown();
				postEvent("teamSelected", findTeam(event.content));
			}
			break;
		case "teamSelected":
			var team = event.content;
			showTeamSelection(team);
			updateCodeFieldSelection(team);
			updateSubmitStatus(team, document.globalState.code)
			break;
		case "codeEdited":
			var code = event.content
			updateCodeFieldStatus(code)
			updateSubmitStatus(document.globalState.selectedTeam, code)
			if (code.length == 12)
				postEvent("codeCompleted");
		case "codeComplete":
			selectSubmit();
			break;
		case "submitted":
			document.getElementById("code-field").value = "";
			postEvent("teamSelected", null);
			selectSubmit();
			break;
	}
}

function findTeam(selection) {
	return selection == "" ? null : selection;
}

/* HTML EVENT HANDLER */

function postEvent(type, content) {
	window.postMessage({ type: type, content: content }, "*")
}

function dropdownClicked() {
	postEvent("dropdownClicked")
}

function dropdownSelected(element) {
	postEvent("dropdownSelected", element.innerText);
}

function codeEdited(element) {
	postEvent("codeEdited", element.value)
}

function submit() {
	postEvent("submitted")
}

/* DROPDOWN */

function showDropdown() {
	document.getElementById("team-selection-content").classList.add("show");
	document.globalState.teamSelectionExpanded = true;
}

window.onclick = function(event) {
	if (!event.target.matches('.dropdown')) {
		postEvent("nonDropdownClicked")
	}
}

function closeDropdown() {
	var dropdowns = document.getElementsByClassName("dropdown-content");
	var i;
	for (i = 0; i < dropdowns.length; i++) {
		dropdowns[i].classList.remove('show');
	}
	document.globalState.teamSelectionExpanded = false;
}

function showTeamSelection(team) {
	teamSelectionButton = document.getElementById("team-selection-button");
	if (team) {
		teamSelectionButton.innerText = team;
		teamSelectionButton.classList.add("done");
	} else {
		teamSelectionButton.innerText = "Team auswählen";
		teamSelectionButton.classList.remove("done");
	}
	document.globalState.selectedTeam = team;
}

/* ENTRY */

function updateCodeFieldSelection(team) {
	var codeField = document.getElementById("code-field");
	if (team) {
		codeField.disabled = false;
		codeField.placeholder = "12-stelliger Code";
		codeField.focus();
	} else {
		codeField.disabled = true;
		codeField.placeholder = "kein Team ausgewählt";
	}
}

function updateCodeFieldStatus(code) {
	var codeField = document.getElementById("code-field");
	document.globalState.code = code;
	if (code.length == 12) {
		codeField.classList.add("done");
	} else {
		codeField.classList.remove("done");
	}
}

/* SUBMIT */

function updateSubmitStatus(team, code) {
	var submit = document.getElementById("submit");
	submit.disabled = !(team && code && code.length == 12);
}

function selectSubmit() {
	var submit = document.getElementById("submit");
	submit.focus();
}

/* INITIALIZE */

postEvent("teamSelected", null)





/* STOPWATCH */

window.onload = function () {

	var minutes = 00;
	var seconds = 00;
	var appendMinutes = document.getElementById("minutes")
	var appendSeconds = document.getElementById("seconds")
	var buttonStart = document.getElementById('button-start');
	var buttonStop = document.getElementById('button-stop');
	var buttonReset = document.getElementById('button-reset');
	var Interval;

	buttonStart.onclick = function() {
		clearInterval(Interval);
		Interval = setInterval(startTimer, 1000);
	}

	buttonStop.onclick = function() {
		clearInterval(Interval);
	}

	buttonReset.onclick = function() {
		clearInterval(Interval);
		minutes = "00";
		seconds = "00";
		appendMinutes.innerHTML = minutes;
		appendSeconds.innerHTML = seconds;
	}

	function startTimer () {
		seconds++;
		if(seconds < 9){
			appendSeconds.innerHTML = "0" + seconds;
		}
		if (seconds > 9){
			appendSeconds.innerHTML = seconds;
		}

		if (seconds > 59) {
			minutes++;
			appendMinutes.innerHTML = "0" + minutes;
			seconds = 0;
			appendSeconds.innerHTML = "0" + 0;
		}
		if (minutes > 9){
			appendMinutes.innerHTML = minutes;
		}
	}

}
