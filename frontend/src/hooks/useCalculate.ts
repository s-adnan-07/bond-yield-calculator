import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import type { InputState, OutputState } from '@/types'

// We are using null here instead of 0 because, 0 is a valid number and it will be treated as a number.
// Null helps us clear the input fields when the user clicks the clear button.
const initialInputState: InputState = {
  faceValue: null,
  marketPrice: null,
  annualCouponRate: null,
  yearsToMaturity: null,
  couponFrequency: null,
}

function useCalculate() {
  const [inputState, setInputState] = useState<InputState>(
    () => initialInputState,
  )
  const [outputState, setoutputState] = useState<OutputState | null>(() => null)

  const { refetch } = useQuery<OutputState>({
    queryKey: ['calculate'],
    queryFn: calculate,
    enabled: false,
    retry: false,
  })

  async function calculate() {
    // eslint-disable-next-line prefer-const
    let { annualCouponRate, ...input } = inputState

    if (annualCouponRate) annualCouponRate /= 100

    const { data } = await axios.post<OutputState>(
      'http://localhost:3000/api/calculate',
      { ...input, annualCouponRate },
    )

    return data
  }

  // For TextField
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputState((prevState) => ({
      ...prevState,
      [e.target.name]: Number(e.target.value),
    }))
  }

  function handleDecimalInput(e: React.FocusEvent<HTMLInputElement>) {
    setInputState((prevState) => ({
      ...prevState,
      [e.target.name]: Number(e.target.value) / 100,
    }))
  }

  function handleClear() {
    setInputState(initialInputState)
    setoutputState(null)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const { data } = await refetch()
    if (!data) return

    setoutputState(data)
  }

  function formatPercent(value: number) {
    const percent = value * 100

    return percent.toFixed(3) + '%'
  }

  return {
    outputState,
    inputState,
    handleSubmit,
    handleDecimalInput,
    handleInputChange,
    handleClear,
    formatPercent,
  }
}

export default useCalculate
