const checkNumAndParse = (val: string | undefined): number | undefined => {
  try {
    return val === undefined ? val : parseInt(val)
  } catch (error) {
    console.error(error)
    return undefined
  }
}

export default { checkNumAndParse }
