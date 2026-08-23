import { useCallback, useRef, useState } from 'react'
import ConfirmDialog from '@/components/ui/confirm-dialog'

// promise based replacement for window.confirm, same `if (!confirmed) return` call shape
export default function useConfirm () {
  const [options, setOptions] = useState<ConfirmOptions | null>(null)
  const resolveRef = useRef<((confirmed: boolean) => void) | null>(null)

  const confirm = useCallback((next: ConfirmOptions) => {
    // a second call while one is open would orphan the first promise
    resolveRef.current?.(false)
    setOptions(next)

    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve
    })
  }, [])

  const handleResolve = useCallback((confirmed: boolean) => {
    resolveRef.current?.(confirmed)
    resolveRef.current = null
    setOptions(null)
  }, [])

  const dialog = options == null
    ? null
    : (
      <ConfirmDialog
        {...options}
        onResolve={handleResolve}
      />
      )

  return { confirm, dialog }
}
