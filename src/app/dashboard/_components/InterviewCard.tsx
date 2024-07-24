import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

function InterviewCard({ interview }: any) {
  return (
    <div className="border shadow-sm rounded-lg p-5">
      <div className="flex flex-col gap-3">
        <h2 className="font-bold text-primary">{interview?.jobPosition}</h2>
        <h2 className="text-sm text-gray-600">
          {interview?.jobExperience} Years of Experience
        </h2>
        <h2 className="text-xs text-gray-500">
          Interviewed on: {interview.createdAt}
        </h2>
      </div>
      <div className="flex justify-between mt-2 gap-5">
        <Link
          href={`/dashboard/interview/${interview.mockId}/feedback`}
          className="w-full"
        >
          <Button size="sm" variant="outline" className="text-primary w-full">
            Feedback
          </Button>
        </Link>
        <Link
          href={`/dashboard/interview/${interview.mockId}`}
          className="w-full"
        >
          <Button size="sm" className="w-full">
            Start
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default InterviewCard;
