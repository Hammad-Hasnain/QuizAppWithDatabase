import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { getDatabase, ref, set, onChildAdded } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";

var firebaseConfig = {
    apiKey: "AIzaSyBOhOxelrC1bsht2yHZFq4cyDB7J7VGaMI",
    authDomain: "quiz-app-7b274.firebaseapp.com",
    databaseURL: "https://quiz-app-7b274-default-rtdb.firebaseio.com",
    projectId: "quiz-app-7b274",
    storageBucket: "quiz-app-7b274.appspot.com",
    messagingSenderId: "685932116394",
    appId: "1:685932116394:web:af0b291d14a4721a9513d3",
    measurementId: "G-SHTFR3GWF6"
};

var app = initializeApp(firebaseConfig);
var auth = getAuth(app)
var DATABASE = getDatabase(app)
var signUp = document.getElementById("signUp")
var dataRendering = document.getElementById("dataRendering")
var userEmail = document.getElementById("userEmail")
var userName = document.getElementById("userName")
var userId;
window.signUp = function () {
    console.log("running")
    if (userName.value) {
        createUserWithEmailAndPassword(auth, userEmail.value, "abcdef")
            .then(function (success) {
                console.log(success)
                console.log(success.user.uid)
                userId = success.user.uid;
                signUp.innerHTML = `<h1 class="text-center">Quiz Start</h1>`
                next()

            })
            .catch(function (error) {
                console.log(error)
                console.log(error.code)
                if (error.code === "auth/email-already-in-use") {
                    alert("This email is already in use")
                }
                else if (error.code === "auth/invalid-email") {
                    alert("Inavlid Email ")
                }
                else {
                    alert("Please! Enter your email. ")
                }

            })
    }
    else {
        alert("Please! Enter your name.")
    }

}

var questionIndex = 0;
window.next = function () {

    if (questionIndex < questions.length) {
        render()
        questionIndex++;
    }
    else {
        dataRendering.innerHTML = `<div class="text-center">
        <button onclick="checkScore()" class="my-5 mx-auto btn btn-dark">Check Score</button>
    </div>`
    }

    // increasing score if the answer is correct 
    if (scoreBool) {
        score++;
        console.log("score increased ===> " + score)
    }
    else {
        console.log("score not increased ===> " + score)
    }
    setUserScoreInDatabase()
}

function setUserScoreInDatabase() {
    var Users = {
        userName: userName.value,
        userEmail: userEmail.value,
        score: score,
        id: userId,
    }
    var reference = ref(DATABASE, `Users/${userId}`)
    set(reference, Users)
}


window.checkScore = function () {
    dataRendering.innerHTML = `<h4 class="p-5 text-center">Score ${score} / ${questions.length}</h4>`
}


var questions = []
var questionOptions = []
function render() {
    dataRendering.innerHTML = `<div class="d-flex ">
        <h3 class="  me-2">Q ${questionIndex + 1}: </h3>
        <h3>${questions[questionIndex].question}</h3>

       </div>
        <div class="text-center">
            <button onclick="checkAns('${questions[questionIndex].opt1}','${questions[questionIndex].correctOpt}', 1)" id="btn1" class="btn btn-outline-dark w-75 my-1">${questions[questionIndex].opt1} </button>
            <button onclick="checkAns('${questions[questionIndex].opt2}','${questions[questionIndex].correctOpt}', 2)" id="btn2" class="btn btn-outline-dark w-75 my-1">${questions[questionIndex].opt2} </button>
            <button onclick="checkAns('${questions[questionIndex].opt3}','${questions[questionIndex].correctOpt}', 3)" id="btn3" class="btn btn-outline-dark w-75 my-1">${questions[questionIndex].opt3}</button>
            <button onclick="checkAns('${questions[questionIndex].opt4}','${questions[questionIndex].correctOpt}', 4)" id="btn4" class="btn btn-outline-dark w-75 my-1">${questions[questionIndex].opt4}</button>
        </div>
        <div class="text-end">
            <button onclick="next()" class="btn btn-outline-dark ">Next</button>
        </div> `

}


var score = 0;
var scoreBool = false;
window.checkAns = function (userSelectedOpt, correctOpt, index) {
    if (userSelectedOpt === correctOpt) {
        scoreBool = true;
    }
    else {
        scoreBool = false;
    }
}

window.getDataFromDatabase = function () {
    var reference = ref(DATABASE, `Questions`)
    onChildAdded(reference, function (data) {
        questions.push(data.val())
        console.log(questions)
    })

}

window.onload = getDataFromDatabase()






