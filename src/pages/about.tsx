import Github from '@/icons/github';
import { Link } from 'react-router';

export default function AboutPage () {
  return (
    <div
      className='h-full flex flex-col'
    >
      <p
        className='px-4 pt-4 text-xl'
      >
        ABOUT
      </p>
      <div
        className='h-full flex flex-col justify-center items-center gap-4'
      >
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
        <Link
          to='https://github.com/CoheterosUS/coheteros-gsui'
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
      </div>
    </div>
  )
}
