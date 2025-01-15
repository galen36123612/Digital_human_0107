import { useRef, useState } from "react";

import Wave from "./Wave";
import { Microphone } from "@phosphor-icons/react";

export enum MicrophoneStatus {
  Listening,
  stopListening
}

interface MicrophoneInputProps {
  talking: boolean;
  contentChange?: (content: string) => void;
  onSubmit?: (content: string) => void;
  onStopPlay?: () => void;
  onStatusChange?: (status: MicrophoneStatus) => void;
}

const SpeechRecognition =
  globalThis.SpeechRecognition || globalThis.webkitSpeechRecognition;

export default function MicrophoneInput({
  talking = false,
  contentChange,
  onSubmit,
  onStopPlay,
  onStatusChange
}: MicrophoneInputProps) {
  const firstflag = useRef(true);
  let recognition = useRef<SpeechRecognition>();

  const [play, setPlay] = useState<boolean>(false);
  const handlerStop = () => {
    setPlay(false);
    onStopPlay && onStopPlay();
  };

  const startPlay = () => {
    if (play) return;
    recognition.current = new SpeechRecognition();
    recognition.current.continuous = true;
    recognition.current.lang = "zh";
    //recognition.current.lang = "zh-HK", "zh-TW";
    recognition.current.interimResults = true;
    recognition.current.maxAlternatives = 1;
    recognition.current.onresult = function (event) {
      const item = event.results[0];

      console.info(
        "Result received: " + item[0].transcript + " ." + item[0].confidence,
      );
      contentChange && contentChange(item[0].transcript);
      if (item.isFinal) {
        recognition.current?.stop();
        onSubmit && onSubmit(item[0].transcript);
      }
    };
    recognition.current.onstart = function () {
      console.log("start");
      onStatusChange && onStatusChange(MicrophoneStatus.Listening);
    };
    recognition.current.onend = function () {
      setPlay(false);
      console.log("end");
      onStatusChange && onStatusChange(MicrophoneStatus.stopListening)
    };
    recognition.current.onspeechend = function () {
      recognition.current!.stop();
    };

    recognition.current.onerror = function (event) {
      console.error("Error occurred in recognition: " + event.error);
    };
    recognition.current.start();
    setPlay(true);
  };

  return (
    <button
      className="w-full p-1 flex flex-row justify-center bg-default-100 items-center gap-4 overflow-hidden color-inherit subpixel-antialiased rounded-md bg-background/10 backdrop-blur backdrop-saturate-150"
      onClick={startPlay}
    >
      <Microphone fontSize={28} color={play ? "#1f94ea" : "white"} />
      <Wave play={play} />
    </button>
  );
}

//新增廣東話跟英文選項0115
/*
import { useRef, useState } from "react";
import Wave from "./Wave";
import { Microphone, Globe } from "@phosphor-icons/react";

export enum MicrophoneStatus {
  Listening,
  stopListening
}

export enum Language {
  Cantonese = "zh-HK",
  Mandarin = "zh-CN",
  English = "en-US"
}

interface MicrophoneInputProps {
  talking: boolean;
  contentChange?: (content: string) => void;
  onSubmit?: (content: string) => void;
  onStopPlay?: () => void;
  onStatusChange?: (status: MicrophoneStatus) => void;
}

const SpeechRecognition =
  globalThis.SpeechRecognition || globalThis.webkitSpeechRecognition;

export default function MicrophoneInput({
  talking = false,
  contentChange,
  onSubmit,
  onStopPlay,
  onStatusChange
}: MicrophoneInputProps) {
  const firstflag = useRef(true);
  let recognition = useRef<SpeechRecognition>();
  const [play, setPlay] = useState<boolean>(false);
  const [currentLang, setCurrentLang] = useState<Language>(Language.Mandarin);

  const handlerStop = () => {
    setPlay(false);
    onStopPlay && onStopPlay();
  };

  const startPlay = () => {
    if (play) return;
    recognition.current = new SpeechRecognition();
    recognition.current.continuous = true;
    recognition.current.lang = currentLang;
    recognition.current.interimResults = true;
    recognition.current.maxAlternatives = 1;

    recognition.current.onresult = function (event) {
      const item = event.results[0];
      console.info(
        "Result received: " + item[0].transcript + " ." + item[0].confidence,
      );
      contentChange && contentChange(item[0].transcript);
      if (item.isFinal) {
        recognition.current?.stop();
        onSubmit && onSubmit(item[0].transcript);
      }
    };

    recognition.current.onstart = function () {
      console.log("start");
      onStatusChange && onStatusChange(MicrophoneStatus.Listening);
    };

    recognition.current.onend = function () {
      setPlay(false);
      console.log("end");
      onStatusChange && onStatusChange(MicrophoneStatus.stopListening)
    };

    recognition.current.onspeechend = function () {
      recognition.current!.stop();
    };

    recognition.current.onerror = function (event) {
      console.error("Error occurred in recognition: " + event.error);
    };

    recognition.current.start();
    setPlay(true);
  };

  const handleLanguageChange = (lang: Language) => {
    setCurrentLang(lang);
    if (play) {
      recognition.current?.stop();
      setPlay(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-end mb-2">
        <select
          value={currentLang}
          onChange={(e) => handleLanguageChange(e.target.value as Language)}
          className="px-2 py-1 rounded-md bg-default-100 text-sm"
        >
          <option value={Language.Mandarin}>普通話</option>
          <option value={Language.Cantonese}>廣東話</option>
          <option value={Language.English}>English</option>
        </select>
      </div>
      <button
        className="w-full p-1 flex flex-row justify-center bg-default-100 items-center gap-4 overflow-hidden color-inherit subpixel-antialiased rounded-md bg-background/10 backdrop-blur backdrop-saturate-150"
        onClick={startPlay}
      >
        <Microphone fontSize={28} color={play ? "#1f94ea" : "white"} />
        <Wave play={play} />
      </button>
    </div>
  );
}
*/
