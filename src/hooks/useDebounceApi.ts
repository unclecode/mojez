// // hooks/useDebounceApi.ts
// import { useState, useCallback } from 'react'
// import debounce from 'lodash/debounce'

// export function useDebounceApi<T>(apiCall: (input: string) => Promise<T>, delay = 500) {
//   const [data, setData] = useState<T | null>(null)
//   const [isLoading, setIsLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)

//   const debouncedApiCall = useCallback(
//     debounce(async (input: string) => {
//       setIsLoading(true)
//       setError(null)
//       try {
//         const result = await apiCall(input)
//         setData(result)
//       } catch (err) {
//         setError(err.message || 'An error occurred')
//       } finally {
//         setIsLoading(false)
//       }
//     }, delay),
//     [apiCall, delay]
//   )

//   return { data, isLoading, error, debouncedApiCall }
// }