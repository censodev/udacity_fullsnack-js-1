const checkNumAndParse = (val: string | undefined, errHandler: () => {}): number => {
  try {
    if (val === undefined) throw new Error()
    return parseInt(val)
  } catch (error) {
    errHandler()
  }
  return 0
}

export default { checkNumAndParse }
