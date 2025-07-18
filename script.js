import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.8.0/firebase-analytics.js";
import { getDatabase, ref, get, set, child, update, remove } from "https://www.gstatic.com/firebasejs/9.8.0/firebase-database.js";
import { getStorage, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.8.0/firebase-storage.js";
import { ref as sRef } from "https://www.gstatic.com/firebasejs/9.8.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyAk_oj9azlmKgI80ILFw_LnwyYuvrWONbE",
    authDomain: "database-7c9e3.firebaseapp.com",
    projectId: "database-7c9e3",
    storageBucket: "database-7c9e3.firebasestorage.app",
    messagingSenderId: "293172191213",
    appId: "1:293172191213:web:1668cf19f7fb92aa97d1e4"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase();
const dbRef = ref(db);

window.onload = function () {
    let spanUsername = document.getElementById("spanUsername");

    let buttonCreatePost = document.getElementById("buttonCreatePost");
    let buttonProfile = document.getElementById("buttonProfile");
    let buttonRadio = document.getElementById("buttonRadio");

    let dialogCreatePost = document.getElementById("dialogCreatePost");
    let dialogAuthorization = document.getElementById("dialogAuthorization");
    let dialogRadio = document.getElementById("dialogRadio");

    document.getElementById("audioGolemStream").src = "https://golemworld.ru:8443/stream";

    buttonCreatePost.onclick = function () {
        dialogCreatePost.showModal();
        setOnOutsideDialogClickListener(dialogCreatePost);

        let buttonPublishPost = document.getElementById("buttonPublishPost");
        let textareaPostText = document.getElementById("textareaPostText");
        let inputSecretKey = document.getElementById("inputSecretKey");
        let postPublisher = "undefined";
        let postPublisherName = "undefined";

        let currentDate = new Date().toLocaleDateString("ru-RU");

        buttonPublishPost.onclick = function() {
            switch (inputSecretKey.value) {
                case "wsdnk-OeVwM27uEv-5oYfYE5LBh":
                    postPublisher = "wsadnik4";
                    postPublisherName = "wsadnik4";
                    break;
                case "dbrbg-4PdOdN6sP9-DlOI0ZoLzV":
                    postPublisher = "dobrobog";
                    postPublisherName = "DOBROBOG";
                    break;
                case "goleminc-w45v2TKVCq-0TMV9ARdfj":
                    postPublisher = "goleminc"; 
                    postPublisherName = "Golem Inc.";
                    break
                default:
                    postPublisher = "undefined";
                    postPublisherName = "undefined";
                    break;
            }
            if (postPublisher !== "undefined" && textareaPostText != "") {
                    get(child(dbRef, `Golem Radio/Users/${postPublisher}/posts`,)).then((snapshot) => {
                        let randomInt = getRandomInt(999);
                        set(ref(db, `Golem Radio/Users/${postPublisher}/posts/post${9999999 - (snapshot.size + 1)}`), {
                            likes: randomInt,
                            comments: Math.floor(randomInt / 2) + getRandomInt(10),
                            reposts: Math.floor(randomInt / 4) + getRandomInt(10),
                            date: currentDate.replaceAll(".", "/"),
                            isUserVerified: "true",
                            name: postPublisherName,
                            text: textareaPostText.value,
                        });
                        textareaPostText.value = "";
                        inputSecretKey.value = "";
                        dialogCreatePost.close();
                        getUserPosts();
				});
            }
        }

        function getRandomInt(max) {
            return Math.floor(Math.random() * max);
        }
    }

    buttonProfile.onclick = function () {
        dialogAuthorization.showModal();
        setOnOutsideDialogClickListener(dialogAuthorization);
    }

    buttonRadio.onclick = function () {
        let streamPlaying = false;
        let buttonPlayImage = document.getElementById("buttonPlayImage");
        let spanTrackName = document.getElementById("spanTrackName");

        buttonPlay.onclick = function () {
            audioGolemStream.play();
            if (streamPlaying) {
                buttonPlayImage.classList.add("fa-play");
                streamPlaying = false;
                audioGolemStream.volume = 0;
            } else {
                buttonPlayImage.classList.remove("fa-play");
                buttonPlayImage.classList.add("fa-pause");
                streamPlaying = true;
                audioGolemStream.volume = 1;
            }
        }

        setInterval(() => {
            fetch("https://golemworld.ru:8443/status-json.xsl")
                .then(jsonResponse => jsonResponse.json())
                .then(json => {
                    spanTrackName.innerHTML = json.icestats.source.title;
                    audioGolemStream.title = `${json.icestats.source.title} (Golem Radio)`;
                });
        }, 2500);

        dialogRadio.showModal();

        setOnOutsideDialogClickListener(dialogRadio);
    }

    getUserPosts();

    function setOnOutsideDialogClickListener(dialog) {
        dialog.addEventListener('click', function (event) {
            let rect = dialog.getBoundingClientRect();
            let isInDialog = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height
                && rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
            if (!isInDialog) {
                dialog.close();
            }
        });
    }

    function getUserPosts() {
        document.getElementById("postsContainer").innerHTML = "";
        get(child(dbRef, `Golem Radio/Users/${spanUsername.textContent.slice(1)}/posts`,)).then((snapshot) => {
            let posts = snapshot.val();
            for (let post in posts) {
                let postItem =
                    `
                    <div class="post-container">
                            <div class="post-image-container">
                                <img src="/images/${spanUsername.textContent.slice(1)}.png">
                            </div>
                            <div class="post-main-container">
                                <div class="post-main-container-username">
                                    <span class="default-text" style="font-weight: 400;">${posts[post].name}</span>
                                    <svg class="verification-badge-post" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#268ce5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke="#141414"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76" stroke="#141414" stroke-width="3"/><path d="m9 12 2 2 4-4" stroke="#0e0e0e"/></svg>
                                    <span class="semi-transparent-text" style="margin-left: 2px; font-size: 14px;">${posts[post].date}</span>
                                </div>
                                <div class="post-main-container-text">
                                    <span class="default-text">
                                        ${posts[post].text}
                                    </span>
                                </div>
                                <div class="post-main-container-actions">
                                    <div class="action-container">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart-icon lucide-heart"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                                        <span class="default-text" style="margin-left: 4px;">${posts[post].likes}</span>
                                    </div>
                                    <div class="action-container" style="margin-left: 15px;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle-icon lucide-message-circle"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
                                        <span class="default-text" style="margin-left: 2px;">${posts[post].comments}</span>
                                    </div>
                                    <div class="action-container" style="margin-left: 15px;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-repeat-icon lucide-repeat"><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>
                                        <span class="default-text" style="margin-left: 4px;">${posts[post].reposts}</span>
                                    </div>
                                </div>
                            </div>                    
                        </div>
                    `;
                document.getElementById("postsContainer").innerHTML += postItem;
            }
        });
    }
}