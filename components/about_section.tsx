'use client'
import uiPreviewImage from '@/public/uipreview.png';
import Image from 'next/image';
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import {vscDarkPlus} from "react-syntax-highlighter/dist/esm/styles/prism";
import Link from "next/link";
import {Badge} from "@/components/ui/badge";
import {ArrowLeftIcon} from "@heroicons/react/24/outline";

const integrationCode = `pnpm dev
# or
npm run dev`
export function AboutSection({demoLink} : {demoLink: string}) {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <Link href={'https://withpi.ai/templates'} className={'text-sm text-gray-500 flex gap-2'}>
        <ArrowLeftIcon className={'w-3'}/> Back to Templates
      </Link>
      <div className={'flex justify-between'}>
        <div>
          <div className={'text-3xl font-semibold'}>Humor Horoscope Demo</div>
          <div className={'text-gray-600 mt-2'}>
            Recommend jokes that match a users sense of humor with only 5 ratings
          </div>
        </div>
        <div className={'pt-4'}>
          <Link href={demoLink} className={'p-6 py-4 bg-black hover:bg-zinc-700 text-white font-semibold rounded-md'}>
            View Demo
          </Link>
        </div>
      </div>
      <div className={'border rounded-xl overflow-hidden'}>
        <Image alt={"Ui Preview Image"} src={uiPreviewImage}/>
      </div>
      <div className={'grid grid-cols-3 gap-12'}>
        <div className={'space-y-2 col-span-2'}>
          <div className={'font-semibold text-2xl'}>Getting started</div>
          <div className={'text-lg text-gray-600'}>First run the development server:</div>
          <div className={'my-4'}>
            <SyntaxHighlighter

              language="bash"
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                lineHeight: '1.5',
              }}
              showLineNumbers={true}
            >
              {integrationCode}
            </SyntaxHighlighter>
          </div>
          <div className={'text-lg text-gray-600'}>
            Open <span className={'text-blue-600'}>http://localhost:3000</span> with your browser to see the result.
          </div>
          <div className={'text-lg text-gray-600'}>
            You can edit accessible tools by modifying <span className={'font-mono text-sm p-0.5 bg-gray-50 px-1'}>lib/tools.ts</span>
          </div>
        </div>
        <div className={'space-y-6'}>
          <div className={'space-y-2'}>
            <div className={'font-semibold text-lg'}>Github Repo</div>
            <Link className={'font-semibold text-blue-600'} href={'https://github.com/withpi/Pi-Joke-Recommender'}>
              withpi/Pi-Joke-Recommender
            </Link>
          </div>
          <div className={'space-y-2 flex flex-col'}>
            <div className={'font-semibold text-lg'}>Use Cases</div>
            <Badge variant={'outline'}>
              Recommender Systems
            </Badge>
            <Badge  variant={'outline'}>
              Solving cold start problem
            </Badge>
            <Badge variant={'outline'}>
              Starter template
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}