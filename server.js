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
    const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(inputText)}&langpair=${fromLang}|${toLang}`);
    const data = await response.json();
    document.getElementById("output").childNodes[0].nodeValue = data.responseData.translatedText;
  } catch (error) {
    document.getElementById("output").childNodes[0].nodeValue = "Error: " + error;
  } finally {
    btn.classList.remove("pressed");
  }
}

// Translate button
document.getElementById("translateBtn").addEventListener("click", translateText);

// Speech recognition
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

// Text-to-Speech for output
document.getElementById("speakBtn").addEventListener("click", () => {
  const text = document.getElementById("output").childNodes[0].nodeValue;
  if (!text || text.includes("Translation will appear here")) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = document.getElementById("toLang").value;
  speechSynthesis.speak(utterance);
});
