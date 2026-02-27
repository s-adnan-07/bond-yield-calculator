import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import InputAdornment from '@mui/material/InputAdornment'

import useCalculate from './hooks/useCalculate'
import CashflowTable from './components/CashflowTable'

function App() {
  const {
    outputState,
    inputState,
    handleSubmit,
    handleInputChange,
    handleClear,
    formatPercent,
  } = useCalculate()

  return (
    <>
      <Container maxWidth="lg">
        <Stack py={6} divider={<Divider />}>
          <Paper component="form" sx={{ p: 2 }} onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <Typography variant="h4" align="center">
                Bond Yield Calculator
              </Typography>
              <TextField
                name="faceValue"
                label="Face Value"
                type="number"
                onChange={handleInputChange}
                value={inputState.faceValue ?? ''}
              />
              <TextField
                name="marketPrice"
                label="Market Price"
                type="number"
                onChange={handleInputChange}
                value={inputState.marketPrice ?? ''}
              />
              <TextField
                name="annualCouponRate"
                label="Annual Coupon Rate"
                type="number"
                onChange={handleInputChange}
                // onBlur={handleDecimalInput}
                value={inputState.annualCouponRate ?? ''}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                name="yearsToMaturity"
                label="Years to Maturity"
                type="number"
                onChange={handleInputChange}
                value={inputState.yearsToMaturity ?? ''}
              />
              <TextField
                name="couponFrequency"
                label="Coupon Frequency"
                type="number"
                onChange={handleInputChange}
                value={inputState.couponFrequency ?? ''}
              />
              <Button type="submit" variant="contained" color="primary">
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
          <Paper sx={{ p: 2 }}>
            <Typography variant="h5" align="center">
              Inputs
            </Typography>
            <Typography variant="body1">
              Face Value: {inputState?.faceValue}
            </Typography>
            <Typography variant="body1">
              Market Price: {inputState?.marketPrice}
            </Typography>
            <Typography variant="body1">
              Annual Coupon Rate: {inputState?.annualCouponRate}
            </Typography>
            <Typography variant="body1">
              Years to Maturity: {inputState?.yearsToMaturity}
            </Typography>
            <Typography variant="body1">
              Coupon Frequency: {inputState?.couponFrequency}
            </Typography>
          </Paper>
          {outputState && (
            <Paper>
              <Typography variant="h5" align="center">
                Output
              </Typography>
              <Typography variant="body1">
                Current Yield: {formatPercent(outputState.currentYield)}
              </Typography>
              <Typography variant="body1">
                Yield to Maturity: {formatPercent(outputState.yieldToMaturity)}
              </Typography>
              <Typography variant="body1">
                Total Interest: {outputState.totalInterest}
              </Typography>
              <Typography variant="body1">
                Indicator: {outputState.indicator}
              </Typography>
            </Paper>
          )}
          {outputState && outputState.cashflowSchedule.length !== 0 && (
            <CashflowTable cashflowSchedule={outputState.cashflowSchedule} />
          )}
        </Stack>
      </Container>
    </>
  )
}

export default App
