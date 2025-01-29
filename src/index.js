const axios = require("axios");
const express = require("express");
const cors = require("cors");
const app = express();
const port = 8080;

app.use(express.json());

// Configurações de CORS
const corsOptions = {
  origin: "http://localhost:3000", // Permite requisições da porta 3001
  methods: ["GET", "POST"], // Métodos permitidos
};

app.use(cors(corsOptions)); // Aplica o middleware CORS

// Substitua pela sua chave de API
const GEMINI_API_KEY = "AIzaSyBtJ5j3hXDiJqiZ01uZWodQiuddiaNSXnA";

// URL da API
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// Função para chamar a API
async function callGeminiAPI(prompt) {
  const requestData = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ]
  };

  try {
    const response = await axios.post(url, requestData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    throw new Error(error.response?.data || error.message);
  }
}

// Endpoint para aceitar requisições POST
app.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).send("Prompt is required");
  }

  try {
    const result = await callGeminiAPI(prompt);
    res.send(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});