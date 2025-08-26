// Grammar correction using LanguageTool API
async function correctGrammar(text) {
  try {
    const response = await fetch('https://api.languagetoolplus.com/v2/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        text: text,
        language: 'en-US',
        enabledOnly: 'false'
      })
    });
    const data = await response.json();
    if (data.matches && data.matches.length > 0) {
      return data.matches[0].replacements[0]?.value || text;
    }
    return text;
  } catch (error) {
    console.error('Grammar correction failed:', error);
    return text;
  }
}

// Translate function using LibreTranslate
async function translateText() {
  const btn = document.getElementById("translateBtn");
  btn.classList.add("pressed");

  const inputText = document.getElementById("inputText").value;
  const fromLang = document.getElementById("fromLang").value;
  const toLang = document.getElementById("toLang").value;

  if (!inputText) {
    document.getElementById("output").innerText = "Please enter text.";
    btn.classList.remove("pressed");
    return;
  }

  const correctedText = await correctGrammar(inputText);

  try {
    const response = await fetch("https://libretranslate.de/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: correctedText,
        source: fromLang,
        target: toLang,
        format: "text"
      })
    });
    const data = await response.json();
    document.getElementById("output").innerText = data.translatedText;
  } catch (error) {
    document.getElementById("output").innerText = "Error: " + error;
  } finally {
    btn.classList.remove("pressed");
  }
}

// Microphone input
const micButton = document.getElementById("micButton");
let recognition;
if ('webkitSpeechRecognition' in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.onresult = event => {
    document.getElementById("inputText").value = event.results[0][0].transcript;
  };
  recognition.onerror = () => alert("Speech recognition error");
} else {
  micButton.disabled = true;
  micButton.innerText = "🎤 Not supported";
}

micButton.addEventListener("click", () => {
  if (recognition) {
    micButton.classList.add("pressed");
    recognition.lang = document.getElementById("micLang").value;
    recognition.start();
    micButton.innerText = "🎤 Listening...";
    recognition.onend = () => {
      micButton.classList.remove("pressed");
      micButton.innerText = "🎤 Speak";
    };
  }
});

// Speak output
const speakOutputBtn = document.getElementById("speakOutputBtn");
speakOutputBtn.addEventListener("click", () => {
  const text = document.getElementById("output").innerText;
  if (!text || !('speechSynthesis' in window)) return;
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
});

// Add event listener for translate button
document.getElementById("translateBtn").addEventListener("click", translateText);
