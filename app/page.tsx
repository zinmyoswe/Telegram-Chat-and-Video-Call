import Header from '@/components/Header'
import React from 'react'

const page = () => {
  return (
    <div>
      <Header />
      <main className='flex-1 flex-col items-center px-4 py-16 sm:px-6 text-center gap-20'>
        <div className='max-w-4xl space-y-8 relative'>

          {/* Background Gradient */}
          <div className='absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50
          dark:from-blue-20 dark:via-indigo-950/20 dark:to-purple-950/20 rounded-3xl scale-150 opacity-60'></div>


        </div>
        <h1 className='text-4xl font-bold'>Connect Instantly
          <br />
          <span>
            Chat Smarter
          </span>
        </h1>
    
      </main>
    </div>
  )
}

export default page