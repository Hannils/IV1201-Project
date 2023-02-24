import { useEffect, useState } from 'react'
import { FieldValues, UseFormReturn } from 'react-hook-form'

type Props<Fields extends FieldValues> =
  | Pick<UseFormReturn<Fields>, 'watch' | 'formState'>
  | UseFormReturn<Fields>

export function useFormDirtySinceLastSubmit<Fields extends FieldValues>({
  watch,
  formState,
}: Props<Fields>) {
  const { submitCount } = formState
  const [dirtySinceLastSubmit, setDirtySinceLastSubmit] = useState<boolean>(false)

  useEffect(() => {
    if (submitCount === 0) return

    setDirtySinceLastSubmit(false) // new submit, reset value
    const watchSubscription = watch(() => {
      setDirtySinceLastSubmit(true)
    })

    return () => watchSubscription.unsubscribe() // cleanup
  }, [submitCount])

  return dirtySinceLastSubmit
}
