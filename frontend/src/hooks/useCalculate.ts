import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import type { InputState, OutputState, SelectionChangeEvent } from '@/types'
import { VITE_SERVER_URL } from '../constants'

// We are using null here instead of 0 because, 0 is a valid number and it will be treated as a number.
// Null helps us clear the input fields when the user clicks the clear button.
const initialInputState: InputState = {
  faceValue: null,
  marketPrice: null,
  annualCouponRate: null,
  yearsToMaturity: null,
  couponFrequency: 1,
}

function useCalculate() {
  const [inputState, setInputState] = useState<InputState>(
    () => initialInputState,
  )
  const [outputState, setoutputState] = useState<OutputState | null>(() => null)
  const [errorMessages, setErrorMessages] = useState<string[] | null>(
    () => null,
  )

  const { refetch, isLoading } = useQuery<
    OutputState,
    AxiosError<{ message: string[] | string }>
  >({
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
      `${VITE_SERVER_URL}/calculate`,
      {
        ...input,
        annualCouponRate,
      },
    )

    return data
  }

  // For TextField
  function handleInputChange(e: React.ChangeEvent<HTMLFormElement>) {
    setErrorMessages(null)
    setInputState((prevState) => ({
      ...prevState,
      [e.target.name]: Number(e.target.value),
    }))
  }

  function handleSelectionChange(e: SelectionChangeEvent) {
    setInputState((prevState) => ({
      ...prevState,
      [e.target.name]: Number(e.target.value),
    }))
  }

  function handleClear() {
    setErrorMessages(null)
    setInputState(initialInputState)
    setoutputState(null)
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrorMessages(null)

    // Data contains "last successful fetch result"
    // Therefore if the query fails the data will contain stale values
    const { data, error } = await refetch()

    if (error) {
      if (!error.response) {
        setErrorMessages(() => [error.message])
        setoutputState(null)
        return
      }

      setErrorMessages(
        !Array.isArray(error.response?.data.message)
          ? [error.response?.data.message ?? null]
          : error.response?.data.message,
      )
      setoutputState(null)
      return
    }
    if (!data) return

    setoutputState(data)
  }

  return {
    outputState,
    inputState,
    isLoading,
    errorMessages,
    handleSubmit,
    handleSelectionChange,
    handleInputChange,
    handleClear,
  }
}

export default useCalculate
