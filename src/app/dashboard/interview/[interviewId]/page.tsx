"use client";
import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { Lightbulb, WebcamIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";

function Interview({ params }: any) {
  const router = useRouter();
  const [interviewDetails, setInterviewDetails] = useState({} as any);
  const [webCamEnabled, setWebCamEnabled] = useState(false);

  useEffect(() => {
    getInterviewDetails();
  }, []);

  const getInterviewDetails = async () => {
    const response = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, params.interviewId));
    if (response?.length) {
      setInterviewDetails(response[0]);
    }
  };

  const startInterview = () => {
    router.push(`/dashboard/interview/${params.interviewId}/start`);
  };

  return (
    <div className="my-10">
      <h2 className="font-bold text-2xl text-center ">
        Hi {interviewDetails?.userName}, Lets get started!
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex flex-col my-5 gap-5">
          <div className="flex flex-col gap-5 p-5 rounded-lg border">
            <h2 className="text-lg">
              <strong>Job Role / Position: </strong>
              {interviewDetails.jobPosition}
            </h2>
            <h2 className="text-lg">
              <strong>Job Description / Tech Stack: </strong>
              {interviewDetails.jobDesc}
            </h2>
            <h2 className="text-lg">
              <strong>Years of Experience: </strong>
              {interviewDetails.jobExperience}
            </h2>
          </div>
          <div className="p-5 border rounded-lg border-yellow-300 bg-yellow-100">
            <h2 className="flex gap-2 items-center text-yellow-500">
              <Lightbulb />{" "}
              <span>
                <strong>Information</strong>
              </span>
            </h2>
            <h2 className="mt-3 text-yellow-500">
              {process.env.NEXT_PUBLIC_INTERVIEW_INFORMATION}
            </h2>
          </div>
        </div>
        <div>
          {webCamEnabled ? (
            <Webcam
              onUserMedia={() => setWebCamEnabled(true)}
              onUserMediaError={() => setWebCamEnabled(false)}
              mirrored={true}
              style={{
                height: 300,
                width: 300,
              }}
            />
          ) : (
            <WebcamIcon className="h-72 w-full my-5 p-20 bg-secondary rounded-lg border" />
          )}
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => setWebCamEnabled(true)}
          >
            Enable Web Cam and Microphone
          </Button>
          <Button className="w-full" onClick={() => startInterview()}>
            Start Interview
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Interview;
