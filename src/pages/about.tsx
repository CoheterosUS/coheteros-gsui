import type { ComponentType, SVGProps } from 'react'
import { Link } from 'react-router'
import { ExternalLink } from 'lucide-react'
import Github from '@/icons/github'
import Linkedin from '@/icons/linkedin'
import Panel from '@/components/ui/panel'

interface AboutLinkProps {
  href: string
  label: string
  Icon: ComponentType<SVGProps<SVGSVGElement>>
}

function AboutLink ({
  href,
  label,
  Icon
}: AboutLinkProps) {
  return (
    <Link
      to={href}
      target='_blank'
      className='group flex items-center gap-3 border-2 border-primary bg-primary px-3 py-2 text-sm tracking-widest text-primary-muted-foreground transition-colors duration-100 hover:border-primary-foreground hover:text-primary-foreground'
    >
      <Icon
        strokeWidth={1.5}
        className='size-5 shrink-0'
      />
      <span
        className='flex-1'
      >
        {label}
      </span>
      <ExternalLink
        className='size-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100'
        strokeWidth={1.5}
      />
    </Link>
  )
}

export default function AboutPage () {
  return (
    <div
      className='h-full overflow-auto p-4'
    >
      <div
        className='mx-auto flex w-full max-w-3xl flex-col gap-4'
      >
        <div
          className='flex items-center gap-6 border-2 border-primary bg-primary/40 p-6'
        >
          <img
            src='/images/logo.png'
            alt='Coheteros Logo'
            className='size-24 shrink-0'
          />
          <div
            className='flex min-w-0 flex-col gap-1'
          >
            <p
              className='text-2xl font-bold tracking-widest'
            >
              COHETEROS GROUND STATION UI
            </p>
            <p
              className='text-sm text-primary-muted-foreground'
            >
              TELEMETRY, CONTROL AND LOGGING FOR THE EUROPEAN ROCKETRY CHALLENGE
            </p>
            <p
              className='text-sm text-primary-muted-foreground'
            >
              DEVELOPED BY THE COHETEROS TEAM
            </p>
          </div>
        </div>
        <Panel
          title='LINKS'
          accentClassName='text-position'
          contentClassName='grid gap-2 px-3 py-2 md:grid-cols-3'
        >
          <AboutLink
            href='https://coheteros.com'
            label='COHETEROS.COM'
            Icon={ExternalLink}
          />
          <AboutLink
            href='https://www.linkedin.com/company/coheteros-us/'
            label='LINKEDIN'
            Icon={Linkedin}
          />
          <AboutLink
            href='https://github.com/CoheterosUS'
            label='GITHUB'
            Icon={Github}
          />
        </Panel>
        <p
          className='text-center text-xs tracking-widest text-primary-muted-foreground'
        >
          COHETEROS © {new Date().getFullYear()}. ALL RIGHTS RESERVED.
        </p>
      </div>
    </div>
  )
}
