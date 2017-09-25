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
