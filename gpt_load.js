const https = require('https')
const config = require('./config.json')
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: config.api,
  });
const openai = new OpenAIApi(configuration);
var tips = []
var waiting = []
var populating = false
populate()
module.exports = {
    ask: async function(callback) {
        if(tips.length == 0) {
            waiting.push(callback)
        }
        else {
            callback(tips[0]) 
            tips.shift()
            if(populating == false) populate()
        }
    }
}

async function req(callback) {
    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: "Donne un court conseil sur un sujet précis et non plusieurs sujets sur comment réduire son impact environnemental. Ce sujet pourrait être par exemple: les déchets, le transport, les achats, l'énergie ou autre"}],
        temperature: 1.2,
        max_tokens: 200,
    });
    callback(response)
}

function populate() {
    populating = true
    if(tips.length < 5) {
        console.log("populating")
        req((rep) => {
            tips.push(rep.data.choices[0].message.content)
            if(waiting.length !== 0) {
                waiting.forEach(() => {
                    waiting[0](rep.data.choices[0].message.content)
                    waiting.shift()
                })
            }
            console.log(tips.length)
            populate()
        })
    }
    else populating = false
}