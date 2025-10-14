export const formatCurrency = (value) => {
  return `VND ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export const parseCurrency = (value) => {
  return value === null || value === void 0
    ? void 0
    : value.replace(/VND \s?|(,*)/g, "")
}
