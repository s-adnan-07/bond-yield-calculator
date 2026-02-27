import { createTheme } from '@mui/material'
import { blueGrey, lightBlue } from '@mui/material/colors'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

const defaultTheme = createTheme({
  components: {
    MuiPaper: { defaultProps: { elevation: 12, sx: { p: 2 } } },
    MuiStack: { defaultProps: { spacing: 3 } },
    // MuiGrid: { defaultProps: { xs: 12 } },
    MuiTab: { defaultProps: { iconPosition: 'end' } },
    MuiButton: { defaultProps: { variant: 'contained' } },
    MuiTableCell: { defaultProps: { align: 'center' } },
  },
})

export const darkTheme = createTheme({
  ...defaultTheme,
  palette: { mode: 'dark', primary: lightBlue, secondary: blueGrey },
})

export const lightTheme = createTheme({
  ...defaultTheme,
  palette: { mode: 'light', primary: blueGrey },
})

export default defaultTheme
