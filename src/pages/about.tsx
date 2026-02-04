import { Link } from 'react-router'
import Github from '@/icons/github'
import Linkedin from '@/icons/linkedin'

export default function AboutPage () {
  return (
    <div
      className='h-full flex flex-col justify-center items-center gap-6'
    >
      <img
        src='/logo.png'
        alt='Coheteros Logo'
        className='w-32 h-32'
      />
      <div
        className='flex flex-col items-center gap-2'
      >
        <p
          className='text-2xl'
        >
          COHETEROS GROUND STATION UI
        </p>
        <p>
          DEVELOPED BY THE COHETEROS TEAM
        </p>
        <p>
          FOR THE EUROPEAN ROCKETRY CHALLENGE
        </p>
        <p>
          COHETEROS © {new Date().getFullYear()}. ALL RIGHTS RESERVED.
        </p>
      </div>
      <div
        className='flex flex-col items-center gap-2'
      >
        <Link
          to='https://github.com/CoheterosUS'
          target='_blank'
          className='flex items-center gap-2 text-primary-muted-foreground border-primary-muted-foreground'
        >
          <Github
            strokeWidth={1.5}
            className='w-6 h-6'
          />
          <p>
            VIEW ON GITHUB
          </p>
        </Link>
        <Link
          to='https://www.linkedin.com/company/coheteros-us/'
          target='_blank'
          className='flex items-center gap-2 text-primary-muted-foreground border-primary-muted-foreground'
        >
          <Linkedin
            strokeWidth={1.5}
            className='w-6 h-6'
          />
          <p>
            VIEW ON LINKEDIN
          </p>
        </Link>
      </div>
    </div>
  )
}
