/**
 * A formatter used when formatting dates for use in date inputs.
 * They need a specific format (dd-mm-yyyy) hence the sv-SE locale is used
 */
export const dateInputFormatter = new Intl.DateTimeFormat('sv-SE', {
  dateStyle: 'short',
})
