import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'

import type { InputState, SelectionChangeEvent } from '@/types'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'

type Props = {
  onSubmit?: React.SubmitEventHandler<HTMLFormElement>
  onChange?: React.ChangeEventHandler<HTMLFormElement>
  inputState: InputState
  isLoading: boolean
  handleClear?: () => void
  handleSelectionChange?: (e: SelectionChangeEvent) => void
}

function InputCard({
  onSubmit,
  onChange,
  inputState,
  isLoading,
  handleClear,
  handleSelectionChange,
}: Props) {
  return (
    <Paper
      component="form"
      sx={{ p: 2 }}
      onSubmit={onSubmit}
      onChange={onChange}
    >
      <Stack spacing={2}>
        <Typography variant="h4" align="center">
          Bond Yield Calculator
        </Typography>

        <TextField
          name="faceValue"
          label="Face Value"
          type="number"
          value={inputState.faceValue ?? ''}
        />

        <TextField
          name="marketPrice"
          label="Market Price"
          type="number"
          value={inputState.marketPrice ?? ''}
        />

        <TextField
          name="annualCouponRate"
          label="Annual Coupon Rate"
          type="number"
          value={inputState.annualCouponRate ?? ''}
          slotProps={{
            input: {
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            },
          }}
        />

        <TextField
          name="yearsToMaturity"
          label="Years to Maturity"
          type="number"
          value={inputState.yearsToMaturity ?? ''}
        />

        {/* <TextField
          name="couponFrequency"
          label="Coupon Frequency"
          type="number"
          value={inputState.couponFrequency ?? ''}
        /> */}

        <FormControl fullWidth>
          <InputLabel>Coupon Frequency</InputLabel>
          <Select
            name="couponFrequency"
            label="Coupon Frequency"
            value={inputState.couponFrequency}
            onChange={handleSelectionChange}
          >
            <MenuItem value={12}>Monthly</MenuItem>
            <MenuItem value={4}>Quarterly</MenuItem>
            <MenuItem value={2}>Semi-Annually</MenuItem>
            <MenuItem value={1}>Annually</MenuItem>
          </Select>
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading}
        >
          Calculate
        </Button>

        <Button
          type="button"
          variant="contained"
          color="secondary"
          onClick={handleClear}
        >
          Clear
        </Button>
      </Stack>
    </Paper>
  )
}

export default InputCard
