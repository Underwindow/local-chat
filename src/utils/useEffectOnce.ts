import { useRef, useEffect } from 'react'

export default function useEffectOnce(fn: () => (() => void) | void) {
  const ref = useRef(false)
  useEffect(() => {
    if (ref.current) {
      return fn()
    }
    return () => {
      ref.current = true
    }
  }, [])
}