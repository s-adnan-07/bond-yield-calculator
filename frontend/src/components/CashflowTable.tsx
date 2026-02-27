import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

import type { CashflowRecord } from '@/types'

type CashflowColumnKey = keyof CashflowRecord

const cashflowColumns: { key: CashflowColumnKey; label: string }[] = [
  { key: 'period', label: 'Period' },
  { key: 'cashFlow', label: 'Cash Flow' },
  { key: 'couponPayment', label: 'Coupon Payment' },
  { key: 'cumulativeInterest', label: 'Cumulative Interest' },
  { key: 'remainingBalance', label: 'Remaining Balance' },
]

type Props = { cashflowSchedule: CashflowRecord[] }

function CashflowTable({ cashflowSchedule }: Props) {
  return (
    <>
      <TableContainer component={Paper} sx={{ p: 0 }}>
        <Table>
          <TableHead>
            <TableRow>
              {cashflowColumns.map((column) => (
                <TableCell>{column.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {cashflowSchedule.map((row) => (
              <TableRow
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                {cashflowColumns.map((column) => (
                  <TableCell>{row[column.key]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default CashflowTable
