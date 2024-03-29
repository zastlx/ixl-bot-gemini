import "dotenv/config";
import parse from "html-dom-parser";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { answerQuestion, getImportantData, getQuestionData } from "./src/ixl-wrapper";
import { safetySettings } from "./saftey";
import { performance } from "perf_hooks";
import { sleep } from "bun";
let poseDate: Date;

function parseQuestion(data) {
    let tree = parse(`<div>${data.replace(/<sup .{0,}\>(\d{1,3})\<\/sup>/gm, "^$1")}</div>`);
    let question = "";

    function getChild(node) {
        if (node.children) {
            for (let i = 0; i < node.children.length; i++) {
                getChild(node.children[i])
            }
        }
        else question += node.data.replace(".", ": ")
        
    }

    getChild(tree[0])
    return question;
}

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

async function answerPook() {
    const ixlConfig: {
        pesId: string;
        initialQuestionKey: string;
        maxTimePerQuestion: number;
        userId: number;
    
    } = await getImportantData("grade-8/evaluate-powers");
    
    const dataaa = await getQuestionData(ixlConfig.pesId, ixlConfig.initialQuestionKey);
    poseDate = new Date;

    chat.sendMessage(parseQuestion(dataaa.question.content.content.content.html.html)).then(async(a) => {
        const res = a.response.text();
        // @ts-ignore
        const e = new Date - poseDate;
        const fart = await answerQuestion(ixlConfig.pesId, dataaa.questionKey, {
            FillIn0: `"${res}"`
        }, e);
        console.log(`Correct: ${fart.correct}`);
        console.log(`Score: ${fart.practiceStats.score}`);
        if (fart.practiceStats.score === 100) return console.log("Done.");
        answerPook();
    });
}

answerPook();