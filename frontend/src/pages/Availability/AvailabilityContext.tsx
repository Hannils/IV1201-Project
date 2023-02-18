import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { createContext, PropsWithChildren, useContext, useMemo } from 'react'
import {
  ErrorOption,
  useFieldArray,
  UseFieldArrayReturn,
  useForm,
  UseFormReturn,
} from 'react-hook-form'
import { z } from 'zod'

import api from '../../api/api'
import { useAuthedUser } from '../../components/WithAuth'
import { Availability } from '../../util/Types'

/**
 * The basic schema for creating new availability periods
 * Not dependent on any external resources
 */
const baseCreateSchema = z
  .object({
    fromDate: z
      .date()
      .min(new Date(new Date().toLocaleDateString()), 'Date must be in future'),
    toDate: z.date(),
  })
  .refine((data) => data.toDate >= data.fromDate, {
    message: 'End date must be after start date',
    path: ['toDate'],
  })

/**
 * This will further build on the {@link baseCreateSchema} and
 * makes sure the availability periods already added are not overlapping with the one the user wants to create
 * @param existingAvailability availability periods already added as {@link Availability}[]
 * @returns A zodSchema
 */
const createSchemaGenerator = (existingAvailability: Availability[]) =>
  baseCreateSchema.superRefine((data, ctx) => {
    const fromDateMatch = existingAvailability.find(
      ({ fromDate, toDate }) => fromDate <= data.fromDate && data.fromDate <= toDate,
    )

    if (fromDateMatch) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Start date is overlapping with period ${fromDateMatch.fromDate.toLocaleDateString()}-${fromDateMatch.toDate.toLocaleDateString()}`,
        path: ['fromDate'],
      })
    }
    const toDateMatch = existingAvailability.find(
      ({ fromDate, toDate }) => fromDate <= data.toDate && data.toDate <= toDate,
    )

    if (toDateMatch) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `End date is overlapping with period ${toDateMatch.fromDate.toLocaleDateString()}-${toDateMatch.toDate.toLocaleDateString()}`,
        path: ['toDate'],
      })
    }

    const overlapMatch = existingAvailability.find(
      ({ fromDate, toDate }) => data.fromDate <= fromDate && toDate <= data.toDate,
    )

    if (overlapMatch) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Range is overlapping with period ${overlapMatch.fromDate.toLocaleDateString()}-${overlapMatch.toDate.toLocaleDateString()}`,
        path: ['fromDate'],
      })
    }
  })

export type CreateFormData = z.infer<typeof baseCreateSchema>
export interface AvailabilitiesFormData {
  availabilities: Availability[]
}

interface DeleteParams {
  availabilityId: number
  index: number
}

interface AvailabilityData {
  createForm: UseFormReturn<CreateFormData>
  createSubmit: React.FormEventHandler<HTMLFormElement>
  availabilitiesForm: UseFormReturn<AvailabilitiesFormData>
  deleteMutation: UseMutationResult<unknown, unknown, DeleteParams>
  availabilities: UseFieldArrayReturn<AvailabilitiesFormData, 'availabilities', 'id'>
}

const availabilityContext = createContext<AvailabilityData>({} as AvailabilityData)

/**
 * Custom hook to get access data and CR(U)D for availability editor
 */
export const useAvailability = () => useContext(availabilityContext)

interface AvailabilityProviderProps {
  availabilities: Availability[]
}

export default function AvailabilityProvider({
  availabilities: initialAvailabilities,
  children,
}: PropsWithChildren<AvailabilityProviderProps>) {
  const user = useAuthedUser()
  const queryClient = useQueryClient()

  const availabilitiesForm = useForm<AvailabilitiesFormData>({
    mode: 'onChange',
    defaultValues: {
      availabilities: initialAvailabilities,
    },
  })

  const availabilities = useFieldArray({
    control: availabilitiesForm.control,
    name: 'availabilities',
  })

  const createSchema = useMemo(
    () => createSchemaGenerator(availabilities.fields),
    [availabilities.fields],
  )

  const createForm = useForm<CreateFormData>({
    mode: 'onChange',
    shouldUseNativeValidation: false,
    resolver: zodResolver(createSchema),
  })

  const creteMutation = useMutation({
    mutationFn: (data: CreateFormData) =>
      api.createAvailability({ ...data, personId: user.personId }),
    onSuccess: (newAvailability) => {
      queryClient.removeQueries({ queryKey: ['availability'] })
      const index = availabilities.fields.findIndex(
        (field) => field.fromDate > newAvailability.fromDate,
      )
      if (index === -1) availabilities.append(newAvailability)
      else availabilities.insert(index, newAvailability)
    },
  })

  console.log(createForm.formState.isSubmitting)
  console.log(createForm.formState.isSubmitSuccessful)

  const deleteMutation = useMutation({
    mutationFn: ({ availabilityId }: DeleteParams) =>
      api.deleteAvailability(availabilityId),
    onSuccess: (_, { index }) => {
      queryClient.removeQueries({ queryKey: ['availability'] })
      availabilities.remove(index)
    },
  })

  const handleCreateSubmit = async (data: CreateFormData) => {
    try {
      await creteMutation.mutateAsync(data)
      console.log('FINISHED')
    } catch (e: unknown) {
      const error = { type: 'custom' } as ErrorOption
      if (e instanceof Error) error.message = e.message
      else error.message = 'Unknown error'

      createForm.setError('root', error)
    }
  }

  const contextData = {
    createForm,
    createSubmit: createForm.handleSubmit(handleCreateSubmit),
    availabilitiesForm,
    deleteMutation,
    availabilities,
  } satisfies AvailabilityData

  return (
    <availabilityContext.Provider value={contextData}>
      {children}
    </availabilityContext.Provider>
  )
}
