document.addEventListener("DOMContentLoaded", () => {

    const leetCodeSearchButton = document.getElementById('leetCodeSearch-btn');
    const leetcodeUsernameInput = document.getElementById('leetCodeUser-input');
    const leetcodeStatsContainor = document.querySelector('.leetCodeStats-containor');
    const leetcodeEasyProgressCircle = document.querySelectorAll('.progress-item')[0];
    const leetCodeMediumProgressCircle = document.querySelectorAll('.progress-item')[1];
    const leetCodeHardProgressCircle = document.querySelectorAll('.progress-item')[2];
    const leetCodeEasyLabel = document.getElementById('leetCodeEasy-label');
    const leetCodeMediumLabel = document.getElementById('leetCodeMedium-label');
    const leetCodeHardLabel = document.getElementById('leetCodeHard-label');
    const leetCodeOverAllAccuracyContainor = document.querySelector('.leetCodeOverAllAccuracy');
    const leetCodeRecentProblemsContainor = document.querySelector('.leetCodeRecentProblems');



    const validateUsername = (username) => {
        if (username.trim() === "") {
            alert("Username must not be empty.");
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching = regex.test(username);
        if (!isMatching) {
            alert("Invalid Username");
        }
        return isMatching;
    }

    const fetchLeetCodeUserDetails = async (leetCodeUsername) => {
        const url = `https://alfa-leetcode-api.onrender.com/userProfile/${leetCodeUsername}`;
        try {
            leetCodeSearchButton.textContent = "Searching...";
            leetCodeSearchButton.disabled = true;


            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Unable to get details. Try again...");
            }
            const responseData = await response.json();

            displayLeetCodeUserData(responseData);
        }
        catch (error) {
            leetcodeStatsContainor.innerHTML = "<p>Unable to find data.</p>"
        }
        finally {
            leetCodeSearchButton.textContent = "Search";
            leetCodeSearchButton.disabled = false;
        }
    }


    const leetCodeUpdateProgress = (solved, total, label, circle) => {
        const progressPercentage = (solved / total) * 100;

        circle.style.setProperty("--progress-percent", `${progressPercentage}%`);
        label.textContent = `${solved}/${total}`;
    }


    const displayLeetCodeUserData = (responseData) => {

        leetcodeStatsContainor.style.display = 'flex';

        const leetCodeTotalEasyQues = responseData.totalEasy;
        const leetCodeTotalMediumQues = responseData.totalMedium;
        const leetCodeTotalHardQues = responseData.totalHard;

        const leetCodeSolvedEasyQues = responseData.easySolved;
        const leetCodeSolvedMediumQues = responseData.mediumSolved;
        const leetCodeSolvedHardQues = responseData.hardSolved;


        leetCodeUpdateProgress(leetCodeSolvedEasyQues, leetCodeTotalEasyQues, leetCodeEasyLabel, leetcodeEasyProgressCircle);
        leetCodeUpdateProgress(leetCodeSolvedMediumQues, leetCodeTotalMediumQues, leetCodeMediumLabel, leetCodeMediumProgressCircle);
        leetCodeUpdateProgress(leetCodeSolvedHardQues, leetCodeTotalHardQues, leetCodeHardLabel, leetCodeHardProgressCircle);

        const leetCodeTotalSubmissions = responseData.totalSubmissions[0].submissions;
        const leetCodeAcceptedSubmissions = responseData.matchedUserStats.acSubmissionNum[0].submissions;

        const leetCodeOverAllAccuracy = Math.round((leetCodeAcceptedSubmissions / leetCodeTotalSubmissions) * 100) + "";

        leetCodeOverAllAccuracyContainor.innerHTML = `<p>OverAll Accuracy</p><p>${leetCodeOverAllAccuracy.slice(0, 5)}%</p>`;

        const leetCodeRecentSubmissions = responseData.recentSubmissions.splice(0, 5);


        leetCodeRecentProblemsContainor.innerHTML ="<h3>Last 5 Submissions:-</h3>"+ leetCodeRecentSubmissions.map(data => {
            return `<div class="submissionItem" >
            <h4><strong style="color:orange">Title:</strong>${data.title}</h4> 
            <p><strong style="color:orange">Status:</strong>${data.statusDisplay}</p>
            </div>
            `
        }).join("");

    }


    leetCodeSearchButton.addEventListener('click', () => {
        const leetCodeUsername = leetcodeUsernameInput.value;

        if (validateUsername(leetCodeUsername)) {
            fetchLeetCodeUserDetails(leetCodeUsername);
        }

    })
})