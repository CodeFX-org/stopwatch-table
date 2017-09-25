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
		case "dropdownSelected":
			if (document.globalState.teamSelectionExpanded) {
				closeDropdown();
				selectTeam(findTeam(event.content))
			}
			break;
		case "teamSelected":
			makeEntryEditable(event.content != null)
			break;
		case "nonDropdownClicked":
			if (document.globalState.teamSelectionExpanded)
				closeDropdown();
			break;
	}
}

function findTeam(selection) {
	return selection == "" ? null : selection;
}

/* CLICK HANDLER */

function postEvent(type, content) {
	window.postMessage({ type: type, content: content }, "*")
}

function dropdownClicked() {
	postEvent("dropdownClicked")
}

function dropdownSelected(element) {
	postEvent("dropdownSelected", element.innerText);
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

function selectTeam(team) {
	var dropdownText = team == null ? "Team auswählen" : team;
	document.getElementById("team-selection-button").innerText = dropdownText
	document.globalState.selectedTeam = team;

	postEvent("teamSelected", team)
}

/* ENTRY */

function makeEntryEditable(editable) {

}
