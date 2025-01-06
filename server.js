const { GoogleGenerativeAI } = require("@google/generative-ai");

require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 2000;

async function run(inputData) {
    const result = await model.generateContent(inputData);
    const response = await result.response;
    const text = response.text();
    return text;
}

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (e.g., HTML)
app.use(express.static('public'));

// Handle form submission
app.post('/process', async (req, res) => {
    const inputData = req.body.inputData;
    try {
        const finalInput = inputData + " Create 10 quiz questions in JSON format. Each quiz should have 'question', 'options' (array of 4 strings), and 'answer' keys.";
        const tanishq = await run(finalInput);
        console.log(tanishq)
        // Locate the JSON structure in the AI response
        const startIndex = tanishq.indexOf('['); // Locate the start of the JSON array
        const endIndex = tanishq.lastIndexOf(']') + 1; // Locate the end of the JSON array

        if (startIndex === -1 || endIndex === -1) {
            throw new Error("Invalid JSON format in AI response.");
        }

        const quizJson = tanishq.slice(startIndex, endIndex); // Extract JSON array
        const quizzes = JSON.parse(quizJson); // Parse into JavaScript object

        console.log("Generated Quizzes:", quizzes);
        res.json(quizzes); // Send structured JSON to the client
    } catch (error) {
        console.error("Error during processing:", error);
        res.status(500).send("Error processing your request. Ensure the AI response is valid JSON.");
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});