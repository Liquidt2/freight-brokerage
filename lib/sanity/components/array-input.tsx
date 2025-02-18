import { ArrayOfObjectsInputProps, ArraySchemaType, set, unset } from 'sanity'

interface ArrayItem {
  _key: string;
  [key: string]: any;
}

export function ArrayInput(props: ArrayOfObjectsInputProps<ArrayItem, ArraySchemaType>) {
  const { value, onChange, ...rest } = props

  const handleChange = (nextValue: unknown) => {
    onChange(nextValue === undefined ? unset() : set(nextValue))
  }

  if (Array.isArray(value)) {
    const valueWithKeys = value.map((item, index) => ({
      ...item,
      _key: item._key || `item-${index}`
    }))

    return props.renderDefault({
      ...rest,
      value: valueWithKeys,
      onChange: handleChange
    })
  }

  return props.renderDefault(props)
}
