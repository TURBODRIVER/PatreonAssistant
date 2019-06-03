// ==UserScript==
// @name        Patreon Assistant
// @description Makes using Patreon easier.
// @author      TURBODRIVER
// @namespace   pa
// @include     *patreon.com/posts*
// @version     0.2
// @downloadURL https://raw.githubusercontent.com/TURBODRIVER/PatreonAssistant/master/user.script.js
// @updateURL   https://raw.githubusercontent.com/TURBODRIVER/PatreonAssistant/master/user.script.js
// @run-at      document_start
// ==/UserScript==

var allCommentsLoadFailsCount = 0;
const allCommentsLoadFailsLimit = 20;

function findAndClickButton(buttonTextBegins, buttonTextEnds) {
    var hasClickedButton = false;
    var buttons = document.getElementsByTagName('button');

    for (var i = 0; i < buttons.length; i++) {
        var button = buttons[i];
        var buttonName = button.firstChild.nodeValue;

        if (buttonName !== null && buttonName.startsWith(buttonTextBegins) && buttonName.endsWith(buttonTextEnds)) {
            button.click();
            hasClickedButton = true;
        }
    }

    return hasClickedButton;
}

function runCommentsLoadingThread() {
    if (findAndClickButton("Load more comments", "") === false) {
        allCommentsLoadFailsCount++;
    }

    if (allCommentsLoadFailsCount < allCommentsLoadFailsLimit) {
        setTimeout(function() {
            runCommentsLoadingThread();
        }, 500);
    } else {
        console.log("Finished loading comments.");
    }
}

function loadAllComments() {
    var loadAllCommentsButton = document.getElementById('loadAllCommentsButton');
    loadAllCommentsButton.disabled = true;

    runCommentsLoadingThread();
}

function loadAllCommentsReplies() {
    findAndClickButton("Load", "reply");
    findAndClickButton("Load", "replies");
}

function addFunctionButtons() {
    var contentDiv = null;
    var buttons = document.getElementsByTagName('button');

    for (var i = 0; i < buttons.length; i++) {
        var button = buttons[i];
        var buttonName = button.firstChild.nodeValue;

        if (buttonName == "Load more comments") {
            contentDiv = button.parentElement;
            break;
        }
    }

    if (contentDiv !== null) {
        var loadAllCommentsButton = document.createElement("button");
        loadAllCommentsButton.setAttribute("id", "loadAllCommentsButton");
        loadAllCommentsButton.setAttribute("type", "button");
        loadAllCommentsButton.onclick = loadAllComments;
        loadAllCommentsButton.innerHTML = "Load all comments";

        var loadAllCommentsRepliesButton = document.createElement("button");
        loadAllCommentsRepliesButton.setAttribute("id", "loadAllCommentsRepliesButton");
        loadAllCommentsRepliesButton.setAttribute("type", "button");
        loadAllCommentsRepliesButton.onclick = loadAllCommentsReplies;
        loadAllCommentsRepliesButton.innerHTML = "Load all replies";

        contentDiv.parentElement.appendChild(document.createElement("br"));
        contentDiv.parentElement.appendChild(loadAllCommentsRepliesButton);
        contentDiv.parentElement.appendChild(document.createTextNode(" "));
        contentDiv.parentElement.appendChild(loadAllCommentsButton);
    }
}

window.addEventListener('load', function() {
    addFunctionButtons();
}, false);
