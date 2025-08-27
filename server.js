// Translate function
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
    document.getElementById("output").innerText = data.responseData.translatedText;

    // re-attach speaker icon
    const outputBox = document.getElementById("output");
    const speaker = document.createElement("span");
    speaker.innerText = "🔊";
    speaker.classList.add("speaker");
    speaker.id = "speakOutput";
    speaker.onclick = speakOutput;
    outputBox.appendChild(speaker);

  } catch (error) {
    document.getElementById("output").innerText = "Error: " + error;
  } finally {
    btn.classList.remove("pressed");
  }
}

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

// Speak output aloud
function speakOutput() {
  const text = document.getElementById("output").innerText;
  if (!text || text.includes("Translation will appear here")) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = document.getElementById("toLang").value;
  speechSynthesis.speak(utterance);
}

// Event listeners
document.getElementById("translateBtn").addEventListener("click", translateText);
document.getElementById("speakOutput").addEventListener("click", speakOutput);
