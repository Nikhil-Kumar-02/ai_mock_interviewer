// "use client";
// import { Button } from "@/components/ui/button";
// import { db } from "@/utils/db";
// import { MockInterview } from "@/utils/schema";
// import { eq } from "drizzle-orm";
// import { Lightbulb, WebcamIcon } from "lucide-react";
// import Link from "next/link";
// import React, { useEffect, useState } from "react";
// import Webcam from "react-webcam";

// function Interview({ params }) {
//   const [interviewData, setInterviewData] = useState();
//   const [webCamEnabled, setWebCamEnabled] = useState(false);
//   useEffect(() => {
//     GetInterviewDetail();
//   }, []);

//   /**
//    * Used to Get Interview Details by MockId/Interview Id
//    */

//   const GetInterviewDetail = async () => {
//     const result = await db
//       .select()
//       .from(MockInterview)
//       .where(eq(MockInterview.mockId, params.interviewId));
//     console.log("questions are :--  ",result);
//     setInterviewData(result[0]);
//   };
//   return (
//     <div className="my-10 ">
//       <h2 className="font-bold text-2xl">Let's Get Started</h2>
//       <div  className="grid grid-cols-1 md:grid-cols-2 gap-10">
//       <div className="flex flex-col my-5 gap-5">
//         <div className="flex flex-col p-5 rounded-lg border gap-5">
//         <h2>
//           <strong>Job Role/Job Position:</strong> {interviewData?.jobPosition}{" "}
//         </h2>
//         <h2>
//           <strong>Job Description/Job Description:</strong>{" "}
//           {interviewData?.jobDesc}{" "}
//         </h2>
//         <h2>
//           <strong>Years of Experince:</strong> {interviewData?.jobExperience}{" "}
//         </h2>
//         </div>
//         <div className="p-5 border rounded-lg border-yellow-300 bg-yellow-100 ">
//           <h2 className="flex gap-2 items-center text-yellow-500"><Lightbulb/> <strong>Information</strong> </h2>
//           <h2 className="mt-3 text-yellow-500">{process.env.NEXT_PUBLIC_INFORMATION}</h2>
//         </div>
//       </div>
//       <div>
//         {webCamEnabled ? (
//           <Webcam
//             mirrored={true}
//             style={{
//               height: 350,
//               width: 700,
//               borderRadius: 16,
//               border: '1px solid #e5e7eb',
//               objectFit: 'cover',
//               margin : '1rem'
//             }}
//             onUserMedia={() => setWebCamEnabled(true)}
//             onUserMediaError={() => setWebCamEnabled(false)}
//           />
//         ) : (
//           <>
//             <WebcamIcon className="h-72 w-full my-7 p-20 bg-secondary rounded-lg border" />
//             <Button
//               variant="ghost"
//               onClick={() => setWebCamEnabled(true)}
//               className="px-4 py-2 text-sm bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-md shadow-md hover:shadow-lg hover:scale-105 hover:brightness-110 transition-all duration-300 ease-in-out"
//             >
//               Enable Web Cam and Microphone
//             </Button>
//           </>
//         )}
//       </div>
//       </div>

//       <div className="flex justify-end items-end">

//       <Link href={`/dashboard/interview/${params.interviewId}/start`}>
//      <Button >Start Interview</Button>
      
//       </Link>
//       </div>
      
//     </div>
//   );
// }

// export default Interview;





"use client";
import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { 
  Briefcase, 
  FileText, 
  Clock, 
  Lightbulb, 
  Camera, 
  CameraOff,
  ArrowRight,
  RefreshCw
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";

function Interview({ params }) {
  const [interviewData, setInterviewData] = useState();
  const [webCamEnabled, setWebCamEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getInterviewDetail();
  }, []);

  /**
   * Used to Get Interview Details by MockId/Interview Id
   */
  const getInterviewDetail = async () => {
    setIsLoading(true);
    try {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, params.interviewId));
      
      console.log("questions are :--  ", result);
      if (result.length > 0) {
        setInterviewData(result[0]);
      } else {
        setError("Interview not found");
      }
    } catch (err) {
      console.error("Error fetching interview details:", err);
      setError("Failed to load interview details");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleWebcam = () => {
    setWebCamEnabled(prev => !prev);
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <RefreshCw className="h-12 w-12 text-primary animate-spin mb-4" />
        <h2 className="text-xl font-medium">Loading interview details...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-lg text-center">
          <h2 className="text-red-600 font-bold text-xl mb-2">Error</h2>
          <p className="text-gray-700">{error}</p>
          <Button 
            onClick={getInterviewDetail} 
            className="mt-4 bg-red-100 text-red-600 hover:bg-red-200"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto my-10 px-4">
      {/* Header */}
      <div className="mb-8 border-b pb-4">
        <h1 className="font-bold text-3xl bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Prepare for Success
        </h1>
        <p className="text-gray-600 mt-2">
          Review your interview details and set up your camera before starting
        </p>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: Interview details - more compact */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 transition-all duration-300 hover:shadow-md">
            <h2 className="font-semibold text-lg mb-3 pb-1 border-b">Interview Details</h2>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-50 rounded-md">
                  <Briefcase className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xs text-gray-500 font-medium">Job Role</h3>
                  <p className="font-medium">{interviewData?.jobPosition || "Not specified"}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-purple-50 rounded-md">
                  <Clock className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xs text-gray-500 font-medium">Experience</h3>
                  <p className="font-medium">{interviewData?.jobExperience || "Not specified"} years</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="p-1.5 bg-green-50 rounded-md mt-0.5">
                  <FileText className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xs text-gray-500 font-medium">Job Description</h3>
                  <p className="text-sm text-gray-800 leading-snug">
                    {interviewData?.jobDesc || "No job description provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tips card */}
          <div className="bg-amber-50 rounded-xl shadow-sm border border-amber-100 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-amber-100 rounded-full">
                <Lightbulb className="h-4 w-4 text-amber-600" />
              </div>
              <h2 className="font-semibold text-sm text-amber-800">Interview Tips</h2>
            </div>
            <p className="text-xs text-amber-700">
              {process.env.NEXT_PUBLIC_INFORMATION || 
                "Speak clearly, maintain eye contact through your webcam, and prepare examples of your past experiences related to the job requirements."}
            </p>
          </div>


          <Link href={`/dashboard/interview/${params.interviewId}/start`}>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg px-6"
            >
              Start Interview <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>

        </div>

        {/* Right column: Webcam - expanded */}
        <div className="lg:col-span-2 flex flex-col">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full flex flex-col">
            <h2 className="font-semibold text-xl mb-4">Camera Preview</h2>
            
            <div className="flex-1 flex flex-col items-center justify-center">
              {webCamEnabled ? (
                <div className="w-full flex flex-col">
                  <div className="w-full h-80 md:h-96">
                    <Webcam
                      mirrored={true}
                      className="w-full h-full rounded-lg border border-gray-200 shadow-inner object-cover"
                      onUserMedia={() => setWebCamEnabled(true)}
                      onUserMediaError={() => setWebCamEnabled(false)}
                    />
                  </div>
                  <div className="mt-4 flex justify-center">
                    <Button 
                      variant="outline" 
                      onClick={toggleWebcam}
                      className="bg-red-50 border-red-100 text-red-600 hover:bg-red-100"
                    >
                      <CameraOff className="h-4 w-4 mr-2" />
                      Disable Camera
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-80 md:h-96 w-full">
                  <div className="bg-gray-50 rounded-lg p-12 mb-6 flex justify-center items-center">
                    <Camera className="h-24 w-24 text-gray-300" />
                  </div>
                  <Button
                    onClick={toggleWebcam}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Enable Camera
                  </Button>
                  <p className="text-sm text-gray-500 mt-4 text-center max-w-xs">
                    Your camera feed helps create a more realistic interview experience
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Action buttons */}
      <div className="mt-10 flex justify-between items-center border-t pt-6">
        <div>
          <p className="text-sm text-gray-500">
            Make sure your microphone and camera are working before you begin
          </p>
        </div>
        {/* <Link href={`/dashboard/interview/${params.interviewId}/start`}>
          <Button 
            size="lg"
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg px-6"
          >
            Start Interview <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link> */}
      </div>
    </div>
  );
}

export default Interview;