// "use client"
// import React from 'react'
// import InterviewItemCard from './InterviewItemCard';

// function Interviewlist({interviewList}) {
//   return (
//     <div>
//         <h2 className='font-medium text-xl'>Previous Mock Interview</h2>
//         <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3'>
//             {
//                 interviewList&&interviewList.map((interview,index)=>(
//                     <InterviewItemCard key={index} interviewInfo={interview} />                ))
//             }
//         </div>
//     </div>
//   )
// }

// export default Interviewlist


"use client"
import React from 'react'
import InterviewItemCard from './InterviewItemCard';

// The Interview List Component
function Interviewlist({ interviewList }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Your Interview History</h2>
      </div>
      
      {interviewList && interviewList.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:gap-6">
          {interviewList.map((interview, index) => (
            <InterviewItemCard key={interview.mockId || index} interviewInfo={interview} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No interviews yet</h3>
          <p className="text-sm text-gray-500 mb-4">Start your first mock interview to see it here</p>
        </div>
      )}
    </div>
  )
}

export default Interviewlist;