import { useEffect, useRef } from 'react'
import ControlsButton from '@/components/controls/controls-button'
import Panel from '@/components/ui/panel'

const accents = {
  default: 'text-primary-muted-foreground',
  danger: 'text-negative',
  positive: 'text-positive'
}

export default function ConfirmDialog ({
  title = 'CONFIRM',
  message,
  confirmLabel = 'CONFIRM',
  cancelLabel = 'CANCEL',
  variant = 'danger',
  onResolve
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  // <dialog> only traps focus, blocks the page and handles ESC when opened imperatively
  useEffect(() => {
    dialogRef.current?.showModal()
  }, [])

  return (
    <dialog
      ref={dialogRef}
      className='m-auto bg-transparent p-0 backdrop:bg-background/80'
      onCancel={(event) => {
        // ESC would close the dialog without ever resolving the promise
        event.preventDefault()
        onResolve(false)
      }}
    >
      <Panel
        title={title}
        accentClassName={accents[variant]}
        className='w-96 max-w-[90vw] bg-background'
        contentClassName='flex flex-col gap-4 px-3 py-3'
      >
        <p
          className='text-sm text-primary-muted-foreground'
        >
          {message}
        </p>
        <div
          className='flex flex-row flex-wrap justify-end gap-2'
        >
          <ControlsButton
            label={cancelLabel}
            onClick={() => onResolve(false)}
          />
          <ControlsButton
            label={confirmLabel}
            onClick={() => onResolve(true)}
            variant={variant}
          />
        </div>
      </Panel>
    </dialog>
  )
}
