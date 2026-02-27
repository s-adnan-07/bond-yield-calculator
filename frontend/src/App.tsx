import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'

import useCalculate from './hooks/useCalculate'
import CashflowTable from './components/CashflowTable'
import OutputCard from './components/OutputCard'
import AlertStack from './components/AlertStack'
import InputCard from './components/InputCard'

function App() {
  const {
    outputState,
    inputState,
    isLoading,
    errorMessages,
    handleSubmit,
    handleInputChange,
    handleClear,
  } = useCalculate()

  return (
    <Container maxWidth="lg">
      <Stack py={6} divider={<Divider />}>
        <InputCard
          onSubmit={handleSubmit}
          onChange={handleInputChange}
          inputState={inputState}
          isLoading={isLoading}
          handleClear={handleClear}
        />
        {errorMessages && <AlertStack messages={errorMessages} />}
        {outputState && <OutputCard outputState={outputState} />}
        {outputState && outputState.cashflowSchedule.length !== 0 && (
          <CashflowTable cashflowSchedule={outputState.cashflowSchedule} />
        )}
      </Stack>
    </Container>
  )
}

export default App
