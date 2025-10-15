'use server';

import PiClient from "withpi";
import {z} from 'zod';
import Question = PiClient.Question;
import {jokes} from "@/data/jokes";


export interface GenerateScorerJobStatus {
  jobId: string;
  state: 'QUEUED' | 'RUNNING' | 'DONE' | 'ERROR' | 'CANCELLED';
  detailedStatus: GenerateScorerStatusMessage[];
  dimensions?: Question[];
  threshold: number | null;
}

export type GenerateScorerStatusMessage = GenerateScorerSystemMessage | GenerateScorerUserMessage;

// Used for debugging. Not intended for the user.
export interface GenerateScorerSystemMessage {
  target: 'system';
  message: string;
}

const zGenerateScorerSystemMessage = z.object({
  target: z.literal('system'),
  message: z.string(),
});

// Can be shown to the user.
export interface GenerateScorerUserMessage {
  target: 'user';
  message: string;
  // If present, is between 0 (just started) and 1 (complete).
  completion?: number;
}

const zGenerateScorerUserMessage = z.object({
  target: z.literal('user'),
  message: z.string(),
  completion: z.number().optional(),
});

// Tries to parse out all of the status messages that conform to the structured
// scorer generation log format.
function parseDetailedStatus(detailedStatus: string[]): (GenerateScorerStatusMessage)[] {
  return detailedStatus
    .map((status) => {
      try {
        status = JSON.parse(status);
      } catch {
        return null;
      }
      {
        const { success, data } = zGenerateScorerUserMessage.safeParse(status);
        if (success) return data;
      }
      {
        const { success, data } = zGenerateScorerSystemMessage.safeParse(status);
        if (success) return data;
      }
      return null;
    })
    .filter((s) => s != null) as GenerateScorerStatusMessage[];
}


export async function retrieveGenerateScorerJob(jobId: string): Promise<GenerateScorerJobStatus> {
  const client = new PiClient({
    apiKey: process.env.WITHPI_API_KEY,
  });
  const response = await client.scoringSystem.generate.retrieve(jobId);
  return {
    jobId: response.job_id,
    state: response.state,
    detailedStatus: parseDetailedStatus(response.detailed_status),
    dimensions: response.scoring_spec || [],
    threshold: response.threshold || null,
  };
}


export async function createRubric(goodJokes: string[], badJokes: string[]):Promise<GenerateScorerJobStatus> {
  const client = new PiClient({
    apiKey: process.env.WITHPI_API_KEY,
  });
  const posExamples = goodJokes.map(j => ({ llm_input: '', llm_output: j, score: 1}),)
  const negExamples = badJokes.map(j => ({ llm_input: '', llm_output: j, score: 0}),)

  const job= await client.scoringSystem.generate.startJob({
    application_description: "A joke ranker that recommends jokes that are funny to the user.",
    examples: [...posExamples, ...negExamples],
    preference_examples: [],
    existing_questions: [],
    num_questions: 10,
  })

  return {
    jobId: job.job_id,
    state: job.state,
    detailedStatus: parseDetailedStatus(job.detailed_status),
    dimensions: [],
    threshold: null,
  };
}

export async function cancelGenerateScorerJob(jobId: string): Promise<string> {
  const client = new PiClient({
    apiKey: process.env.WITHPI_API_KEY,
  });
  return client.scoringSystem.generate.cancel(jobId);
}


export interface ScoredJoke {
  questionScores: {label: string; score: number}[];
  totalScore: number;
  joke: string;
}
export async function getTopJokes(rubric: Question[]): Promise<ScoredJoke[]> {
  const client = new PiClient({
    apiKey: process.env.WITHPI_API_KEY,
  });
  const scoredJokes = await Promise.all(jokes.map(async j => {
    const score = await client.scoringSystem.score({
      llm_input: "",
      llm_output: j.text,
      scoring_spec: rubric,
    })
    return ({
      questionScores: Object.entries(score.question_scores).map(([key, value]) => ({label: key, score: value})),
      totalScore: score.total_score,
      joke: j.text,
    })
  }));
  return scoredJokes.sort((a, b) => b.totalScore - a.totalScore);
}

