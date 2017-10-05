document.configuration = {
	teams : {
		"Team 1" : "1234567890ab",
		"Team 2" : "0123456789ab",
		"Team 3" : "AB1234567890",
	}
}

document.globalState = {
	"teamSelectionExpanded" : false,
	"selectedTeam" : null,
	"code" : null,
	"time" : "00:00",
}

window.onload = function () {
	prepareStopwatch();
	prepareDropdown();
	initialize()
}

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
				postEvent("	codeCompleted");
		case "codeCompleted":
			selectSubmit();
			break;
		case "submitted":
			var result = createResult();
			setCodeTo("");
			postEvent("teamSelected", null);
			postEvent("newTableEntry", result)
			break;
		case "newTableEntry":
			addTableEntry(event.content);
	}
}

function findTeam(selection) {
	return selection == "" ? null : selection;
}

function setCodeTo(newCode) {
	var codeField = document.getElementById("code-field");
	codeField.value = newCode;
	codeEdited(codeField);
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

function submitted() {
	postEvent("submitted")
}

/* DROPDOWN */

function prepareDropdown() {
	var dropdown = document.getElementById("team-selection-content")
	for (var team in document.configuration.teams) {
		console.log(team)
		if (document.configuration.teams.hasOwnProperty(team)) {
			var entry = document.createElement("button");
			entry.classList.add("dropdown", "dropdown-element");
			entry.onclick = function() { dropdownSelected(this); }
			entry.innerHTML = team;
			dropdown.appendChild(entry);
		}
	}
}

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
		codeField.placeholder = "kein Team";
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

function createResult() {
	var state = document.globalState;
	return {
		"team": state.selectedTeam,
		"success": document.configuration.teams[state.selectedTeam].toUpperCase() == state.code.toUpperCase(),
		"time": state.time,
	}
}

/* TABLE */

function addTableEntry(entry) {
	var row = document.getElementById('result-table').insertRow(-1);
	if (entry.success)
		row.classList.add("result-success")
	else
		row.classList.add("result-fail")

	row.insertCell(0).innerHTML = entry.team;
	row.insertCell(1).innerHTML = entry.success ? "✔" : "✘";
	row.insertCell(2).innerHTML = entry.time;
}

/* INITIALIZE */

function initialize() {
	postEvent("teamSelected", null);
}




/* STOPWATCH */

function prepareStopwatch() {

	var minutes = 0;
	var seconds = 0;
	var appendMinutes = document.getElementById("minutes")
	var appendSeconds = document.getElementById("seconds")
	var buttonStart = document.getElementById('button-start');
	var buttonStop = document.getElementById('button-stop');
	var buttonReset = document.getElementById('button-reset');
	var Interval;

	buttonStart.onclick = function() {
		clearInterval(Interval);
		Interval = setInterval(ticktock, 1000);
	}

	buttonStop.onclick = function() {
		clearInterval(Interval);
	}

	buttonReset.onclick = function() {
		clearInterval(Interval);
		minutes = 0;
		seconds = 0;
		showTime();
	}

	function showTime() {
		var secondsString = seconds < 9 ? "0" + seconds : seconds;
		var minutesString = minutes < 9 ? "0" + minutes : minutes;

		appendSeconds.innerHTML = secondsString;
		appendMinutes.innerHTML = minutesString;
		document.globalState.time = minutesString + ":" + secondsString;
	}

	function ticktock () {
		seconds++;
		if (seconds > 59) {
			minutes++;
			seconds = 0;
		}
		showTime();
	}

}
