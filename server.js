import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(express.json());
app.use(cors());

// Initialize the Google Gen AI SDK client securely using environment variables
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Helper function with exponential backoff for Gemini API calls
 */
async function generateWithRetry(params, maxRetries = 3, initialDelay = 1000) {
  let delay = initialDelay;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await ai.models.generateContent(params);
    } catch (error) {
      const isOverloaded = error.status === 503 || error.code === 503 || (error.message && error.message.includes('high demand'));
      
      if (isOverloaded && attempt < maxRetries) {
        console.warn(`[Gemini API] 503 High Demand encountered. Retrying in ${delay}ms (Attempt ${attempt}/${maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Double the wait time for exponential backoff
      } else {
        throw error; // Re-throw if it's not a 503 or if we ran out of retries
      }
    }
  }
}

/**
 * Chat API Endpoint with Model Fallback
 */
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message content is required." });
    }

    let response;

    try {
      // Primary attempt using the main model
      response = await generateWithRetry({
        model: 'gemini-2.5-flash',
        contents: message,
      });
    } catch (primaryError) {
      if (primaryError.status === 503 || primaryError.code === 503) {
        console.warn("[Gemini API] Primary model overloaded. Falling back to alternative model...");
        
        // Secondary fallback attempt on an alternative flash model
        response = await generateWithRetry({
          model: 'gemini-2.0-flash',
          contents: message,
        });
      } else {
        throw primaryError;
      }
    }

    // Send the generated text back to your frontend UI
    res.json({ response: response.text });

  } catch (error) {
    console.error("Backend Chat Error:", error);
    
    // Return a clean user-facing error message instead of raw JSON stacks
    const statusCode = error.status || 500;
    res.status(statusCode).json({ 
      error: "The AI assistant is currently experiencing heavy load. Please try your request again in a moment." 
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});