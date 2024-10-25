type SelecProps = {
  options: string[]
  defaultvalue?: string
}

export default function Select({ options, defaultvalue }: SelecProps) {
  return (
    <select className='text-black'>
      {options.map((option, i) => (
        <option
          key={i}
          value={option}
          defaultValue={defaultvalue ? defaultvalue : '-'}
        >
          {option}
        </option>
      ))}
    </select>
  )
}
