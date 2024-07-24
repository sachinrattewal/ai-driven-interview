"use client";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import InterviewCard from "./InterviewCard";

function InterviewList() {
  const { user } = useUser();
  const [previousInterviews, setPreviousInterviews] = useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getPreviousInterviews = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(
        eq(
          MockInterview.createdBy,
          user?.primaryEmailAddress?.emailAddress as string
        )
      )
      .orderBy(desc(MockInterview.id));
    setPreviousInterviews(result as any);
  };

  useEffect(() => {
    getPreviousInterviews();
  }, [user]);

  if (!previousInterviews?.length) {
    return;
  }

  return (
    <div>
      <h2 className="font-medium text-xl mb-5 text-primary">
        Previous Interviews
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {previousInterviews?.length > 0 &&
          previousInterviews.map((interview: any, idx) => (
            <InterviewCard key={interview.id} interview={interview} />
          ))}
      </div>
    </div>
  );
}

export default InterviewList;
