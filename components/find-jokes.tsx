"use client"

import { Card, CardContent } from "@/components/ui/card"
import { jokes } from "@/data/jokes"

export default function FindJokes() {
  return (
    <div className="p-4 min-h-[calc(100vh-80px)]">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">All Jokes</h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Browse our complete collection of {jokes.length} jokes
          </p>
        </div>

        <div className="space-y-4">
          {jokes.map((joke, index) => (
            <Card key={index} className="shadow-md">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-300">{index + 1}</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-200 leading-relaxed flex-1">{joke}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
