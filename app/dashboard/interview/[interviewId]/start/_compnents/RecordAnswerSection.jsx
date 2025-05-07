// "use client";
// import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import Webcam from "react-webcam";
// import { Button } from "@/components/ui/button";
// import useSpeechToText from "react-hook-speech-to-text";
// import { Mic, StopCircle } from "lucide-react";
// import { toast } from "sonner";
// import { chatSession } from "@/utils/GeminiAIModel";
// import { db } from "@/utils/db";
// import { UserAnswer } from "@/utils/schema";
// import { useUser } from "@clerk/nextjs";
// import moment from "moment";

// function RecordAnswerSection({ activeQuestionIndex, mockInterViewQuestion,interviewData }) {
//   const [userAnswer, setUserAnswer] = useState("");
//   const [loading,setLoading]=useState(false);

//   const [volume, setVolume] = useState(0); // Track the volume
//   const [feedback, setFeedback] = useState(""); // Track the feedback based on volume

//   const {user}=useUser()
//   const {
//     error,
//     interimResult,
//     isRecording,
//     results,
//     startSpeechToText,
//     stopSpeechToText,
//     setResults
//   } = useSpeechToText({
//     continuous: true,
//     useLegacyResults: false,
//   });
//   if (error) {
//     toast(error);
//     return;
//   }

//   useEffect(() => {
//     results.map((result) => {
//       setUserAnswer((prevAns) => prevAns + result?.transcript);
//     });
//   }, [results]);

//   const StartStopRecording = async () => {
//     if (isRecording) {
//       stopSpeechToText();        
//     } else {
//       startSpeechToText();
//     }
//   };

//   useEffect(()=>{
//     if(!isRecording&&userAnswer.length>10){
//       console.log("Triggering DB update:", userAnswer);
//       UpdateUserAnswerInDb();
//     }
//     if (userAnswer?.length < 10) {
//       setLoading(false)
//       toast("Error while saving your answer, Please record again");
//       return;
//     }

//   },[userAnswer])

//   const UpdateUserAnswerInDb=async()=>{
//     console.log("user answer which he spoke :--  ",userAnswer)
//     setLoading(true);
//     const feedbackPromt = `Question: ${mockInterViewQuestion[activeQuestionIndex]?.question}, User Answer: ${userAnswer}. Based on the question and the user's answer, please provide a rating 1 to 10 for the answer and feedback in the form of areas for improvement, if any. The feedback should be in JSON format only nothing else, field should be rating and feeback only, in just 3 to 5 lines.`;
//     const result = await chatSession.sendMessage(feedbackPromt);
//     const mockJsonResp = result.response
//       .text()
//       .replace("```json", "")
//       .replace("```", "");

//     const JsonFeedbackResp=JSON.parse(mockJsonResp);

//     const resp=await db.insert(UserAnswer).values({
//       mockIdRef: interviewData?.mockId,
//       question:mockInterViewQuestion[activeQuestionIndex]?.question,
//       correctAns:mockInterViewQuestion[activeQuestionIndex]?.answer,
//       userAns:userAnswer,
//       feedback:JsonFeedbackResp?.feedback,
//       rating:JsonFeedbackResp?.rating,
//       userEmail:user?.primaryEmailAddress?.emailAddress,
//       createdAt:moment().format('DD-MM-yyyy')


//     })
    
//     if(resp){
//       toast('User Answer recorded successfully!')
//       setUserAnswer('')
//       setResults([])
//     }
//     else{
//       toast('User Answer not recorded!')
//     }
//     setResults([])
//     setLoading(false)
//   }


//     // Volume detection logic using Web Audio API
//     useEffect(() => {
//       const audioContext = new (window.AudioContext || window.webkitAudioContext)();
//       const analyser = audioContext.createAnalyser();
//       analyser.fftSize = 256; // Set the FFT size
//       const dataArray = new Uint8Array(analyser.frequencyBinCount);
  
//       // **Access user's microphone**
//       navigator.mediaDevices
//         .getUserMedia({ audio: true })
//         .then((stream) => {
//           const microphone = audioContext.createMediaStreamSource(stream);
//           microphone.connect(analyser);
//           const bufferLength = analyser.frequencyBinCount;
  
//           // **Function to calculate RMS (Root Mean Square) to detect volume**
//           const analyzeVolume = () => {
//             analyser.getByteFrequencyData(dataArray);
//             let sum = 0;
//             for (let i = 0; i < bufferLength; i++) {
//               sum += dataArray[i] * dataArray[i]; // Square each value
//             }
//             const rms = Math.sqrt(sum / bufferLength); // RMS value
//             setVolume(rms); // **Update volume state**
//           };
  
//           // Start analyzing volume every 50ms
//           const intervalId = setInterval(analyzeVolume, 50);
  
//           // Cleanup
//           return () => {
//             clearInterval(intervalId);
//             stream.getTracks().forEach((track) => track.stop()); // Stop the stream
//           };
//         })
//         .catch((err) => {
//           console.error("Error accessing microphone:", err);
//         });
//     }, []);

//   // Provide feedback based on volume intensity
//   useEffect(() => {
//     if (volume > 200) {
//       setFeedback("Your voice is quite loud! Try to moderate your tone.");
//     } else if (volume > 100) {
//       setFeedback("You're speaking at a normal volume.");
//     } else {
//       setFeedback("Your voice is quite soft. Try speaking louder.");
//     }
//   }, [volume]);



//   return (
//     <div className="flex items-center justify-center flex-col">
//       <div className="flex flex-col mt-20 justify-center items-center bg-black rounded-lg p-1">
//         <Image
//           src={"/webcam.png"}
//           width={200}
//           height={300}
//           className="absolute"
//         />
//         <Webcam
//           mirrored={true}
//           style={{
//             height: "60vh",
//             width: "100%",
//             zIndex: 10,
//           }}
//         />
//       </div>
//       {/* Display volume feedback */}
//       <div className="my-4 text-center text-lg">{feedback}</div>

//       {/* Start/Stop recording button */}
//       <Button  disabled={loading} variant="outline" onClick={StartStopRecording} className="my-10">
//         {isRecording ? (
//           <h2 className="flex items-center justify-center text-red-600 gap-2">
//             <StopCircle />
//             Recording...
//           </h2>
//         ) : (
//           <h2 className="flex items-center justify-center gap-2">
//             <Mic />
//             Start Recording
//           </h2>
//         )}
//       </Button>
//     </div>
//   );
// }

// export default RecordAnswerSection;









"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import useSpeechToText from "react-hook-speech-to-text";
import { Mic, StopCircle } from "lucide-react";
import { toast } from "sonner";
import { chatSession } from "@/utils/GeminiAIModel";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";

function RecordAnswerSection({ activeQuestionIndex, mockInterViewQuestion, interviewData }) {
  const [userAnswer, setUserAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [volume, setVolume] = useState(0);
  const [feedback, setFeedback] = useState("");
  
  // Audio context refs
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const microphoneRef = useRef(null);
  const streamRef = useRef(null);
  const intervalIdRef = useRef(null);

  const { user } = useUser();
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  if (error) {
    toast(error);
    return;
  }

  useEffect(() => {
    results.map((result) => {
      setUserAnswer((prevAns) => prevAns + result?.transcript);
    });
  }, [results]);

  // Initialize audio context and analyzer when component mounts
  useEffect(() => {
    // Create audio context
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    analyserRef.current = audioContextRef.current.createAnalyser();
    analyserRef.current.fftSize = 256;

    return () => {
      // Cleanup on component unmount
      stopVolumeTracking();
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Start volume tracking with voice activity detection
  const startVolumeTracking = async () => {
    try {
      if (!audioContextRef.current) return;
      
      // Only request microphone access if we don't already have it
      if (!streamRef.current) {
        streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
        microphoneRef.current = audioContextRef.current.createMediaStreamSource(streamRef.current);
        microphoneRef.current.connect(analyserRef.current);
      }
      
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      // Function to analyze volume with improved voice activity detection
      const analyzeVolume = () => {
        // Get frequency data for voice detection
        analyserRef.current.getByteFrequencyData(dataArray);
        
        // Calculating RMS (Root Mean Square)
        let sum = 0;
        
        // Focus on the frequency range most common for human voice (roughly 85Hz-255Hz)
        // This helps to filter out background noise
        const voiceRangeStart = Math.floor(bufferLength * 0.1); // ~85Hz
        const voiceRangeEnd = Math.floor(bufferLength * 0.3);   // ~255Hz
        
        for (let i = voiceRangeStart; i < voiceRangeEnd; i++) {
          sum += dataArray[i] * dataArray[i];
        }
        
        const rangeLength = voiceRangeEnd - voiceRangeStart;
        const rms = Math.sqrt(sum / rangeLength);
        
        // Add smoothing to avoid flickering
        setVolume(prevVolume => {
          // Smooth transition (80% previous, 20% new)
          const smoothedVolume = prevVolume * 0.8 + rms * 0.2;
          return smoothedVolume;
        });
      };
      
      // Start analyzing every 30ms for more responsive updates
      intervalIdRef.current = setInterval(analyzeVolume, 30);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      toast("Could not access microphone for volume tracking");
    }
  };

  // Stop volume tracking
  const stopVolumeTracking = () => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
    
    // Reset volume
    setVolume(0);
  };

  const StartStopRecording = async () => {
    if (isRecording) {
      stopSpeechToText();
      stopVolumeTracking();
    } else {
      startSpeechToText();
      startVolumeTracking();
    }
  };

  useEffect(() => {
    if (!isRecording && userAnswer.length > 10) {
      console.log("Triggering DB update:", userAnswer);
      UpdateUserAnswerInDb();
    }
    if (userAnswer?.length < 10 && !isRecording && results.length > 0) {
      setLoading(false);
      toast("Error while saving your answer, Please record again");
      return;
    }
  }, [isRecording, userAnswer, results]);

  const UpdateUserAnswerInDb = async () => {
    console.log("user answer which he spoke :--  ", userAnswer);
    setLoading(true);
    const feedbackPromt = `Question: ${mockInterViewQuestion[activeQuestionIndex]?.question}, User Answer: ${userAnswer}. Based on the question and the user's answer, please provide a rating 1 to 10 for the answer and feedback in the form of areas for improvement, if any. The feedback should be in JSON format only nothing else, field should be rating and feeback only, in just 3 to 5 lines.`;
    const result = await chatSession.sendMessage(feedbackPromt);
    const mockJsonResp = result.response
      .text()
      .replace("```json", "")
      .replace("```", "");

    const JsonFeedbackResp = JSON.parse(mockJsonResp);

    const resp = await db.insert(UserAnswer).values({
      mockIdRef: interviewData?.mockId,
      question: mockInterViewQuestion[activeQuestionIndex]?.question,
      correctAns: mockInterViewQuestion[activeQuestionIndex]?.answer,
      userAns: userAnswer,
      feedback: JsonFeedbackResp?.feedback,
      rating: JsonFeedbackResp?.rating,
      userEmail: user?.primaryEmailAddress?.emailAddress,
      createdAt: moment().format('DD-MM-yyyy')
    });
    
    if (resp) {
      toast('User Answer recorded successfully!');
      setUserAnswer('');
      setResults([]);
    } else {
      toast('User Answer not recorded!');
    }
    setResults([]);
    setLoading(false);
  };

  // Provide feedback and determine border based on volume
  useEffect(() => {
    if (isRecording) {
      if (volume > 150) {
        setFeedback("Voice too loud! Please speak softer.");
      } else if (volume > 80) {
        setFeedback("Perfect volume! Keep it up.");
      } else if (volume > 40) {
        setFeedback("Good volume, you can speak a bit louder.");
      } else if (volume > 10) {
        setFeedback("Please speak louder, your voice is soft.");
      } else {
        setFeedback("Waiting for you to speak...");
      }
    } else {
      setFeedback("");
    }
  }, [volume, isRecording]);

  // Calculate border color and pulse based on volume
  const getBorderStyle = () => {
    // Default state - neutral border
    if (!isRecording || volume <= 10) {
      return {
        boxShadow: 'none',
        border: '3px solid #444',
        borderRadius: '12px',
        transition: 'all 0.3s ease'
      };
    }
    
    // Map volume to color intensity
    let color, pulseSpeed, borderWidth, glowIntensity;
    
    if (volume > 150) {
      // Very loud - vibrant red with intense pulsing
      color = 'rgb(255, 40, 40)';
      pulseSpeed = '0.4s';
      borderWidth = '7px';
      glowIntensity = Math.min(volume * 0.5, 30);
    } else if (volume > 80) {
      // Good volume - emerald green with medium pulsing
      color = 'rgb(20, 230, 100)';
      pulseSpeed = '0.8s';
      borderWidth = '5px';
      glowIntensity = Math.min(volume * 0.4, 25);
    } else if (volume > 40) {
      // Moderate - cyan blue with gentle pulsing
      color = 'rgb(0, 200, 255)';
      pulseSpeed = '1.2s';
      borderWidth = '4px';
      glowIntensity = Math.min(volume * 0.3, 20);
    } else {
      // Quiet but audible - amber with slow pulsing
      color = 'rgb(255, 191, 0)';
      pulseSpeed = '1.5s';
      borderWidth = '3px';
      glowIntensity = Math.min(volume * 0.25, 15);
    }
    
    return {
      boxShadow: `0 0 ${glowIntensity}px ${color}`,
      border: `${borderWidth} solid ${color}`,
      animation: `pulse ${pulseSpeed} infinite alternate`,
      borderRadius: '12px',
      transition: 'box-shadow 0.15s ease, border 0.15s ease'
    };
  };

  return (
    <div className="flex items-center justify-center flex-col">
      <style jsx global>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 8px currentColor; opacity: 0.7; }
          100% { box-shadow: 0 0 25px currentColor; opacity: 1; }
        }
      `}</style>
      
      <div 
        className="flex flex-col mt-20 justify-center items-center bg-black rounded-lg p-1"
        style={getBorderStyle()}
      >
        <Image
          src={"/webcam.png"}
          width={200}
          height={300}
          className="absolute"
        />
        <Webcam
          mirrored={true}
          style={{
            height: "60vh",
            width: "100%",
            zIndex: 10,
            borderRadius: "8px"
          }}
        />
      </div>

      {/* Display volume feedback */}
      <div className={`my-4 text-center text-lg font-medium ${isRecording ? (
        volume > 150 ? "text-red-500" :
        volume > 80 ? "text-green-500" :
        volume > 40 ? "text-blue-500" :
        volume > 10 ? "text-amber-500" : "text-gray-400"
      ) : ""}`}>
        {feedback}
      </div>

      {/* Start/Stop recording button */}
      <Button disabled={loading} variant="outline" onClick={StartStopRecording} className="my-6">
        {isRecording ? (
          <h2 className="flex items-center justify-center text-red-600 gap-2">
            <StopCircle />
            Recording...
          </h2>
        ) : (
          <h2 className="flex items-center justify-center gap-2">
            <Mic />
            Start Recording
          </h2>
        )}
      </Button>
    </div>
  );
}

export default RecordAnswerSection;