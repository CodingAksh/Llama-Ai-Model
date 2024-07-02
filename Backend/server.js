require("dotenv").config()
const express = require("express");
const bodyParser = require("body-parser"); 
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const llamaApiUrl =  process.env.END_POINT; 

const llamaApiKey = process.env.API_KEY;

const modelName = process.env.MODEL; 

// Endpoint to handle chat messages

app.get('/' , (req, res) =>{
    res.send("<h1>hello Welcome to Chatbot Server Home page</h1>")
})
app.post("/chat", async (req, res) => {
    const userMessage = req.body.message;

    try {
        const response = await axios.post(
            llamaApiUrl,
            {
                model: modelName,
                messages: [
                    {
                        role: "user",
                        content: userMessage, 
                    },
                ],
            },
            {
                headers: {
                    Authorization: `Bearer ${llamaApiKey}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const botReply = response.data.choices[0].message.content;
        res.json({ reply: botReply });
    } catch (error) {
        console.error("Error communicating with Llama API:", error.response.data);
        res.status(500).json({
            error: "Failed to get response from Llama API",
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
