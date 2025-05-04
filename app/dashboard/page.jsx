// import { UserButton } from '@clerk/nextjs'
// import React from 'react'
// import AddNewInterview from './_components/AddNewInterview'
// import Interviewlist from './_components/Interviewlist'

// function Dashboard() {
//   return (
//     <div>
//       <h2 className='font-bold text-2xl'>Dashboard</h2>
//       <h2 className='text-gray-500'>Create and Start AI Mockup Interview</h2>

//       <div className='grid grid-cols-1 md:grid-cols-3 my-2'>
//         <AddNewInterview/>
//       </div>
//       {/* Previous Interview list */}
//       <Interviewlist/>
//     </div>
//   )
// }

// export default Dashboard


"use client";

import { UserButton } from '@clerk/nextjs';
import React, { useState, useEffect } from 'react';
import AddNewInterview from './_components/AddNewInterview';
import Interviewlist from './_components/Interviewlist';
import { ChevronRight, BarChart2, Award, Clock, Activity, BookOpen, Code, Briefcase } from 'lucide-react';
import { db } from "@/utils/db";
import { desc, eq } from 'drizzle-orm';
import { MockInterview } from "@/utils/schema";
import { useUser } from '@clerk/nextjs';

function Dashboard() {
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useUser();
  const [interviews, setInterviews] = useState([]);
  
  const [stats, setStats] = useState({
    completed: 0,
    lastInterview: '- -',
    categories: {}
  });

  // Function to calculate the days since the interview
  const calculateDaysSince = (dateStr) => {
    // Expected format: "DD-MM-YYYY"
    const [day, month, year] = dateStr.split('-').map(Number);
    const interviewDate = new Date(year, month - 1, day); // month is 0-indexed
    const today = new Date();
  
    // Zero out the time for accurate "days" difference
    interviewDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
  
    const diffTime = today - interviewDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };  

  // Function to get interview data and calculate stats
  const getInterviewData = async () => {
    try {
      const result = await db.select()
        .from(MockInterview)
        .where(eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress))
        .orderBy(desc(MockInterview.id));
      
      console.log("Fetched interviews:", result);
      setInterviews(result);

      // Calculate stats from interview data
      if (result && result.length > 0) {
        const categories = {};
        
        // Count categories
        result.forEach(interview => {
          const position = interview.jobPosition;
          if (categories[position]) {
            categories[position]++;
          } else {
            categories[position] = 1;
          }
        });

        // Set stats based on real data
        setStats({
          completed: result.length,
          lastInterview: calculateDaysSince(result[0].createdAt),
          categories: categories
        });
      }
      
      setIsLoaded(true);
    } catch (error) {
      console.error("Error fetching interview data:", error);
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    if (user) {
      getInterviewData();
    } else {
      setIsLoaded(true);
    }
  }, [user]);

  // Icon mapping based on job position
  const getJobPositionIcon = (position) => {
    const positionLower = position?.toLowerCase();
    
    if (positionLower?.includes('front')) return <Code className="text-blue-600" />;
    if (positionLower?.includes('back')) return <BookOpen className="text-green-600" />;
    return <Briefcase className="text-purple-600" />;
  };

  return (
    <div className={`transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Dashboard Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-bold text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Interview Dashboard
          </h2>
          <h2 className="text-gray-500 mt-1">Practice and improve with AI-powered mock interviews</h2>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 transition-transform hover:shadow-md hover:-translate-y-1 duration-300">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Activity size={20} className="text-blue-600" />
            </div>
            <h3 className="text-gray-500 font-medium">Completed</h3>
          </div>
          <p className="text-2xl font-bold">{stats.completed}</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 transition-transform hover:shadow-md hover:-translate-y-1 duration-300">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-amber-100 p-2 rounded-lg">
              <Clock size={20} className="text-amber-600" />
            </div>
            <h3 className="text-gray-500 font-medium">Last Interview</h3>
          </div>
          <p className="text-2xl font-bold">{stats.lastInterview}</p>
        </div>
      </div>


      {/* Add New Interview Component with Animation */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          Start a New Interview
          <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Recommended</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AddNewInterview />
        </div>
      </div>  

      {/* Previous Interviews Section */}
      <div className="mt-10">
        <h3 className="text-xl font-bold mb-4">Your Interview History</h3>
        <Interviewlist interviewList={interviews} />
      </div>
    </div>
  );
}

export default Dashboard;