// Translate using backend endpoint
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

  try {
    const response = await fetch("/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: inputText, source: fromLang, target: toLang })
    });
    const data = await response.json();
    document.getElementById("output").innerText = data.translatedText;
  } catch (error) {
    document.getElementById("output").innerText = "Error: " + error;
  } finally {
    btn.classList.remove("pressed");
  }
}

// Microphone speech recognition
const micButton = document.getElementById("micButton");
let recognition;

if ('webkitSpeechRecognition' in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = function(event) {
    document.getElementById("inputText").value = event.results[0][0].transcript;
  };

  recognition.onerror = function() {
    alert("Speech recognition error");
  };
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

// Speak Output Button
const speakBtn = document.getElementById("speakOutputBtn");

speakBtn.addEventListener("click", () => {
  const text = document.getElementById("output").innerText;
  if (!text || text === "Translation will appear here..." || text.startsWith("Error")) return;

  const utterance = new SpeechSynthesisUtterance(text);
  const toLang = document.getElementById("toLang").value;
  if (toLang === 'ar') {
    utterance.lang = 'ar-SA';
  } else if (toLang === 'en') {
    utterance.lang = 'en-US';
  } else if (toLang === 'es') {
    utterance.lang = 'es-ES';
  } else if (toLang === 'de') {
    utterance.lang = 'de-DE';
  } else if (toLang === 'fr') {
    utterance.lang = 'fr-FR';
  }
  speechSynthesis.speak(utterance);
});

