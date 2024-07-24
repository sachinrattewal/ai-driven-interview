"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/utils/gemini-ai";
import { LoaderCircle } from "lucide-react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { useRouter } from "next/navigation";

function AddNewInterview() {
  const { user } = useUser();
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState([]);
  const startInterview = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const prompt =
      "Job position: " +
      jobPosition +
      " , Job description/tech stack: " +
      jobDesc +
      ", years of experience: " +
      jobExperience +
      " depending on job position, description and years of experience, give " +
      process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT +
      " interview questions along with answers in JSON format, give us question and answer field on JSON, Don't share any other information apart from question and answers";
    const result = await chatSession.sendMessage(prompt);
    let response = result.response.text().replace("```json", "");
    response = response.replace("```", "");
    setJsonResponse(response);
    if (response) {
      const resp = await db
        .insert(MockInterview)
        .values({
          mockId: uuidv4(),
          jsonMockResp: response,
          jobDesc: jobDesc,
          jobExperience: jobExperience,
          jobPosition: jobPosition,
          createdBy: user?.primaryEmailAddress?.emailAddress as string,
          createdAt: moment().format("DD-MM-yyyy"),
          userName: user?.fullName as string,
        })
        .returning({ mockId: MockInterview.mockId });
      if (resp) {
        setOpenModal(false);
        router.push(`/dashboard/interview/${resp?.[0]?.mockId}`);
      }
    }
    setLoading(false);
  };

  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
        onClick={() => setOpenModal(true)}
      >
        <h2 className="text-lg text-center text-primary">
          + Start New Interview
        </h2>
      </div>
      <Dialog open={openModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell us more about your job interview
            </DialogTitle>
            <DialogDescription>
              <form onSubmit={startInterview}>
                <div>
                  <h2>
                    Add details about your job position/role, Job description
                    and years of experience
                  </h2>
                  <div className="mt-7 my-25">
                    <label className="mb-5">Job Position/Role</label>
                    <Input
                      className="mt-2"
                      placeholder="Ex. Software Engineer"
                      required
                      onChange={(e) => setJobPosition(e.target.value)}
                    />
                  </div>
                  <div className="mt-5 my-25">
                    <label className="mb-5">Job Description / Tech Stack</label>
                    <Textarea
                      className="mt-2"
                      placeholder="Ex. React, Angular, NodeJS, MySQL"
                      required
                      onChange={(e) => setJobDesc(e.target.value)}
                    />
                  </div>
                  <div className="mt-2 my-25">
                    <label className="mb-5">Years of Experience</label>
                    <Input
                      className="mt-2"
                      placeholder="Ex. 5"
                      type="number"
                      required
                      onChange={(e) => setJobExperience(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-5 justify-end mt-7">
                  <Button variant="ghost" onClick={() => setOpenModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <LoaderCircle className="animate-spin" />
                        <span> Generating from AI</span>
                      </>
                    ) : (
                      <span>Start Interview</span>
                    )}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
