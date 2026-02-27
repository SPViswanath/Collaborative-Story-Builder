import { useEffect, useMemo, useRef, useState } from "react";

function SpeechToTextButton({
  disabled,
  activeChapterId,
  onFinalText,
  onStatusChange,
}) {
  const [isOn, setIsOn] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const recognitionRef = useRef(null);

  const SpeechRecognition = useMemo(() => {
    return window.SpeechRecognition || window.webkitSpeechRecognition || null;
  }, []);

  const isSupported = !!SpeechRecognition;

  const stopRecognition = () => {
    try {
      recognitionRef.current?.stop();
    } catch {}
  };

  const startRecognition = () => {
    if (!isSupported) return;
    if (disabled) return;

    // Create only once
    if (!recognitionRef.current) {
      const recognition = new SpeechRecognition();

      recognition.continuous = true;
      recognition.interimResults = false; // ✅ A1 final only
      recognition.lang = "en-US"; // You can change later if needed

      recognition.onresult = (event) => {
        if (disabled) return;

        let finalText = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) {
            finalText += res[0].transcript;
          }
        }

        finalText = finalText.trim();
        if (finalText) onFinalText?.(finalText);
      };

      recognition.onerror = () => {
        // stop to avoid infinite errors
        setIsOn(false);
      };

      recognition.onend = () => {
        // If user didn't manually stop, browser may stop sometimes.
        // We'll keep OFF state to avoid auto loops.
        setIsOn(false);
      };

      recognitionRef.current = recognition;
    }

    try {
      recognitionRef.current.start();
    } catch {
      // start() can throw if already started
    }
  };

  const toggleMic = () => {
    if (!isSupported) return;

    if (disabled) return;

    if (isOn) {
      stopRecognition();
      setIsOn(false);
    } else {
      startRecognition();
      setIsOn(true);
      setShowHint(true);
    }
  };

  // ✅ Auto close hint tooltip after 3 seconds
  useEffect(() => {
    let timer;
    if (showHint) {
      timer = setTimeout(() => setShowHint(false), 3000);
    }
    return () => clearTimeout(timer);
  }, [showHint]);

  // ✅ Auto stop when chapter changes (B1)
  useEffect(() => {
    if (!activeChapterId) return;
    if (!isOn) return;

    stopRecognition();
    setIsOn(false);
  }, [activeChapterId]);

  // ✅ Auto stop if it becomes disabled (locked by other)
  useEffect(() => {
    if (!isOn) return;
    if (!disabled) return;

    stopRecognition();
    setIsOn(false);
  }, [disabled]);

  // cleanup
  useEffect(() => {
    return () => {
      stopRecognition();
    };
  }, []);

  useEffect(() => {
    onStatusChange?.(isOn);
  }, [isOn]);

  if (!isSupported) {
    return (
      <button
        type="button"
        disabled
        className="px-3 py-2 rounded-md text-sm bg-gray-200 text-gray-500 cursor-not-allowed"
        title="Speech-to-text not supported in this browser"
      >
        🎤
      </button>
    );
  }

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={toggleMic}
        disabled={disabled}
        className={`px-3 py-2 rounded-md text-sm transition ${
          disabled
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : isOn
            ? "bg-red-600 text-white hover:bg-red-700"
            : "bg-gray-100 text-gray-900 hover:bg-gray-200"
        }`}
        title={isOn ? "Stop voice typing" : "Start voice typing"}
      >
        {isOn ? "🎙️ ON" : "🎤"}
      </button>

      {/* Instructional Hint Tooltip */}
      {showHint && (
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-[240px] bg-gray-900 text-white text-xs text-center px-4 py-3 rounded-lg shadow-xl z-50 pointer-events-none animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-900 rotate-45"></div>
          Place the cursor wherever you want to start, then speak to record.
        </div>
      )}
    </div>
  );
}

export default SpeechToTextButton;
