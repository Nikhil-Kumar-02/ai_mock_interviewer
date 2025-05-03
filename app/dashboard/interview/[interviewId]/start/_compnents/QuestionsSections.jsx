import { Lightbulb, Volume2 } from 'lucide-react'

function QuestionsSections({activeQuestionIndex,mockInterViewQuestion}) {

  const textToSpeech = (text) => {
    const synth = window.speechSynthesis;
  
    if (!('speechSynthesis' in window)) {
      alert('Sorry, your browser does not support text-to-speech (try Chrome).');
      return;
    }
  
    // If already speaking, stop it
    if (synth.speaking || synth.pending) {
      console.log("Stopping speech");
      synth.cancel(); // stops any ongoing speech
      return;
    }
  
    // Prepare to speak
    const utterance = new SpeechSynthesisUtterance(text);
  
    // Optional: select a specific voice
    const voices = synth.getVoices();
    if (voices.length > 0) {
      utterance.voice = voices[0]; // Or any specific voice
    }
  
    console.log("Speaking:", text);
    synth.speak(utterance);
  };
  



  return mockInterViewQuestion&&(
    <div className='p-5 border rounded-lg my-10'>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 text-center'>
            {mockInterViewQuestion&&mockInterViewQuestion?.map((question,index)=>(
                 <h2 key={index+1} className={`p-2 bg-secondary rounded-full text-xs md:text-sm text-center cursor-pointer ${activeQuestionIndex==index&&'!bg-primary text-white'}`}>Question #{index+1}</h2>
            ))}
        </div>
        <h2 className='my-5 text-sm md:text-lg'>
          <strong>Q.</strong>  {mockInterViewQuestion[activeQuestionIndex]?.question}
        </h2>
        {/* {
          isSpeaking ? (
            <VolumeX className="cursor-pointer text-gray-700" onClick={()  => textToSpeech(mockInterViewQuestion[activeQuestionIndex]?.question)}/>
          ) : (
            <Volume2 className="cursor-pointer text-gray-700" onClick={() => textToSpeech(mockInterViewQuestion[activeQuestionIndex]?.question)} />
          )
        } */}
        <Volume2 className='cursor-pointer' onClick={()=>textToSpeech(mockInterViewQuestion[activeQuestionIndex]?.question)} />
        <div className='border rounded-lg p-5 bg-blue-100 mt-20'>
            <h2 className='flex gap-2 items-center text-blue-700'>
                <Lightbulb/>
                <strong>Note:</strong>
            </h2>
            <h2 className='my-2 text-sm text-blue-700'>
                {process.env.NEXT_PUBLIC_QUESTION_NOTE}
            </h2>
        </div>
    </div>
  )
}

export default QuestionsSections