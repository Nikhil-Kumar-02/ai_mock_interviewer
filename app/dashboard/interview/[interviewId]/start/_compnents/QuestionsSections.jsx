import React, { useState, useEffect } from "react";
import { Volume2, Lightbulb, Pause, MessageSquare } from "lucide-react";

// function QuestionsSections({activeQuestionIndex,mockInterViewQuestion}) {

//   const [isSpeaking, setIsSpeaking] = useState(false);

//   const textToSpeech = (text) => {
//     if ('speechSynthesis' in window) {
//       if (window.speechSynthesis.speaking) {
//         window.speechSynthesis.cancel();
//         setIsSpeaking(false);
//       } else {
//         const speech = new SpeechSynthesisUtterance(text);
//         speech.onstart = () => setIsSpeaking(true);
//         speech.onend = () => setIsSpeaking(false);
//         window.speechSynthesis.speak(speech);
//       }
//     } else {
//       alert('Sorry, your browser does not support text-to-speech (recommended: Chrome)');
//     }
//   };
  
//   console.log("the question are : " , mockInterViewQuestion);

//   return mockInterViewQuestion&&(
//     <div className='p-5 border rounded-lg my-10'>
//         <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 text-center'>
//             {mockInterViewQuestion&&mockInterViewQuestion?.map((question,index)=>(
//                  <h2 key={index+1} className={`p-2 bg-secondary rounded-full text-xs md:text-sm text-center cursor-pointer ${activeQuestionIndex==index&&'!bg-primary text-white'}`}>Question #{index+1}</h2>
//             ))}
//         </div>
//         <h2 className='my-5 text-sm md:text-lg'>
//           <strong>Q.</strong>  {mockInterViewQuestion[activeQuestionIndex]?.question}
//         </h2>
//         <Volume2
//           className={`cursor-pointer ${isSpeaking ? "text-green-500 animate-pulse" : ""}`}
//           onClick={() => textToSpeech(mockInterViewQuestion[activeQuestionIndex]?.question)}
//         />

//         <div className='border rounded-lg p-5 bg-blue-100 mt-20'>
//             <h2 className='flex gap-2 items-center text-blue-700'>
//                 <Lightbulb/>
//                 <strong>Note:</strong>
//             </h2>
//             <h2 className='my-2 text-sm text-blue-700'>
//                 {process.env.NEXT_PUBLIC_QUESTION_NOTE}
//             </h2>
//         </div>
//     </div>
//   )
// }


function QuestionsSections({ activeQuestionIndex, mockInterViewQuestion }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [questions, setQuestions] = useState([]);

  // Process incoming questions data to ensure we always work with an array
  useEffect(() => {
    if (!mockInterViewQuestion) {
      setQuestions([]);
      return;
    }

    // Handle both array and object formats
    if (Array.isArray(mockInterViewQuestion)) {
      setQuestions(mockInterViewQuestion);
    } else if (mockInterViewQuestion && typeof mockInterViewQuestion === 'object') {
      // Check if there's a questions property that contains an array
      if (Array.isArray(mockInterViewQuestion.questions)) {
        setQuestions(mockInterViewQuestion.questions);
      } else {
        // Try to find any array property in the object
        const arrayProps = Object.values(mockInterViewQuestion).find(val => Array.isArray(val));
        if (arrayProps) {
          setQuestions(arrayProps);
        } else {
          console.error("Could not find questions array in the provided data:", mockInterViewQuestion);
          setQuestions([]);
        }
      }
    } else {
      setQuestions([]);
    }
  }, [mockInterViewQuestion]);

  const textToSpeech = (text) => {
    if ('speechSynthesis' in window) {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const speech = new SpeechSynthesisUtterance(text);
        speech.onstart = () => setIsSpeaking(true);
        speech.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(speech);
      }
    } else {
      alert('Sorry, your browser does not support text-to-speech (recommended: Chrome)');
    }
  };

  // Show a message if no questions are available
  if (!questions.length) {
    return (
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-8 my-6 text-center">
        <MessageSquare className="mx-auto h-12 w-12 text-gray-300 mb-3" />
        <h3 className="text-lg font-medium text-gray-700">No Questions Available</h3>
        <p className="text-gray-500 mt-2">There are no interview questions to display at this time.</p>
      </div>
    );
  }

  // Get current question
  const currentQuestion = questions[activeQuestionIndex]?.question || "Question not available";

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden my-6">
      {/* Question navigation tabs */}
      <div className="bg-gray-50 p-4 border-b">
        <div className="flex overflow-x-auto pb-2 hide-scrollbar">
          <div className="flex space-x-2">
            {questions.map((question, index) => (
              <div
                key={index}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap cursor-pointer transition-all duration-200 ${
                  activeQuestionIndex === index
                    ? "bg-primary text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Q{index + 1}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Current question */}
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="bg-blue-50 p-3 rounded-full">
            <MessageSquare className="h-6 w-6 text-blue-600" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-medium text-lg text-gray-900 mb-2">Question {activeQuestionIndex + 1}</h3>
            <p className="text-gray-700 leading-relaxed">{currentQuestion}</p>
            
            <button
              onClick={() => textToSpeech(currentQuestion)}
              className={`mt-4 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isSpeaking
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {isSpeaking ? (
                <>
                  <Pause className="h-4 w-4" />
                  Stop Reading
                </>
              ) : (
                <>
                  <Volume2 className="h-4 w-4" />
                  Listen
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Note section */}
      <div className="border-t border-dashed border-gray-200 p-6 bg-blue-50">
        <div className="flex items-start gap-3">
          <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
            <Lightbulb className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-blue-800 text-sm">Note</h3>
            <p className="text-sm text-blue-700 mt-1">
              {process.env.NEXT_PUBLIC_QUESTION_NOTE || 
               "Take your time to understand the question. Structure your answer with a brief introduction, your main points, and a conclusion."}
            </p>
          </div>
        </div>
      </div>

      {/* Custom styles for hiding scrollbar but allowing scroll */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

export default QuestionsSections;