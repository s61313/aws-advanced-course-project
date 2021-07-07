
const owner = sessionStorage.getItem('username');
const quiz_container = $(".quiz-container");
$(document).ready(() => {
    quizPageRender("main");
});

const quizPageRender = (page, params = null) => {

    quiz_container.empty();

    if(page === "main") { // quiz main page
        mainPageRender();
    }
    else if(page === "take" || page === "creationResult") { // take a quiz or after the quiz creation
        quizCardPageRender(page);
    }
    else if(page === "doing" && params !== null) {
        takeQuizPageRender(params);
    }
    else if(page === "answer") {
        quizAnswerPageRender(params);
    }
    else if(page === "result") {
        quizResultPageRender(params);
    }
    else if(page === "create") {
       quizCreationPageRender(params);
    }
}

const mainPageRender = () => {

    $('.page-title').text("Wildfire Quiz Page"); // set the title

    $.ajax({
        url: `/api/quiz?username=${owner}`,
        type: "GET",
        dataType: "json",
        success: function (res) {
            openQuizMainPage(res);
        }, 
    });

}

const quizCardPageRender = (page) => {

    if(page === "take")
            $('.page-title').text("Take a Quiz!!"); // set the title
        else if(page === "creationResult")
            $('.page-title').text("Create the Quiz Success!"); // set the title

        // stroe the quiz record of the user
        const quiz_record_set = new Set();
        // get quiz list from quiz table
        $.ajax({
            url: `/api/quiz/list`,
            type: "GET",
            datatype: "json",
            success: function (res) {
                if(page === "take")
                {
                    // get quiz taking records of the user from quizrecord
                    $.ajax({ 
                        url: `api/quiz/record?username=${owner}`,
                        type: "GET",
                        datatype: "json",
                        success: function (record) {
                            // add quiz record to the set and pass it to taking quiz page
                            record.data.forEach(e => quiz_record_set.add(e.quiziddone));
                            openTakingQuizPage(res, quiz_record_set);
                        },
                    });
                }
                else
                {
                    openTakingQuizPage(res); //after the quiz creation, just wanna take a look at the result
                }
                    
            },
        });
}

const takeQuizPageRender = (params) => {
    $('.page-title').text("Take a Quiz!!"); // set the title
    openQuizQuesitonPage(params);
}

const quizAnswerPageRender = (params) => {
    $('.page-title').text("Quiz Answer"); // set the title
    openQuizAnswerPage(params);
}

const quizResultPageRender = (params) => {
    $('.page-title').text("Quiz Result"); // set the title
    $.ajax({
        url: `/api/quiz?username=${owner}`,
        type: "GET",
        dataType: "json",
        success: function (res) {
            openQuizResultPage(params);
        }, 
    });    
}

const quizCreationPageRender = (params) => {

    $('.page-title').text("Create a Quiz!!"); // set the title
    if(params === null)
        openCreateQuizPage();
    else
        openCreateQuizPage(params);
}

const computeScore = (target, score_txt) => {
    const inc = 1;
    const count = +score_txt.text();

    if(count < target)
    {
        score_txt.text(count + inc);
        setTimeout(() => {computeScore(target, score_txt)}, 10);
    } 
    else
    {
        score_txt.text(target);
    }

}

const openQuizMainPage = (res) => {
    
    var main_page = quizMainPage();
    quiz_container.append(main_page);
    // start to count the score
    $(".score-txt").text(Math.floor(res.data * 2 / 3)); 
    computeScore(res.data, $(".score-txt"));

    $("#take-quiz-btn").on("click", () => {quizPageRender("take")});
    $("#create-quiz-btn").on("click", () => {quizPageRender("create")});
}

const openTakingQuizPage = (res, quiz_record_set = null) => {

    var content = takingQuizPage();
    quiz_container.append(content);
    const quiz_list = res.data;
    $(".quiz-event").empty();

    //append quiz sets to the page
    for(var i = 0; i < res.data.length; i++)
    {
        // if user did the quiz, make the quiz disable
        const did_quiz = ((quiz_record_set !== null) && quiz_record_set.has(quiz_list[i].idquiz)) ? true : false; 

        const quiz_card = `<div class="card text-white ${did_quiz === true ? 'bg-secondary' : 'bg-primary'} mb-3" eventid="${i}">
                                <div class="card-header">Statue: ${did_quiz === true ? 'Done' : 'Open'} </div>
                                <div class="card-body">
                                <h6 class="card-title">Quiz: ${quiz_list[i].quiz}</h6>
                                <h6 class="card-title">Create By ${quiz_list[i].creator}</h6>
                                <h6 class="card-title">${quiz_list[i].time}</h6>
                                </div>
                            </div>`;
        $(".quiz-event").append(quiz_card);
    }

    if(quiz_record_set !== null) // just look = true for creating the quiz and wanna see the creation
    {
        $(`.quiz-event .bg-primary`).on("click", (e) => {
            const quiz_no = $(e.currentTarget).attr("eventid");
            quizPageRender("doing", res.data[quiz_no]);
        }); // redirect to quiz doing page
    }
    $(".back-btn").on("click", () => {quizPageRender("main");}); // back to the quiz page
}

const openQuizQuesitonPage = (q_info) => {

    var question_content = questionPage(q_info);

    quiz_container.append(question_content);
    $('.submit-btn').on("click", ()=>{
        var total_score = 0;
        if((!$('#q1-option1').is(':checked') && !$('#q1-option2').is(':checked')) || (!$('#q2-option1').is(':checked') && !$('#q2-option2').is(':checked')))
        {
            showPopupMsg("Input options error, please check our options");
        }
        else
        {
            var ans1 = $('#q1-option1').is(':checked') ? 1 : 2;
            var ans2 = $('#q2-option1').is(':checked') ? 1 : 2;
            var q1_correct = false;
            var q2_correct = false;
            if(q_info.answer1 == ans1) {
                total_score += 10;
                q1_correct = true;
            }
            if(q_info.answer2 == ans2) {
                total_score += 10;
                q2_correct = true;
            }
            quizPageRender("answer", {q_info: q_info, total_score: total_score, q1_correct: q1_correct, q2_correct: q2_correct});
        }
    });
}

const openQuizAnswerPage = (quiz_info) => {

    const {q_info, total_score, q1_correct, q2_correct} = quiz_info;
    const answer_info = {
        correct_opt1: (q_info.answer1 == 1) ? q_info.q1option1 : q_info.q1option2,
        correct_opt2: (q_info.answer2 == 1) ? q_info.q2option1 : q_info.q2option2,
        q_info: q_info,
        q1_correct: q1_correct,
        q2_correct: q2_correct
    };

    var answer_content = quizAnswerPage(answer_info);

    quiz_container.append(answer_content);
    $('#q-confirm-btn').on("click", () => {
        quizPageRender("result", {q_info: q_info, total_score: total_score});
    });

}

const openQuizResultPage = (quiz_data) => {

    const idquiz = quiz_data.q_info.idquiz;
    const total_score = quiz_data.total_score;
    const sendData = {
        username: owner,
        score: (total_score == 20) ? 20 : 0, // only get the all answer right to get a whole socre. Otherwise, get 0.
        idquiz: idquiz
    };
    
    // update the new score to database and show it on the screen
    $.ajax({
        url: `/api/quiz`,
        type: "POST",
        dataType: "json",
        data: sendData,
        success: function (res) {

            // update the new score to database and show it on the screen
            $(".score-body").text(Math.floor(total_score * 2 / 3)); // animation: counting from the half of the score
            $(".cum-score-body").text(Math.floor(res.data * 2 / 3)); 
            computeScore(total_score, $(".score-body"));
            computeScore(res.data, $(".cum-score-body"));
        }, 
    });

    // random generate image good1.png and good2.png, bad1.png and bad2.png
    const score_image_name = (total_score == 20) ? (`good${Math.floor(Math.random()*2) + 1}.png`) : (`bad${Math.floor(Math.random()*2) + 1}.png`); 
    
    const quiz_result = quizResultPage(score_image_name);
    quiz_container.append(quiz_result);
    $('#q-result-confirm-btn').on("click", () => { quizPageRender("main"); });
}

const openCreateQuizPage = (quiz_creation_info = null) => {

    // create the first question, need to type the question title, but don't need to create title again in the second term
    const q_title = (quiz_creation_info === null) ? `<input class="form-control" id="q-title" placeholder="Title" required></input>` : `<h6 style="color:red;"> ${quiz_creation_info.quiz} </h6>`;
    const send_btn = (quiz_creation_info === null) ? `Next` : `Create`; 
    const q_num = (quiz_creation_info === null) ? 1 : 2;

    const create_quiz_form = quizForm(q_title, send_btn, q_num);

    quiz_container.append(create_quiz_form);
    $('.submit-form').on("submit", (e) => {
        e.preventDefault();
        createQuiz(quiz_creation_info);
    })
}

const showPopupMsg = (msg) => {
    $('#popup-msg').text(msg);
    $('#input-error-popup').modal("show");
}

const createQuiz = (quiz_creation_info) => {

    if(!$('#answer1').is(':checked') && !$('#answer2').is(':checked')) showPopupMsg("Please select one answer.");
    else {
        const answer = ($('#answer1').is(':checked')) ? 1 : 2;
        if(quiz_creation_info === null) {
            quiz_creation_info = {
                quiz: $('#q-title').val(), question1: $('#q-question').val(),
                q1option1: $('#q-option1').val(), q1option2: $('#q-option2').val(), answer1: answer
            };
            quizPageRender("create", quiz_creation_info);
        } else {
            quiz_creation_info.question2 = $('#q-question').val(); 
            quiz_creation_info.q2option1 = $('#q-option1').val(); 
            quiz_creation_info.q2option2 = $('#q-option2').val();
            quiz_creation_info.answer2 = answer;
            quiz_creation_info.creator = owner;

            // create the new quiz event and send to the server
            $.ajax({
                url: `/api/quiz/creation`,
                type: "POST",
                dataType: "json",
                data: quiz_creation_info,
                success: function (res) {
                    quizPageRender("creationResult");
                }, 
            });
        }
    }
}

const quizForm = (q_title, send_btn, q_num) => {

    return `<form class="submit-form">
                <div class="form-group"> <label > Quiz Title </label> ${q_title} </div>
                <div class="form-group">
                    <label for="exampleInputPassword1">Question ${q_num}</label>
                    <div class="q-txt-area">
                        <textarea id="q-question" class="span6" rows="3" placeholder="Question?" required></textarea>
                    </div>
                </div>
                <div class="form-group">
                    <label >Option 1</label>
                    <input id="q-option1" class="form-control" placeholder="option 1" required></input>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="answer" id="answer1"></input>
                        <label class="form-check-label" for="answer" style="color:blue;"> Answer </label>
                    </div>
                </div>
                <div class="form-group">
                    <label >Option 2</label>
                    <input id="q-option2" class="form-control" placeholder="option 2" required></input>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="answer" id="answer2"></input>
                        <label class="form-check-label" for="answer" style="color:blue;"> Answer </label>
                    </div>
                </div>
                <div class="submit-btn">
                    <button type="submit" class="btn btn-primary" id="send-btn">${send_btn}</button>
                </div>
            </form>`;
}

const quizResultPage = (score_image_name) => {

    return ` <div>
                <h4>YOUR SCORE <span class="badge badge-danger">New</span></h4>
                <div class="score-result">
                    <span class="score-body">0</span>
                    <span> / 20</span>
                </div>
                <div class="score-img">
                    <img src="/assets/${score_image_name}" alt="socre-img">           
                </div> 
            </div>
            <hr class="solid">
            <div>
                <h4> CUMULATIVE POINTS</h4>
                <div class="score-result">
                    <span class="cum-score-body">0</span>
                </div>
            </div>
            <div class="submit-btn">
                <button type="button" class="btn btn-primary" id="q-result-confirm-btn">Go back to Quiz Page</button>
            </div>`;

}

const quizAnswerPage = (answer_info) => {
    
    const {q_info, correct_opt1, correct_opt2, q1_correct, q2_correct} = answer_info;

    console.log(answer_info);

    return `<div class="card answer-card overflow-auto ${q1_correct ? "correct" : "incorrect"}" id="q1">
                <div class="q-body">
                    <h5 class="card-title">Q1 ${q1_correct ? "(Correct)" : "(Incorrect)"}</h5>
                    <p class="card-text">${q_info.question1}</p>
                    <h5> Ans: </h5>
                    <div>
                        <p> ${correct_opt1}</p>
                    </div>
                </div>
            </div>
            <div class="card answer-card overflow-auto ${q2_correct ? "correct" : "incorrect"}" id="q2">
                <div class="q-body">
                    <h5 class="card-title">Q2 ${q2_correct ? "(Correct)" : "(Incorrect)"}</h5>
                    <p class="card-text">${q_info.question2}</p>
                    <h5> Ans: </h5>
                    <div>
                        <p> ${correct_opt2}</p>
                    </div>
                </div>
            </div>
            <div class="submit-btn">
                <button type="button" class="btn btn-primary" id="q-confirm-btn">Confirm</button>
            </div>`;
}

const takingQuizPage = () => {
    return `<div class="quiz-event overflow-auto">
            </div>
            <div class="back-btn">
                <button type="button" class="btn btn-primary" id="back-btn">Back</button>
            </div>`;
}

const quizMainPage = () => {

    return `<div class="quiz-btn">
                <button type="button" class="btn btn-primary btn-lg" id="take-quiz-btn"><i class="fa fa-fire fa-lg"></i> Take a Quiz <i class="fa fa-fire fa-lg"></i></button>
                <button type="button" class="btn btn-success btn-lg" id="create-quiz-btn"><i class="fa fa-fire fa-lg"></i> Create a Quiz <i class="fa fa-fire fa-lg"></i></button>
            </div>
            <h4>YOUR CURRENT POINTS: </h4>
            <h4 class="score-txt">0</h4>
            `;

}

const questionPage = (q_info) => {

    return `<div class="card quiz-card overflow-auto" id="q1">
                <div class="q-body">
                    <h5 class="card-title">Q1</h5>
                    <p class="card-text">${q_info.question1}</p>

                    ${quizRadioButton(q_info.q1option1, "q1-option1", "q1-option")}
                    ${quizRadioButton(q_info.q1option2, "q1-option2", "q1-option")}

                </div>
            </div>
            <div class="card quiz-card overflow-auto" id="q2">
                <div class="q-body">
                    <h5 class="card-title">Q2</h5>
                    <p class="card-text">${q_info.question2}</p>

                    ${quizRadioButton(q_info.q2option1, "q2-option1", "q2-option")}
                    ${quizRadioButton(q_info.q2option2, "q2-option2", "q2-option")}

                </div>
            </div>
            <div class="submit-btn">
                <button type="button" class="btn btn-primary" id="q-submit-btn">Submit</button>
            </div>`;

}

const quizRadioButton = (title, id, name) => {

    return `<div class="form-check">
                <input class="form-check-input" type="radio" name="${name}" id="${id}">
                <label class="form-check-label" for="${id}">
                ${title}
                </label>
            </div>`;
    
}