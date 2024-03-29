import axios from "axios";

export async function getQuestionData(pesId: string, initialQuestionKey: string) {
    const { data } = await axios.post("https://www.ixl.com/practice/pose?pesId=".concat(pesId), {
        "questionKey": initialQuestionKey
    }, {
        headers: {
            Cookie: "ixl_sess9300=".concat(process.env.IXL_SESS!)
        }
    });

    return data;
}
/*
await fetch("https://www.ixl.com/practice/tally?pesId=6e822596eaee33a0d181623b4d10619f_luc9c7vf_ewbb", {
    "credentials": "include",
    "headers": {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:124.0) Gecko/20100101 Firefox/124.0",
        "Accept": "",
        "Accept-Language": "en-US,en;q=0.5",
        "Content-Type": "application/json; charset=utf-8",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin"
    },
    "referrer": "https://www.ixl.com/math/grade-8/evaluate-powers",
    "body": "{\"questionKey\":\"wk0uru7k\",\"offsetMillis\":2148,\"guesses\":{\"FillIn0\":\"\\\"4\\\"\"}}",
    "method": "POST",
    "mode": "cors"
});
*/
//{"questionKey":"wk18fgdw","offsetMillis":999999,"guesses":{"FillIn0":"\"a\""}}
export async function answerQuestion(pesId: string, questionKey: string, guesses: any, offsetMillis: number) {
    const { data } = await axios.post("https://www.ixl.com/practice/tally?pesId=".concat(pesId), {
        "questionKey": questionKey,
        "offsetMillis": offsetMillis,
        "guesses": guesses
    }, {
        headers: {
            Cookie: "ixl_sess9300=".concat(process.env.IXL_SESS!)
        }
    });

    return data;
}

export async function getImportantData(pagePath: string) {
    const { data } = await axios.get("https://www.ixl.com/math/".concat(pagePath), {
        headers: {
            Cookie: "ixl_sess9300=".concat(process.env.IXL_SESS!)
        }
    });

    let JsonString = "{";
    const regexps = {
        pesId: /pesId: \'.{0,}\'/gm,
        initialQuestionKey: /initialQuestionKey: \'.{0,}\'/gm,
        maxTimePerQuestion: /maxTimePerQuestion: \d{0,}/gm,
        // doesnt match if not logged in cuz id is -1 instead of a "valid" number
        userId: /userId: signedIn \? \d{0,} : null/gm
    }

    JsonString = JsonString.concat(data.match(regexps.pesId)[0].replace("pesId", `"pesId"`).replace(/\'/g, "\"").concat(","))
    JsonString = JsonString.concat(data.match(regexps.initialQuestionKey)[0].replace("initialQuestionKey", `"initialQuestionKey"`).replace(/\'/g, "\"").concat(","))
    JsonString = JsonString.concat(data.match(regexps.maxTimePerQuestion)[0].replace("maxTimePerQuestion", `"maxTimePerQuestion"`).concat(","));
    JsonString = JsonString.concat(data.match(regexps.userId)[0].replace("userId", `"userId"`).replace("signedIn ? ", "").replace(" : null", "").concat(""));

    try {
        return JSON.parse(JsonString.concat("}"));
    } catch (e) {
        console.log(e)
        throw new Error("Make sure you are logged in to IXL.");
    }
}
