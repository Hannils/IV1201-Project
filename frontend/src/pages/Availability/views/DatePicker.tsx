import { Box, MenuItem, TextField, TextFieldProps } from '@mui/material'
import React, {
  ChangeEvent,
  forwardRef,
  HTMLProps,
  useEffect,
  useRef,
  useState,
} from 'react'

interface DatePickerProps extends HTMLProps<HTMLInputElement> {
  TextFieldProps?: TextFieldProps
  fullWidth?: boolean
}
/**
 * Component for picking dates
 */
const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  function DatePickerElement(
    { style, onChange, fullWidth, TextFieldProps, ...props },
    externalRef,
  ) {
    const internalRef = useRef<HTMLInputElement>(null)

    const inputRef = (typeof externalRef !== 'function' && externalRef) || internalRef
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
      if (typeof externalRef === 'function') externalRef(internalRef.current)
    }, [])

    const handleOpen = () => {
      if (!inputRef.current) return
      setIsOpen(true)
      inputRef.current.showPicker()
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setIsOpen(false)
      onChange?.(e)
    }

    return (
      <Box sx={{ position: 'relative', ...(fullWidth && { width: '100%' }) }}>
        <input
          {...props}
          type="date"
          ref={inputRef}
          onChange={handleChange}
          style={{
            ...style,
            position: 'absolute',
            bottom: 0,
            left: 0,
            opacity: 0,
            pointerEvents: 'none',
          }}
        />
        <TextField
          {...TextFieldProps}
          fullWidth={fullWidth}
          select
          value="placeholder"
          SelectProps={{
            ...TextFieldProps?.SelectProps,
            open: isOpen,
            onClose: () => setIsOpen(false),
            onOpen: handleOpen,
            MenuProps: {
              ...TextFieldProps?.SelectProps?.MenuProps,
              PaperProps: { sx: { visibility: 'hidden', pointerEvents: 'none' } },
            },
          }}
        >
          <MenuItem value="placeholder">
            {inputRef.current?.valueAsDate?.toLocaleDateString() || 'No date specified'}
          </MenuItem>
        </TextField>
      </Box>
    )
  },
)

export default DatePicker
