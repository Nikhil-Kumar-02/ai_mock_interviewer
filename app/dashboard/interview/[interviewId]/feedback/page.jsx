// "use client";
// import { db } from "@/utils/db";
// import { UserAnswer } from "@/utils/schema";
// import { eq } from "drizzle-orm";
// import React, { useEffect, useState } from "react";
// import {
//     Collapsible,
//     CollapsibleContent,
//     CollapsibleTrigger,
//   } from "@/components/ui/collapsible"
// import { ChevronsUpDownIcon } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";
  

// function Feedback({ params }) {
//   const [feedbackList, setFeedbackList] = useState([]);
//   const [avgRating,setAvgRating]=useState()
//   const router=useRouter()
//   useEffect(() => {
//     GetFeedBack();
//   }, []);
//   const GetFeedBack = async () => {
//     const result = await db
//       .select()
//       .from(UserAnswer)
//       .where(eq(UserAnswer.mockIdRef, params.interviewId))
//       .orderBy(UserAnswer.id);

//     setFeedbackList(result);
//     console.log("the feedbacks are :  " , result);
//     let getTotalOfRating=result.reduce((sum,item)=>sum+Number(item.rating),0)
//     setAvgRating(Math.round(getTotalOfRating/result?.length))
//     // setAvgRating(result.reduce((sum, item) => sum + Number(item.rating), 0) / result.length)
//     // console.log(avgRating)
//   };
//   return (
//     <div className="p-10">
     
//       {
//         feedbackList?.length==0? <h2 className="font-bold text-xl text-gray-500">No Interview Feedback Record Found</h2> :
//         <>
//          <h2 className="text-3xl font-bold text-green-500">Congratulation!</h2>
//          <h2 className="font-bold text-2xl">Here is your interview feedback</h2>
//         <h2 className="text-primary text-lg my-3">
//         Your overall interview rating <strong  className={avgRating<6?'text-red-600':'text-green-500'} >{avgRating}/10</strong>
//       </h2>

//       <h2 className="text-sm text-gray-200">
//         Find below your interview questions with correct answer, Your answer and
//         feedback for improvement{" "}
        
//         </h2>
//       {feedbackList&&feedbackList.map((item,index)=>(
//         <Collapsible key={index} className="mt-7">
//         <CollapsibleTrigger className="p-2 bg-secondary rounded-lg my-2 text-left flex items-center justify-between gap-7 w-full">{item.question} <ChevronsUpDownIcon className="h-5 w-5"/></CollapsibleTrigger>
//         <CollapsibleContent>
//           <div className="flex flex-col g-2">
//             <h2 className="text-red-600 p-2 rounded-lg"><strong>Rating:</strong> {item.rating}</h2>
//             <h2 className="p-2 border rounded-lg bg-red-50 text-sm text-red-900 "><strong>Your Answer: </strong> {item.userAns} </h2>
//             <h2 className="p-2 border rounded-lg bg-green-50 text-sm text-green-900 mt-2"><strong>Correct Answer: </strong> {item.correctAns} </h2>
//             <h2 className="p-2 border rounded-lg bg-blue-50 text-sm text-primary mt-2"><strong>Feedback: </strong> {item.feedback} </h2>
//           </div>
//         </CollapsibleContent>
//       </Collapsible>
      

//       ))}
//         </>
//       }
      
//       <Button onClick={()=>router.replace('/dashboard')}>Go Home</Button>
//     </div>
//   );
// }

// export default Feedback;






// "use client";
// import { db } from "@/utils/db";
// import { UserAnswer } from "@/utils/schema";
// import { eq } from "drizzle-orm";
// import React, { useEffect, useState } from "react";
// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "@/components/ui/collapsible";
// import { Award, BookOpen, Calendar, ChevronsUpDownIcon, ClipboardCheck, LineChart, Sparkles, Timer } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";
// import moment from "moment";

// function Feedback({ params }) {
//   const [feedbackList, setFeedbackList] = useState([]);
//   const [interviewSessions, setInterviewSessions] = useState({});
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [avgRatingByDate, setAvgRatingByDate] = useState({});
//   const [isLoading, setIsLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     GetFeedBack();
//   }, []);

//   const GetFeedBack = async () => {
//     setIsLoading(true);
//     try {
//       const result = await db
//         .select()
//         .from(UserAnswer)
//         .where(eq(UserAnswer.mockIdRef, params.interviewId))
//         .orderBy(UserAnswer.id);

//       setFeedbackList(result);
      
//       // Group interviews by date
//       const sessionsByDate = {};
//       const ratingsByDate = {};

//       result.forEach(item => {
//         if (!sessionsByDate[item.createdAt]) {
//           sessionsByDate[item.createdAt] = [];
//           ratingsByDate[item.createdAt] = {
//             total: 0,
//             count: 0
//           };
//         }
        
//         sessionsByDate[item.createdAt].push(item);
//         ratingsByDate[item.createdAt].total += Number(item.rating);
//         ratingsByDate[item.createdAt].count += 1;
//       });

//       // Calculate average rating for each date
//       const avgRatings = {};
//       Object.keys(ratingsByDate).forEach(date => {
//         avgRatings[date] = Math.round(ratingsByDate[date].total / ratingsByDate[date].count);
//       });

//       setInterviewSessions(sessionsByDate);
//       setAvgRatingByDate(avgRatings);
      
//       // Set the most recent date as selected by default if there are sessions
//       const dates = Object.keys(sessionsByDate);
//       if (dates.length > 0) {
//         // Sort dates in descending order (most recent first)
//         const sortedDates = dates.sort((a, b) => {
//           return moment(b, "DD-MM-YYYY").valueOf() - moment(a, "DD-MM-YYYY").valueOf();
//         });
//         setSelectedDate(sortedDates[0]);
//       }
//     } catch (error) {
//       console.error("Error fetching feedback:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Get improvement trend between sessions
//   const getImprovementTrend = () => {
//     const dates = Object.keys(avgRatingByDate).sort((a, b) => {
//       return moment(a, "DD-MM-YYYY").valueOf() - moment(b, "DD-MM-YYYY").valueOf();
//     });
    
//     if (dates.length <= 1) return null;
    
//     const firstRating = avgRatingByDate[dates[0]];
//     const lastRating = avgRatingByDate[dates[dates.length - 1]];
//     const improvement = lastRating - firstRating;
    
//     return {
//       improvement,
//       percentage: Math.round((improvement / 10) * 100)
//     };
//   };

//   const improvementData = getImprovementTrend();

//   // Function to get appropriate color based on rating
//   const getRatingColor = (rating) => {
//     if (rating >= 8) return "text-green-500";
//     if (rating >= 6) return "text-blue-500";
//     if (rating >= 4) return "text-amber-500";
//     return "text-red-600";
//   };

//   // Function to get appropriate background color based on rating
//   const getRatingBgColor = (rating) => {
//     if (rating >= 8) return "bg-green-100 border-green-300";
//     if (rating >= 6) return "bg-blue-100 border-blue-300";
//     if (rating >= 4) return "bg-amber-100 border-amber-300";
//     return "bg-red-100 border-red-300";
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-10 max-w-6xl mx-auto">
//       {Object.keys(interviewSessions).length === 0 ? (
//         <div className="text-center py-16">
//           <h2 className="font-bold text-xl text-gray-500">No Interview Feedback Records Found</h2>
//           <Button onClick={() => router.replace('/dashboard')} className="mt-6">
//             Return to Dashboard
//           </Button>
//         </div>
//       ) : (
//         <>
//           <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-xl shadow-lg mb-8 text-white">
//             <h2 className="text-3xl font-bold flex items-center">
//               <Award className="mr-2" /> Interview Performance Tracker
//             </h2>
//             <p className="mt-2 opacity-90">
//               Track your progress across multiple interview attempts
//             </p>
            
//             {improvementData && improvementData.improvement !== 0 && (
//               <div className="mt-4 bg-white/20 p-3 rounded-lg inline-block">
//                 <div className="flex items-center">
//                   <LineChart className="mr-2" />
//                   <span>
//                     Overall improvement: 
//                     <span className={`font-bold ml-1 ${improvementData.improvement > 0 ? "text-green-300" : "text-red-300"}`}>
//                       {improvementData.improvement > 0 ? "+" : ""}{improvementData.improvement} points 
//                       ({improvementData.improvement > 0 ? "+" : ""}{improvementData.percentage}%)
//                     </span>
//                   </span>
//                 </div>
//               </div>
//             )}
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//             {/* Session selection sidebar */}
//             <div className="bg-gray-100 p-4 rounded-xl shadow">
//               <h3 className="font-semibold text-lg mb-4 flex items-center">
//                 <Calendar className="mr-2 text-indigo-600" /> Interview Sessions
//               </h3>
//               <div className="space-y-2">
//                 {Object.keys(interviewSessions)
//                   .sort((a, b) => moment(b, "DD-MM-YYYY").valueOf() - moment(a, "DD-MM-YYYY").valueOf())
//                   .map((date) => (
//                     <div
//                       key={date}
//                       className={`p-3 rounded-lg cursor-pointer transition-all flex justify-between items-center ${
//                         selectedDate === date
//                           ? "bg-indigo-100 border-l-4 border-indigo-600"
//                           : "hover:bg-gray-200"
//                       }`}
//                       onClick={() => setSelectedDate(date)}
//                     >
//                       <div className="flex items-center">
//                         <Timer className="h-4 w-4 mr-2 text-indigo-600" />
//                         <span>{moment(date, "DD-MM-YYYY").format("MMM D, YYYY")}</span>
//                       </div>
//                       <div 
//                         className={`px-2 py-1 rounded-full font-medium text-xs ${getRatingBgColor(avgRatingByDate[date])}`}
//                       >
//                         {avgRatingByDate[date]}/10
//                       </div>
//                     </div>
//                   ))}
//               </div>
//             </div>
            
//             {/* Interview session details */}
//             <div className="md:col-span-3">
//               {selectedDate && (
//                 <>
//                   <div className="bg-white rounded-xl shadow p-6 mb-6 border-t-4 border-indigo-600">
//                     <div className="flex justify-between items-center mb-4">
//                       <h3 className="text-xl font-bold flex items-center">
//                         <ClipboardCheck className="mr-2 text-indigo-600" />
//                         Session: {moment(selectedDate, "DD-MM-YYYY").format("MMMM D, YYYY")}
//                       </h3>
//                       <div 
//                         className={`text-2xl font-bold ${getRatingColor(avgRatingByDate[selectedDate])}`}
//                       >
//                         {avgRatingByDate[selectedDate]}/10
//                       </div>
//                     </div>
                    
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//                       <div className="bg-blue-50 p-3 rounded-lg flex items-center">
//                         <BookOpen className="mr-2 text-blue-600" />
//                         <div>
//                           <div className="text-sm text-blue-700">Questions</div>
//                           <div className="font-bold">{interviewSessions[selectedDate].length}</div>
//                         </div>
//                       </div>
                      
//                       <div className="bg-purple-50 p-3 rounded-lg flex items-center">
//                         <Sparkles className="mr-2 text-purple-600" />
//                         <div>
//                           <div className="text-sm text-purple-700">Best Answer</div>
//                           <div className="font-bold">
//                             {Math.max(...interviewSessions[selectedDate].map(item => Number(item.rating)))}/10
//                           </div>
//                         </div>
//                       </div>
                      
//                       <div className="bg-amber-50 p-3 rounded-lg flex items-center">
//                         <Award className="mr-2 text-amber-600" />
//                         <div>
//                           <div className="text-sm text-amber-700">Performance</div>
//                           <div className="font-bold">
//                             {avgRatingByDate[selectedDate] >= 8 ? "Excellent" : 
//                              avgRatingByDate[selectedDate] >= 6 ? "Good" : 
//                              avgRatingByDate[selectedDate] >= 4 ? "Fair" : "Needs Work"}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="space-y-4">
//                     {interviewSessions[selectedDate].map((item, index) => (
//                       <Collapsible key={index} className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
//                         <CollapsibleTrigger className="p-4 text-left flex items-center justify-between w-full hover:bg-gray-50">
//                           <div className="pr-4">
//                             <span className="text-gray-500 text-sm">Question {index + 1}</span>
//                             <p className="font-medium">{item.question}</p>
//                           </div>
//                           <div className="flex items-center">
//                             <div className={`px-3 py-1 rounded-full mr-3 ${getRatingBgColor(Number(item.rating))}`}>
//                               <span className={`font-semibold ${getRatingColor(Number(item.rating))}`}>
//                                 {item.rating}/10
//                               </span>
//                             </div>
//                             <ChevronsUpDownIcon className="h-5 w-5 flex-shrink-0 text-gray-500" />
//                           </div>
//                         </CollapsibleTrigger>
//                         <CollapsibleContent>
//                           <div className="p-4 border-t border-gray-200 space-y-3">
//                             <div className="p-3 rounded-lg bg-red-50 border border-red-200">
//                               <h4 className="font-semibold text-red-800 mb-1">Your Answer:</h4>
//                               <p className="text-red-700">{item.userAns}</p>
//                             </div>
                            
//                             <div className="p-3 rounded-lg bg-green-50 border border-green-200">
//                               <h4 className="font-semibold text-green-800 mb-1">Model Answer:</h4>
//                               <p className="text-green-700">{item.correctAns}</p>
//                             </div>
                            
//                             <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
//                               <h4 className="font-semibold text-blue-800 mb-1">Feedback:</h4>
//                               <p className="text-blue-700">{item.feedback}</p>
//                             </div>
//                           </div>
//                         </CollapsibleContent>
//                       </Collapsible>
//                     ))}
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
          
//           <div className="flex justify-center mt-8">
//             <Button 
//               onClick={() => router.replace('/dashboard')} 
//               className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
//             >
//               Return to Dashboard
//             </Button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// export default Feedback;













"use client";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Award, BookOpen, Calendar, ChevronsUpDownIcon, ClipboardCheck, LineChart, Sparkles, Timer, TrendingUp, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import moment from "moment";

function Feedback({ params }) {
  const [feedbackList, setFeedbackList] = useState([]);
  const [interviewSessions, setInterviewSessions] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [avgRatingByDate, setAvgRatingByDate] = useState({});
  const [progressData, setProgressData] = useState([]);
  const [weakestTopics, setWeakestTopics] = useState([]);
  const [strongestTopics, setStrongestTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDashboard, setShowDashboard] = useState(false);
  const router = useRouter();

  useEffect(() => {
    GetFeedBack();
  }, []);

  const GetFeedBack = async () => {
    setIsLoading(true);
    try {
      const result = await db
        .select()
        .from(UserAnswer)
        .where(eq(UserAnswer.mockIdRef, params.interviewId))
        .orderBy(UserAnswer.id);

      setFeedbackList(result);
      
      // Group interviews by date
      const sessionsByDate = {};
      const ratingsByDate = {};
      const topicPerformance = {};

      result.forEach(item => {
        // Extract the date part
        const date = item.createdAt.split(' ')[0];
        
        if (!sessionsByDate[date]) {
          sessionsByDate[date] = [];
          ratingsByDate[date] = {
            total: 0,
            count: 0
          };
        }
        
        sessionsByDate[date].push(item);
        ratingsByDate[date].total += Number(item.rating);
        ratingsByDate[date].count += 1;

        // Extract topic keywords from question for analysis
        const questionWords = item.question.toLowerCase().split(' ');
        const commonTopics = ['react', 'javascript', 'html', 'css', 'algorithm', 'data structure', 
                           'system design', 'database', 'sql', 'backend', 'frontend', 'api', 
                           'framework', 'nodejs', 'security', 'performance', 'testing'];
        
        const detectedTopics = commonTopics.filter(topic => 
          item.question.toLowerCase().includes(topic)
        );

        if (detectedTopics.length === 0) {
          detectedTopics.push('general');
        }

        detectedTopics.forEach(topic => {
          if (!topicPerformance[topic]) {
            topicPerformance[topic] = {
              total: 0,
              count: 0
            };
          }
          topicPerformance[topic].total += Number(item.rating);
          topicPerformance[topic].count += 1;
        });
      });

      // Calculate average rating for each date
      const avgRatings = {};
      Object.keys(ratingsByDate).forEach(date => {
        avgRatings[date] = Math.round(ratingsByDate[date].total / ratingsByDate[date].count);
      });

      setInterviewSessions(sessionsByDate);
      setAvgRatingByDate(avgRatings);

      // Prepare progress data for chart
      const progressDataPoints = Object.keys(avgRatings)
        .sort((a, b) => moment(a, "DD-MM-YYYY").valueOf() - moment(b, "DD-MM-YYYY").valueOf())
        .map(date => ({
          date: moment(date, "DD-MM-YYYY").format("MMM D"),
          rating: avgRatings[date],
          questions: sessionsByDate[date].length
        }));
      
      setProgressData(progressDataPoints);

      // Calculate topic strengths and weaknesses
      const topicAverages = {};
      Object.keys(topicPerformance).forEach(topic => {
        topicAverages[topic] = Math.round(topicPerformance[topic].total / topicPerformance[topic].count);
      });

      // Get top 3 strongest and weakest topics
      const sortedTopics = Object.entries(topicAverages)
        .filter(([topic, avg]) => topicPerformance[topic].count >= 2) // Only include topics with at least 2 questions
        .sort((a, b) => b[1] - a[1]); // Sort by average rating descending
      
      setStrongestTopics(sortedTopics.slice(0, 3));
      setWeakestTopics(sortedTopics.slice(-3).reverse());
      
      // Set the most recent date as selected by default if there are sessions
      const dates = Object.keys(sessionsByDate);
      if (dates.length > 0) {
        // Sort dates in descending order (most recent first)
        const sortedDates = dates.sort((a, b) => {
          return moment(b, "DD-MM-YYYY").valueOf() - moment(a, "DD-MM-YYYY").valueOf();
        });
        setSelectedDate(sortedDates[0]);
      }
    } catch (error) {
      console.error("Error fetching feedback:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get improvement trend between sessions
  const getImprovementTrend = () => {
    const dates = Object.keys(avgRatingByDate).sort((a, b) => {
      return moment(a, "DD-MM-YYYY").valueOf() - moment(b, "DD-MM-YYYY").valueOf();
    });
    
    if (dates.length <= 1) return null;
    
    const firstRating = avgRatingByDate[dates[0]];
    const lastRating = avgRatingByDate[dates[dates.length - 1]];
    const improvement = lastRating - firstRating;
    
    return {
      improvement,
      percentage: Math.round((improvement / 10) * 100)
    };
  };

  const improvementData = getImprovementTrend();

  // Function to get appropriate color based on rating
  const getRatingColor = (rating) => {
    if (rating >= 8) return "text-green-500";
    if (rating >= 6) return "text-blue-500";
    if (rating >= 4) return "text-amber-500";
    return "text-red-600";
  };

  // Function to get appropriate background color based on rating
  const getRatingBgColor = (rating) => {
    if (rating >= 8) return "bg-green-100 border-green-300";
    if (rating >= 6) return "bg-blue-100 border-blue-300";
    if (rating >= 4) return "bg-amber-100 border-amber-300";
    return "bg-red-100 border-red-300";
  };

  // Calculate the progress trend (up, down, or flat)
  const calculateTrend = () => {
    if (progressData.length < 2) return "flat";
    
    const firstRating = progressData[0].rating;
    const lastRating = progressData[progressData.length - 1].rating;
    
    if (lastRating > firstRating) return "up";
    if (lastRating < firstRating) return "down";
    return "flat";
  };

  // Get appropriate color for trend
  const getTrendColor = () => {
    const trend = calculateTrend();
    if (trend === "up") return "text-green-500";
    if (trend === "down") return "text-red-600";
    return "text-blue-500";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 max-w-6xl mx-auto">
      {Object.keys(interviewSessions).length === 0 ? (
        <div className="text-center py-16">
          <h2 className="font-bold text-xl text-gray-500">No Interview Feedback Records Found</h2>
          <Button onClick={() => router.replace('/dashboard')} className="mt-6">
            Return to Dashboard
          </Button>
        </div>
      ) : (
        <>
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-xl shadow-lg mb-8 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold flex items-center">
                  <Award className="mr-2" /> Interview Performance Tracker
                </h2>
                <p className="mt-2 opacity-90">
                  Track your progress across multiple interview attempts
                </p>
                
                {improvementData && improvementData.improvement !== 0 && (
                  <div className="mt-4 bg-white/20 p-3 rounded-lg inline-block">
                    <div className="flex items-center">
                      <LineChart className="mr-2" />
                      <span>
                        Overall improvement: 
                        <span className={`font-bold ml-1 ${improvementData.improvement > 0 ? "text-green-300" : "text-red-300"}`}>
                          {improvementData.improvement > 0 ? "+" : ""}{improvementData.improvement} points 
                          ({improvementData.improvement > 0 ? "+" : ""}{improvementData.percentage}%)
                        </span>
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <Button 
                variant={showDashboard ? "outline" : "default"} 
                onClick={() => setShowDashboard(!showDashboard)}
                className="bg-white/20 hover:bg-white/30 border-white/50 text-white"
              >
                {showDashboard ? "Hide Dashboard" : "Show Progress Dashboard"}
                <BarChart3 className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Progress Dashboard */}
          {showDashboard && (
            <div className="bg-white rounded-xl shadow mb-8 p-6 border border-gray-200">
              <h3 className="text-xl font-bold mb-6 flex items-center text-indigo-700">
                <TrendingUp className="mr-2" /> Your Progress Dashboard
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Overall Stats Card */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100 shadow-sm">
                  <h4 className="font-semibold text-indigo-800 mb-3">Overall Performance</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-2 bg-white/70 rounded-lg">
                      <div className="text-xs text-gray-500">Sessions</div>
                      <div className="text-2xl font-bold text-indigo-700">{Object.keys(interviewSessions).length}</div>
                    </div>
                    <div className="text-center p-2 bg-white/70 rounded-lg">
                      <div className="text-xs text-gray-500">Questions</div>
                      <div className="text-2xl font-bold text-indigo-700">{feedbackList.length}</div>
                    </div>
                    <div className="text-center p-2 bg-white/70 rounded-lg">
                      <div className="text-xs text-gray-500">Avg Rating</div>
                      <div className="text-2xl font-bold text-indigo-700">
                        {Math.round(feedbackList.reduce((acc, item) => acc + Number(item.rating), 0) / feedbackList.length)}/10
                      </div>
                    </div>
                    <div className="text-center p-2 bg-white/70 rounded-lg">
                      <div className="text-xs text-gray-500">Trend</div>
                      <div className={`text-2xl font-bold flex justify-center items-center ${getTrendColor()}`}>
                        {calculateTrend() === "up" && <TrendingUp className="h-6 w-6" />}
                        {calculateTrend() === "down" && <TrendingUp className="h-6 w-6 transform rotate-180" />}
                        {calculateTrend() === "flat" && <span className="text-blue-500">→</span>}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Strengths */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100 shadow-sm">
                  <h4 className="font-semibold text-green-800 mb-3">Your Strongest Areas</h4>
                  <ul className="space-y-2">
                    {strongestTopics.length > 0 ? (
                      strongestTopics.map(([topic, rating], i) => (
                        <li key={topic} className="flex justify-between items-center p-2 bg-white/70 rounded-lg">
                          <span className="capitalize font-medium text-gray-800">{topic}</span>
                          <span className={`font-bold ${getRatingColor(rating)}`}>{rating}/10</span>
                        </li>
                      ))
                    ) : (
                      <li className="p-2 text-center text-gray-500">Not enough data yet</li>
                    )}
                  </ul>
                </div>
                
                {/* Weaknesses */}
                <div className="bg-gradient-to-br from-amber-50 to-red-50 p-4 rounded-xl border border-amber-100 shadow-sm">
                  <h4 className="font-semibold text-amber-800 mb-3">Areas to Improve</h4>
                  <ul className="space-y-2">
                    {weakestTopics.length > 0 ? (
                      weakestTopics.map(([topic, rating], i) => (
                        <li key={topic} className="flex justify-between items-center p-2 bg-white/70 rounded-lg">
                          <span className="capitalize font-medium text-gray-800">{topic}</span>
                          <span className={`font-bold ${getRatingColor(rating)}`}>{rating}/10</span>
                        </li>
                      ))
                    ) : (
                      <li className="p-2 text-center text-gray-500">Not enough data yet</li>
                    )}
                  </ul>
                </div>
              </div>
              
              {/* Progress Chart */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3">Performance Over Time</h4>
                <div className="bg-white p-2 rounded-lg border border-gray-200">
                  <div className="h-64 w-full">
                    {progressData.length > 0 ? (
                      <div className="relative h-full">
                        {/* Y-axis labels */}
                        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 pr-2">
                          <span>10</span>
                          <span>8</span>
                          <span>6</span>
                          <span>4</span>
                          <span>2</span>
                          <span>0</span>
                        </div>
                        
                        {/* Grid lines */}
                        <div className="absolute left-6 right-0 top-0 bottom-0 flex flex-col justify-between">
                          {[10, 8, 6, 4, 2, 0].map((tick) => (
                            <div key={tick} className="w-full border-t border-gray-200 h-0"></div>
                          ))}
                        </div>
                        
                        {/* Chart bars */}
                        <div className="absolute left-8 right-0 top-2 bottom-6 flex items-end justify-around">
                          {progressData.map((entry, index) => (
                            <div key={index} className="flex flex-col items-center">
                              <div 
                                className={`w-12 relative ${getRatingBgColor(entry.rating)}`} 
                                style={{ 
                                  height: `${(entry.rating / 10) * 100}%`,
                                  minHeight: '4px' 
                                }}
                              >
                                <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold">
                                  {entry.rating}/10
                                </span>
                              </div>
                              <span className="text-xs mt-2 text-gray-600">{entry.date}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <p className="text-gray-500">Not enough data to display chart</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Recommendations */}
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                  <Sparkles className="mr-2 h-5 w-5" /> Recommendations
                </h4>
                <ul className="list-disc pl-6 space-y-1 text-blue-700">
                  {weakestTopics.length > 0 && (
                    <li>
                      Focus on improving your knowledge in <span className="capitalize font-medium">{weakestTopics[0][0]}</span>
                    </li>
                  )}
                  {calculateTrend() === "down" && (
                    <li>
                      Your performance is trending downward. Consider reviewing your recent interview answers.
                    </li>
                  )}
                  {Object.keys(interviewSessions).length < 3 && (
                    <li>
                      Complete more practice interviews to get better insights on your performance.
                    </li>
                  )}
                  {(calculateTrend() === "up" || calculateTrend() === "flat") && (
                    <li>
                      You're making good progress. Keep practicing consistently.
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Session selection sidebar */}
            <div className="bg-gray-100 p-4 rounded-xl shadow">
              <h3 className="font-semibold text-lg mb-4 flex items-center">
                <Calendar className="mr-2 text-indigo-600" /> Interview Sessions
              </h3>
              <div className="space-y-2">
                {Object.keys(interviewSessions)
                  .sort((a, b) => moment(b, "DD-MM-YYYY").valueOf() - moment(a, "DD-MM-YYYY").valueOf())
                  .map((date) => (
                    <div
                      key={date}
                      className={`p-3 rounded-lg cursor-pointer transition-all flex justify-between items-center ${
                        selectedDate === date
                          ? "bg-indigo-100 border-l-4 border-indigo-600"
                          : "hover:bg-gray-200"
                      }`}
                      onClick={() => setSelectedDate(date)}
                    >
                      <div className="flex items-center">
                        <Timer className="h-4 w-4 mr-2 text-indigo-600" />
                        <span>{moment(date, "DD-MM-YYYY").format("MMM D, YYYY")}</span>
                      </div>
                      <div 
                        className={`px-2 py-1 rounded-full font-medium text-xs ${getRatingBgColor(avgRatingByDate[date])}`}
                      >
                        {avgRatingByDate[date]}/10
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            
            {/* Interview session details */}
            <div className="md:col-span-3">
              {selectedDate && (
                <>
                  <div className="bg-white rounded-xl shadow p-6 mb-6 border-t-4 border-indigo-600">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold flex items-center">
                        <ClipboardCheck className="mr-2 text-indigo-600" />
                        Session: {moment(selectedDate, "DD-MM-YYYY").format("MMMM D, YYYY")}
                      </h3>
                      <div 
                        className={`text-2xl font-bold ${getRatingColor(avgRatingByDate[selectedDate])}`}
                      >
                        {avgRatingByDate[selectedDate]}/10
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-blue-50 p-3 rounded-lg flex items-center">
                        <BookOpen className="mr-2 text-blue-600" />
                        <div>
                          <div className="text-sm text-blue-700">Questions</div>
                          <div className="font-bold">{interviewSessions[selectedDate].length}</div>
                        </div>
                      </div>
                      
                      <div className="bg-purple-50 p-3 rounded-lg flex items-center">
                        <Sparkles className="mr-2 text-purple-600" />
                        <div>
                          <div className="text-sm text-purple-700">Best Answer</div>
                          <div className="font-bold">
                            {Math.max(...interviewSessions[selectedDate].map(item => Number(item.rating)))}/10
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-amber-50 p-3 rounded-lg flex items-center">
                        <Award className="mr-2 text-amber-600" />
                        <div>
                          <div className="text-sm text-amber-700">Performance</div>
                          <div className="font-bold">
                            {avgRatingByDate[selectedDate] >= 8 ? "Excellent" : 
                             avgRatingByDate[selectedDate] >= 6 ? "Good" : 
                             avgRatingByDate[selectedDate] >= 4 ? "Fair" : "Needs Work"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {interviewSessions[selectedDate].map((item, index) => (
                      <Collapsible key={index} className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
                        <CollapsibleTrigger className="p-4 text-left flex items-center justify-between w-full hover:bg-gray-50">
                          <div className="pr-4">
                            <span className="text-gray-500 text-sm">Question {index + 1}</span>
                            <p className="font-medium">{item.question}</p>
                          </div>
                          <div className="flex items-center">
                            <div className={`px-3 py-1 rounded-full mr-3 ${getRatingBgColor(Number(item.rating))}`}>
                              <span className={`font-semibold ${getRatingColor(Number(item.rating))}`}>
                                {item.rating}/10
                              </span>
                            </div>
                            <ChevronsUpDownIcon className="h-5 w-5 flex-shrink-0 text-gray-500" />
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="p-4 border-t border-gray-200 space-y-3">
                            <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                              <h4 className="font-semibold text-red-800 mb-1">Your Answer:</h4>
                              <p className="text-red-700">{item.userAns}</p>
                            </div>
                            
                            <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                              <h4 className="font-semibold text-green-800 mb-1">Model Answer:</h4>
                              <p className="text-green-700">{item.correctAns}</p>
                            </div>
                            
                            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                              <h4 className="font-semibold text-blue-800 mb-1">Feedback:</h4>
                              <p className="text-blue-700">{item.feedback}</p>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="flex justify-center mt-8">
            <Button 
              onClick={() => router.replace('/dashboard')} 
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              Return to Dashboard
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default Feedback;