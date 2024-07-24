"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import useSpeechToText from "react-hook-speech-to-text";
import { Mic, MicIcon, StopCircle } from "lucide-react";
import { chatSession } from "@/utils/gemini-ai";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { toast } from "sonner";

function RecordAnswers({
  interviewQuestions,
  activeQuestionIdx,
  interviewId,
}: any) {
  const { user } = useUser();
  const [userAnswer, setUserAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  useEffect(() => {
    results.map((result: any) =>
      setUserAnswer((prevAns) => prevAns + result?.transcript)
    );
  }, [results]);

  useEffect(() => {
    if (!isRecording && userAnswer.length) {
      updateUserAnswer();
    }
  }, [userAnswer]);

  const handleRecording = async () => {
    if (isRecording) {
      stopSpeechToText();
    } else {
      startSpeechToText();
    }
  };
  const updateUserAnswer = async () => {
    const currentQuestion = interviewQuestions?.[activeQuestionIdx]?.question;
    const feedbackPrompt = `Question: ${currentQuestion}, User Answer: ${userAnswer}. Based on user answer to this question in an interview, please provide rating out of 5 and feedback in JSON format in 3-5 lines only with rating and feedback fields.`;
    const result = await chatSession.sendMessage(feedbackPrompt);
    let response = result.response.text().replace("```json", "");
    response = response.replace("```", "");
    const feedback = JSON.parse(response);
    const resp = await db.insert(UserAnswer).values({
      mockIdRef: interviewId,
      question: currentQuestion,
      correctAns: interviewQuestions?.[activeQuestionIdx]?.answer,
      userAns: userAnswer,
      feedback: feedback?.feedback,
      rating: feedback?.rating,
      userEmail: user?.primaryEmailAddress?.emailAddress,
      createdAt: moment().format("DD-MM-yyyy"),
    });
    if (resp) {
      toast("User Answer recorded successfully");
      setUserAnswer("");
      setResults([]);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="flex flex-col mt-[-30px] items-center bg-black rounded-lg p-5">
        <Image
          src={"/webcam-30.svg"}
          width={200}
          height={200}
          alt="Camera"
          className="absolute"
        />
        <Webcam
          style={{
            height: 300,
            width: "100%",
            zIndex: 10,
          }}
          mirrored={true}
        />
      </div>
      <Button
        variant="outline"
        disabled={loading}
        className="my-10"
        onClick={handleRecording}
      >
        {isRecording ? (
          <h2 className="text-red-400 flex gap-2 text-center justify-center">
            <StopCircle /> Stop Recording
          </h2>
        ) : (
          <div className="flex text-center justify-center gap-2">
            <MicIcon
              className="text-primary"
              style={{
                height: 20,
                width: 20,
              }}
            />
            <h2 className="text-primary">Record Answer</h2>
          </div>
        )}
      </Button>
    </div>
  );
}

export default RecordAnswers;
