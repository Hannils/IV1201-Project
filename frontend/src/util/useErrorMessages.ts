import { FieldPath, FieldValues, FormState } from 'react-hook-form'

export default function useErrorMessage<Fields extends FieldValues>(
  formState: FormState<Fields>,
  name: FieldPath<Fields>,
) {
  const isTouched = formState.touchedFields[name]
  const error = formState.errors[name]
  return isTouched && error !== undefined ? error.message : undefined
}
