import RateJokes from "@/components/rate-jokes"
import {Navbar} from "@/components/navbar";
import {auth} from "@/auth";

export default async function JokeApp() {
  const session = await auth();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <Navbar user={session?.user}/>
      <RateJokes />
    </div>
  )
}
