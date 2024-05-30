
// GLOBAL VARIABLES
const form = document.querySelector("form")
const languageContainer = document.querySelector(".languages-container")
const buttonContainer = document.querySelector(".translated-btn-container")
const resetContainer = document.querySelector(".reset-btn-container")
const translatedTextContainer = document.querySelector(".translated-text-container")
const translatedTextTextArea = translatedTextContainer.querySelector("textarea")

resetContainer.addEventListener("click", (e) => {
    e.preventDefault()
    form.reset()
    
    resetContainer.style.display = "none"
    buttonContainer.style.display = "flex"

    translatedTextContainer.style.display = "none" 
    languageContainer.style.display = "flex"
})

buttonContainer.addEventListener("click", (e) => {
    e.preventDefault()

    const inputText = getInputText()
    const selectedLanguage = getSelectedLanguage()
    fetchTranslation(inputText, selectedLanguage)
})

async function fetchTranslation(inputText, targetLanguage) {
    const messages = [
        {
            "role": "system",
            "content": `
            Your an expert language instructor.
            Given an English text and a target language, your response should only include the sentence translated in the target language.
            `
        }
    ]


    const message = {
        "role": "user",
        "content": `
        Translate the following text to ${targetLanguage}:
        ${inputText}
        `
    }

    try {

        messages.push(message)
        const url = "https://openai-api-worker.matteo-pilotto.workers.dev"

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(messages)
        })

        const data = await response.json()
        renderTranslation(data.content)
        // console.log(data)
    } catch(error) {
        console.error(error.message)
        loadingArea.innerText = "Unable to access AI. Please refresh and try again."
    }

}

function renderErrorMessage() {
    languageContainer.style.display = "none"
    translatedTextContainer.innerHTML = "There was error calling the OpenAI API."
    translatedTextContainer.style.color = "red"
    translatedTextContainer.style.display = "flex" 
}

function renderTranslation(response) {
    translatedTextTextArea.value = response
    languageContainer.style.display = "none"
    translatedTextContainer.style.display = "flex" 
    buttonContainer.style.display = "none"
    resetContainer.style.display = "flex"
}


function getInputText() {
    const inputTextContainer = document.querySelector(".text-area")
    const inputText = inputTextContainer.value

    return inputText
}

function getSelectedLanguage() {
    const radios = document.querySelectorAll("input[name='language']")
    let selectedValue

    for (const radio of radios) {
        if (radio.checked) {
            selectedValue = radio.value
            break
        }
    }

    return selectedValue
}