// ==UserScript==
// @name        Patreon Assistant
// @description Makes using Patreon easier.
// @author      TURBODRIVER
// @namespace   pa
// @include     *patreon.com/posts*
// @version     0.1
// @run-at      document-end
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

document.addEventListener('DOMContentLoaded', function() {
    var buttons = document.getElementsByTagName('button');

    for (var i = 0; i < buttons.length; i++) {
        var button = buttons[i];
        var buttonName = button.firstChild.nodeValue;

        if (buttonName == "Load more comments") {
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

            button.parentElement.parentElement.appendChild(document.createElement("br"));
            button.parentElement.parentElement.appendChild(loadAllCommentsRepliesButton);
            button.parentElement.parentElement.appendChild(document.createTextNode(" "));
            button.parentElement.parentElement.appendChild(loadAllCommentsButton);
        }
    }
}, false);