// * Order an array of objects based on another array order

export const mapOrder = (array, order, key) => {
    array.sort((a, b) => order.indexOf(a[key]) - order.indexOf(b[key]))
    console.log(key)
    return array
}

