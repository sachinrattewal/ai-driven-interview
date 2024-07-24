"use client";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import Questions from "./_components/Questions";
import RecordAnswers from "./_components/RecordAnswers";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function StartInterview({ params }: any) {
  const router = useRouter();
  const [interviewQuestions, setInterviewQuestions] = useState([] as any);
  const [webCamEnabled, setWebCamEnabled] = useState(false);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [interviewId, setInterviewId] = useState("");

  useEffect(() => {
    getInterviewDetails();
  }, []);

  const getInterviewDetails = async () => {
    const response = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, params.interviewId));
    if (response?.length) {
      const interviewQuestions = JSON.parse(response[0].jsonMockResp);
      setInterviewQuestions(interviewQuestions);
      setInterviewId(response[0].mockId);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <Questions
          interviewQuestions={interviewQuestions}
          activeQuestionIdx={activeQuestionIdx}
          setActiveQuestionIdx={setActiveQuestionIdx}
        />
        <RecordAnswers
          interviewQuestions={interviewQuestions}
          activeQuestionIdx={activeQuestionIdx}
          interviewId={interviewId}
        />
      </div>
      <div className="flex justify-end gap-6 mb-20 mt-[-80px]">
        {activeQuestionIdx > 0 && (
          <Button onClick={() => setActiveQuestionIdx(activeQuestionIdx - 1)}>
            Preview Question
          </Button>
        )}
        {activeQuestionIdx !== interviewQuestions?.length - 1 && (
          <Button onClick={() => setActiveQuestionIdx(activeQuestionIdx + 1)}>
            Next Question
          </Button>
        )}
        {activeQuestionIdx === interviewQuestions?.length - 1 && (
          <Button
            onClick={() =>
              router.push(`/dashboard/interview/${interviewId}/feedback`)
            }
          >
            End Interview
          </Button>
        )}
      </div>
    </div>
  );
}

export default StartInterview;
