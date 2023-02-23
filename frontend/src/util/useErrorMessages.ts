import { FieldPath, FieldValues, FormState } from 'react-hook-form'

/**
 * Gives quick access to the error message for a field
 * @param formState formState of the form
 * @param name name of the field
 * @returns `undefined` or error message as `string` if there is an error
 */
export default function useErrorMessage<Fields extends FieldValues>(
  formState: FormState<Fields>,
  name: FieldPath<Fields>,
) {
  const isTouched = formState.touchedFields[name]
  const error = formState.errors[name]
  return isTouched && error !== undefined ? error.message : undefined
}
