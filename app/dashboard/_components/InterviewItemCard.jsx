import { Button } from '@/components/ui/button'

import { useRouter } from 'next/navigation'
import React from 'react'

// function InterviewItemCard({interviewInfo}) {
//    const router=useRouter()
//     const onStart=()=>{
//         console.log("first")
//        router.push(`/dashboard/interview/${interviewInfo?.mockId}`)
//     }
//     const onFeedback=()=>{
//         router.push(`/dashboard/interview/${interviewInfo.mockId}/feedback`)
//     }
//   return (
//     <div className='border shadow-sm rounded-lg p-3'>
//         <h2 className='font-bold text-primary'>{interviewInfo?.jobPosition}</h2>
//         <h2 className='text-sm text-gray-600'>{interviewInfo?.jobExperience} Years of Experience</h2>
//         <h2 className='text-xs text-gray-500'>Created At: {interviewInfo.createdAt}</h2>
//         <div className='flex justify-between mt-2 gap-5'>
           
//             <Button size="sm" variant="outline"  className="w-full" onClick={onFeedback}>Feedback</Button>
        
//             <Button size="sm" className="w-full" onClick={onStart}>Start</Button>
//         </div>
//     </div>
//   )
// }

// export default InterviewItemCard




function InterviewItemCard({ interviewInfo }) {
  const router = useRouter();
  
  const onStart = () => {
    console.log("first");
    router.push(`/dashboard/interview/${interviewInfo?.mockId}`);
  };
  
  const onFeedback = () => {
    router.push(`/dashboard/interview/${interviewInfo.mockId}/feedback`);
  };

  // Format date for better display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="relative bg-white rounded-xl shadow-sm border border-gray-200 transition-all hover:shadow-md overflow-hidden">
      {/* Status indicator */}
      <div className="absolute top-0 right-0 m-4">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Completed
        </span>
      </div>  
      
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="space-y-3 flex-1">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {interviewInfo?.jobPosition || 'Position Not Specified'}
              </h3>
            </div>
            
            <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <svg className="mr-1.5 h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {interviewInfo?.jobExperience} {interviewInfo?.jobExperience === 1 ? 'Year' : 'Years'} of Experience
              </div>
              
              <div className="flex items-center">
                <svg className="mr-1.5 h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                Created: {formatDate(interviewInfo?.createdAt)}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <button
              onClick={onFeedback}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <svg className="mr-2 -ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Feedback
            </button>
            
            <button
              onClick={onStart}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <svg className="mr-2 -ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Start
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InterviewItemCard;