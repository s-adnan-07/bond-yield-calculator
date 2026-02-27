import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { formatPercent } from '../utils'
import type { OutputState } from '@/types'

type Props = { outputState: OutputState }

function OutputCard({ outputState }: Props) {
  const { currentYield, yieldToMaturity, totalInterest, indicator } =
    outputState

  return (
    <Paper>
      <Typography variant="h5" align="center">
        Output
      </Typography>
      <Typography variant="body1">
        Current Yield: {formatPercent(currentYield)}
      </Typography>
      <Typography variant="body1">
        Yield to Maturity: {formatPercent(yieldToMaturity)}
      </Typography>
      <Typography variant="body1">Total Interest: {totalInterest}</Typography>
      <Typography variant="body1">Indicator: {indicator}</Typography>
    </Paper>
  )
}

export default OutputCard
