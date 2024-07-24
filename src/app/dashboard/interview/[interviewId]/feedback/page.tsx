"use client";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import React, { useEffect, useState } from "react";
import { ChevronsUpDown } from "lucide-react";

function Feedback({ params }: any) {
  const [feedbackList, setFeedbackList] = useState([]);
  const [avgRating, setAvgRating] = useState(0);

  useEffect(() => {
    getFeedback();
  }, []);

  const getFeedback = async () => {
    const result: any = await db
      .select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, params.interviewId))
      .orderBy(UserAnswer.id);
    setFeedbackList(result);
    getOverallRating(result);
  };

  const getOverallRating = (data: any) => {
    const sumOfRatings: number = data.reduce(
      (sum: any, obj: any) => sum + parseInt(obj.rating, 10),
      0
    );
    const avgRating: number =
      sumOfRatings /
      parseInt(process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT as string, 10);
    setAvgRating(avgRating.toFixed(2) as any);
  };

  return (
    <div className="p-10">
      {avgRating > 3 && (
        <h2 className="text-2xl mb-5 font-bold text-green-500">
          Congratulations on receiving excellent feedback in your interview!
        </h2>
      )}
      <h2 className="font-bold text-2xl">Here is your interview feedback</h2>
      <h2 className="text-primary text-lg my-3">
        Your average rating:{" "}
        <strong
          className={`${avgRating < 3 ? "text-red-500" : "text-green-500"}`}
        >
          {avgRating}
        </strong>
      </h2>
      <h2 className="text-sm text-gray-500">
        Below are interview questions with correct answers and AI feedback.
      </h2>
      {feedbackList.length < 0 && <h2>No Interview Found</h2>}
      {feedbackList?.length > 0 &&
        feedbackList.map((item: any, idx: number) => (
          <div key={item.id} className="mt-5">
            <Collapsible>
              <CollapsibleTrigger className="flex gap-5 w-full justify-between p-2 bg-secondary rounded-lg my-2 text-left">
                Q{idx + 1}. {item.question}
                <ChevronsUpDown className="h-5 w-5" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="flex flex-col gap-2">
                  <h2 className="text-red-500 p-2 border rounded-lg">
                    Rating: <strong>{item?.rating}</strong>
                  </h2>
                  <h2 className="p-2 border rounded-lg bg-red-50 text-sm text-red-900">
                    <strong>Your answer: </strong>
                    {item.userAns}
                  </h2>
                  <h2 className="p-2 border rounded-lg bg-green-50 text-sm text-green-900">
                    <strong>Correct answer: </strong>
                    {item.correctAns}
                  </h2>
                  <h2 className="p-2 border rounded-lg bg-blue-50 text-sm text-primary">
                    <strong>Feedback from AI: </strong>
                    {item.feedback}
                  </h2>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        ))}
    </div>
  );
}

export default Feedback;
