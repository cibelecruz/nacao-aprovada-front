export type GenericObject = { [key: string]: unknown }

export function compareArrayValues(
  array1: GenericObject[],
  array2: GenericObject[],
): boolean {
  if (array1.length !== array2.length) {
    return false
  }

  const compareObjects = (
    obj1: GenericObject,
    obj2: GenericObject,
  ): boolean => {
    const keys1 = Object.keys(obj1)
    const keys2 = Object.keys(obj2)

    if (keys1.length !== keys2.length) {
      return false
    }

    for (const key of keys1) {
      if (!Object.prototype.hasOwnProperty.call(obj2, key)) {
        return false
      }

      const val1 = obj1[key]
      const val2 = obj2[key]

      if (Array.isArray(val1) && Array.isArray(val2)) {
        if (!compareArrays(val1, val2)) {
          return false
        }
      } else if (
        val1 !== null &&
        typeof val1 === 'object' &&
        val2 !== null &&
        typeof val2 === 'object'
      ) {
        if (!compareObjects(val1 as GenericObject, val2 as GenericObject)) {
          return false
        }
      } else if (val1 !== val2) {
        return false
      }
    }

    return true
  }

  const compareArrays = (arr1: unknown[], arr2: unknown[]): boolean => {
    if (arr1.length !== arr2.length) {
      return false
    }

    for (let i = 0; i < arr1.length; i++) {
      const val1 = arr1[i]
      const val2 = arr2[i]

      if (Array.isArray(val1) && Array.isArray(val2)) {
        if (!compareArrays(val1, val2)) {
          return false
        }
      } else if (
        val1 !== null &&
        typeof val1 === 'object' &&
        val2 !== null &&
        typeof val2 === 'object'
      ) {
        if (!compareObjects(val1 as GenericObject, val2 as GenericObject)) {
          return false
        }
      } else if (val1 !== val2) {
        return false
      }
    }

    return true
  }

  for (let i = 0; i < array1.length; i++) {
    if (!compareObjects(array1[i], array2[i])) {
      return false
    }
  }

  return true
}
