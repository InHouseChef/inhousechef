export const isArrayEqual = (array1: string[], array2: string[]) => array1.sort().toString() === array2.sort().toString()

export const getListOfIds = <T extends { id: string }>(data: T[] = [], callback?: (item: T) => string) =>
    callback ? data.map(item => callback(item)) : data.map(({ id }) => id)

export const getArrayDifference = <T extends { id: string }>(array1: T[], array2: T[]) => {
    const array2Ids = array2.map(({ id }) => id)
    return array1.filter(({ id }) => !array2Ids.includes(id))
}

interface ArrayDifferenceDetails<T> {
    added: T[]
    removed: T[]
}

export const getArrayDifferenceDetails = <T extends { id: string }>(
    prevArray: T[],
    nextArray: T[]
): ArrayDifferenceDetails<T> => {
    const added = getArrayDifference(nextArray, prevArray)
    const removed = getArrayDifference(prevArray, nextArray)

    return {
        added,
        removed
    }
}

export const removeArrayItemByIndex = (arr: any[], index: number) => {
    arr.splice(index, 1)
    return arr
}

export const pushAt = <T = any>(arr: T[], index: number, element: T) => {
    const newArr = [...arr]
    newArr.splice(index, 0, element)
    return newArr
}
