import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { jokes } from "@/data/jokes"

// Mock function to generate random badges for each joke
const generateBadges = (jokeId: number) => {
  const badgeTypes = [
    "Witty",
    "Clever",
    "Sarcastic",
    "Punny",
    "Absurd",
    "Dry",
    "Smart",
    "Goofy",
    "Random",
    "Ironic",
    "Quirky",
    "Bold",
    "Dark",
    "Silly",
    "Wordplay",
  ]
  const numBadges = Math.floor(Math.random() * 4) + 2 // 2-5 badges per joke
  const selectedBadges = []

  for (let i = 0; i < numBadges; i++) {
    const randomType = badgeTypes[Math.floor(Math.random() * badgeTypes.length)]
    const randomScore = (Math.random() * 0.4 + 0.5).toFixed(2) // Random score between 0.50-0.90
    selectedBadges.push(`${randomType} ${randomScore}`)
  }

  return selectedBadges
}

export default function DatabasePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" className="mb-4 bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Jokes
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Full Joke Database</h1>
          <p className="text-gray-600 dark:text-gray-300">All {jokes.length} jokes with humor analysis</p>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Joke
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Humor Analysis
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {jokes.map((joke) => (
                    <tr key={joke.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {joke.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 max-w-md">{joke.text}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {generateBadges(joke.id).map((badge, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {badge}
                            </Badge>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
