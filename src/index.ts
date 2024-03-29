import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";
import { safetySettings } from "../saftey";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const model = genAI.getGenerativeModel({
    model: "models/gemini-pro",
    safetySettings
});

const chat = model.startChat({
    generationConfig: {
        maxOutputTokens: 20, // should realistcally only need to be 1
    },
    safetySettings,
    history: [{
        role: "user",
        parts: [{
            text: `For now on i am going to send you math equtions, respond with the answer and NOTHING else, 
            example: 
            me - "Evalute: 2^2"
            you - "4"`
        }]
    }, {
        role: "model",
        parts: [{
            text: `Understood.`
        }]
    
    }]
});

chat.sendMessage("").then((a) => console.log(a.response.text()));