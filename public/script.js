document.getElementById("quiz-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const inputData = document.getElementById("inputData").value;
    const quizOutput = document.getElementById("quiz-output");

    // Clear previous quizzes
    quizOutput.innerHTML = "<p>Generating quizzes...</p>";

    try {
        const response = await fetch("/process", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({ inputData })
        });

        if (!response.ok) {
            throw new Error("Failed to fetch quizzes. Please try again.");
        }

        const quizzes = await response.json();

        // Clear loading message
        quizOutput.innerHTML = "";

        quizzes.forEach((quiz, index) => {
            const quizDiv = document.createElement("div");
            quizDiv.classList.add("quiz");

            const question = document.createElement("h3");
            question.textContent = `${index + 1}. ${quiz.question}`;
            quizDiv.appendChild(question);

            const optionsDiv = document.createElement("div");
            optionsDiv.classList.add("options");

            quiz.options.forEach((option) => {
                const optionButton = document.createElement("button");
                optionButton.textContent = option;
                optionButton.addEventListener("click", () => {
                    //alert(option === quiz.answer ? "Correct!" : "Wrong Answer");
                    if(option===quiz.answer){
                      //  optionButton.parentElement.parentElement.style.backgroundColor = '#99FF53';
                        optionButton.style.backgroundColor = '#99FF53';
                    }
                    else{
                      //  optionButton.parentElement.parentElement.style.backgroundColor = '#FA6F6F';
                        optionButton.style.backgroundColor = '#FA6F6F';
                    }
                });
                optionsDiv.appendChild(optionButton);
            });

            quizDiv.appendChild(optionsDiv);
            quizOutput.appendChild(quizDiv);
        });
    } catch (error) {
        quizOutput.innerHTML = `<p style="color: red;">${error.message}</p>`;
    }
});