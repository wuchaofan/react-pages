import React, { useState, ChangeEvent, KeyboardEvent, useRef } from 'react'
import './style.css';

interface Props {
  count: number
  className?: string
  getValue: (v: string) => void
}

const CaptchaInput = ({count, className, getValue}: Props) => {
  const [list, setList] = useState<string[]>(Array(count).fill(''))
  const [val, setVal] = useState('')
  const inputRef = useRef<HTMLInputElement>()
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    if ((value && /^(\d+)$/.test(value)) || val.length > value.length) {
      getValue(value)
      setVal(value)
      setList(list.map((_, index) => value[index] ?? ''))
    }
  }
  const onClick = () => {
    inputRef.current.focus()
  }
  return (
    <div className={`captchaBox ${className || ''}`} onClick={onClick}>
      <input ref={inputRef} maxLength={count} type="text" value={val} onChange={onChange} />
      {
        list.map((item, index) => {
          return <div className="captchaBox-item" key={index}>{item}</div>
        })
      }
    </div>
  )
}
CaptchaInput.defaultProps = {
  count: 4
}
export default CaptchaInput
