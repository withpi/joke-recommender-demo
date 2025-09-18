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

export default function RateJokes() {
  const [currentJokeIndex, setCurrentJokeIndex] = useState(0)
  const [ratings, setRatings] = useState<{ [key: number]: "funny" | "not-funny" | null }>({})
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

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
              <div className="text-lg leading-relaxed text-gray-700 dark:text-gray-200 mb-4">{currentJoke}</div>

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
          <Card className="bg-white/60 dark:bg-gray-800/60">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Your Humor Horoscope</h3>
                <Button size="sm" variant="outline" className="text-xs bg-transparent">
                  Generate
                </Button>
              </div>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                    Lorem ipsum dolor sit amet consectetur
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-gray-500 dark:text-gray-500">
                    Adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                    veniam, quis nostrud exercitation.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                    Adipiscing elit sed do eiusmod tempor
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-gray-500 dark:text-gray-500">
                    Incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                    Incididunt ut labore et dolore magna
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-gray-500 dark:text-gray-500">
                    Aliqua enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                    consequat.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                    Aliqua enim ad minim veniam quis
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-gray-500 dark:text-gray-500">
                    Nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                    in reprehenderit.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                    Nostrud exercitation ullamco laboris
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-gray-500 dark:text-gray-500">
                    Nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>

        {/* More recommended jokes */}
        <div className="mt-4">
          <Card className="bg-white/60 dark:bg-gray-800/60">
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">More recommended jokes</h3>
              <div className="space-y-0">
                <div className="py-3 border-b border-gray-200 dark:border-gray-600">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary" className="text-xs">
                      Witty 0.87
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      Clever 0.92
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      Sarcastic 0.74
                    </Badge>
                  </div>
                </div>
                <div className="py-3 border-b border-gray-200 dark:border-gray-600">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Natus error sit voluptatem accusantium doloremque laudantium
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary" className="text-xs">
                      Punny 0.65
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      Absurd 0.81
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      Dry 0.59
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      Smart 0.78
                    </Badge>
                  </div>
                </div>
                <div className="py-3 border-b border-gray-200 dark:border-gray-600">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Doloremque laudantium totam rem aperiam eaque ipsa quae
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary" className="text-xs">
                      Goofy 0.93
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      Random 0.46
                    </Badge>
                  </div>
                </div>
                <div className="py-3">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Eaque ipsa quae ab illo inventore veritatis et quasi architecto
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary" className="text-xs">
                      Ironic 0.72
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      Quirky 0.88
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      Bold 0.63
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
