"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { ThumbsUp, ThumbsDown, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { jokes } from "@/data/jokes"
import Link from "next/link"
import {useScorerGenerator} from "@/lib/hooks/useGeneratedRubric";
import useLocalStorage from "@/lib/hooks/useLocalStorage";
import PiClient from "withpi";
import Question = PiClient.Question;
import {ScorerGenerator} from "@/components/scorer_generator";
import {getTopJokes, ScoredJoke} from "@/lib/backend/rubricActions";
import RadialLoader from "@/components/radial_loader";


function RankedJoke({joke, score, questionScores} : {joke: string; score: number; questionScores: {label: string; score: number}[]}) {
  return (
    <div className="py-3 border-b border-gray-200 dark:border-gray-600">
      <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
        {joke}
      </div>
      <div className="flex flex-wrap gap-1">
        <Badge variant="default" className="text-xs">
          Final Score: {score}
        </Badge>
        {questionScores.map(d =>
          <Badge key={d.label} variant="secondary" className="text-xs">
            {d.label}: {d.score}
          </Badge>
        )}
      </div>
    </div>
  )
}

export default function RateJokes() {
  const [currentJokeIndex, setCurrentJokeIndex] = useState(0)
  const [rubric, setRubric] = useState<Question[]>([]);
  const [rankedJokes, setRankedJokes] = useState<ScoredJoke[]>([]);
  const [startingRubricGen, setStartingRubricGen] = useState<boolean>(false);
  const [applyingRubric, setApplyingRubric] = useState<boolean>(false);
  const [ratings, setRatings] = useState<{ [key: number]: "funny" | "not-funny" | null }>({})
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast();
  const [jobId, setJobId] = useLocalStorage('scorerGenJobId', null);
  const scorerGenerator = useScorerGenerator({
    initJobId: jobId || null,
    onFetch: (status) => {
     console.log("Fetched", status);
    },
    onFinish: (status) => {
      console.log("Finsihed with", status);
    },
    onError: (e) => {
      console.log(e);
    }
  });
  async function applyRubric(rubric: Question[]) {
    setRankedJokes([]);
    setRubric(rubric);
    setApplyingRubric(true);
    const rankedJokes = await getTopJokes(rubric);
    setRankedJokes(rankedJokes);
    setApplyingRubric(false)
  }
  async function startGeneratingScorer() {
    const ratingData = Object.entries(ratings);
    if (ratingData.length > 0) {
      const goodJokes = [];
      const badJokes = [];
      for (const rating of ratingData) {
        if (rating[1] == 'funny') {
          const key = Number(rating[0]);
          goodJokes.push(jokes[key].text)
        } else if (rating[1] == 'not-funny') {
          const key = Number(rating[0]);
          badJokes.push(jokes[key].text)
        }
      }
      setStartingRubricGen(true);
      console.log("Starting scorer generator with ", goodJokes, badJokes);
      const job = await scorerGenerator.start(goodJokes, badJokes);
      console.log("Stated job", job);
      setJobId(job.jobId);
      setStartingRubricGen(false
      )
    }
  }
  const currentJoke = jokes[currentJokeIndex]
  const currentRating = ratings[currentJokeIndex]

  const handleRating = (rating: "funny" | "not-funny") => {
    setRatings((prev) => ({ ...prev, [currentJokeIndex]: rating }))

    toast({
      title: rating === "funny" ? "😄 Glad you liked it!" : "😅 Maybe the next one!",
      description: rating === "funny" ? "Thanks for the thumbs up!" : "Thanks for the feedback!",
      duration: 2000,
    })

    // Auto-advance to next joke after rating
    setTimeout(() => {
      if (currentJokeIndex < jokes.length - 1) {
        setCurrentJokeIndex((prev) => prev + 1)
      }
    }, 1500)
  }

  const nextJoke = () => {
    if (currentJokeIndex < jokes.length - 1) {
      setCurrentJokeIndex((prev) => prev + 1)
    }
  }

  const resetJokes = () => {
    setCurrentJokeIndex(0)
    setRatings({})
    toast({
      title: "🔄 Starting over!",
      description: "All jokes reset. Let's try again!",
      duration: 2000,
    })
  }

  // Handle touch events for mobile swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      handleRating("not-funny")
    }
    if (isRightSwipe) {
      handleRating("funny")
    }
  }
  console.log(rubric);
  return (
    <div className="flex items-center justify-center p-4 min-h-[calc(100vh-80px)]">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Rate jokes to discover your humor horoscope 😄
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm">Desktop: Click buttons • Mobile: Swipe left/right</p>
        </div>

        <Card
          ref={cardRef}
          className="mb-6 shadow-lg hover:shadow-xl transition-shadow duration-300 touch-pan-y"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <CardContent className="p-8">
            <div className="text-center">
              <div className="text-lg leading-relaxed text-gray-700 dark:text-gray-200 mb-4">{currentJoke.text}</div>

              {currentRating && (
                <div className="flex items-center justify-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                  <span>Rated: </span>
                  {currentRating === "funny" ? (
                    <>
                      <ThumbsUp className="w-4 h-4 text-green-500" /> Funny
                    </>
                  ) : (
                    <>
                      <ThumbsDown className="w-4 h-4 text-red-500" /> Not Funny
                    </>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Desktop buttons - hidden on mobile */}
        <div className="hidden sm:flex gap-4 mb-4">
          <Button
            onClick={() => handleRating("funny")}
            disabled={!!currentRating}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white"
            size="lg"
          >
            <ThumbsUp className="w-5 h-5 mr-2" />
            Funny
          </Button>
          <Button
            onClick={() => handleRating("not-funny")}
            disabled={!!currentRating}
            variant="destructive"
            className="flex-1"
            size="lg"
          >
            <ThumbsDown className="w-5 h-5 mr-2" />
            Not Funny
          </Button>
        </div>

        {/* Mobile swipe instruction - shown only on mobile */}
        <div className="sm:hidden mb-4 text-center">
          <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-3 text-sm text-gray-600 dark:text-gray-300">
            👈 Swipe left for "Not Funny" • Swipe right for "Funny" 👉
          </div>
        </div>

        {/* Control buttons */}
        <div className="flex gap-3">
          {currentJokeIndex === jokes.length - 1 && (
            <Button onClick={resetJokes} variant="outline" className="flex-1 bg-transparent">
              <RotateCcw className="w-4 h-4 mr-2" />
              Start Over
            </Button>
          )}
        </div>

        {/* Quick Tips - replaced with accordion component */}
        <div className="mt-8">
          <ScorerGenerator job={scorerGenerator.status} generatingScorer={startingRubricGen || scorerGenerator.running || jobId} title={'Generate a horoscope'} finishGeneratingScorer={async () => {
            setJobId(null);
            if (scorerGenerator.status?.dimensions) {
              await applyRubric(scorerGenerator.status?.dimensions);
            }
          }} startGeneratingScorer={startGeneratingScorer} stopGeneratingScorer={async () => {
            await scorerGenerator.cancel();
          }}/>
          {rubric.length > 0 ?
            <Card className="bg-white/60 dark:bg-gray-800/60">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Your Humor Horoscope</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">What you look for in your jokes</p>
                  </div>
                </div>
                <Accordion type="single" collapsible className="w-full">
                  {rubric.map(question =>
                    <AccordionItem key={question.label} value={question.label || ""}>
                      <AccordionTrigger className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                        {question.label}
                      </AccordionTrigger>
                      <AccordionContent className="text-xs text-gray-500 dark:text-gray-500">
                        {question.question}
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
                <div className="flex justify-center mt-4">
                  <a
                    href="#"
                    className="flex items-center gap-2 text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                  >
                    <img src="/pi-logo.svg" alt="Pi Studio" className="w-4 h-4" />
                    Open in Pi Studio
                  </a>
                </div>
              </CardContent>
            </Card> : null
          }
        </div>

        {/* More recommended jokes */}
        <div className="mt-4">
          <Card className="bg-white/60 dark:bg-gray-800/60">
            <CardContent className="p-4">
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Jokes for you{" "}
                  <Link
                    href="/"
                    className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-normal"
                  >
                    (browse all jokes)
                  </Link>
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Based on your humor horoscope</p>
              </div>
              {applyingRubric ?
                <div className={'flex justify-center items-center gap-2'}>
                  Finding jokes
                  <RadialLoader/>
                </div> :
                rankedJokes.length > 0 ?
                  <div className="space-y-0">
                    {rankedJokes.map(j =>
                      <RankedJoke joke={j.joke} score={j.totalScore} questionScores={j.questionScores}/>
                    )}
                  </div> :
                  <div>
                    Generate a horoscope to get some ranked jokes.
                  </div>
              }
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
