import JSONParser from 'json-parse-safe'

const PREFIX_UNWELCH = '_unwelch/'

const saveToSession = key => value => {
  window.sessionStorage.setItem(PREFIX_UNWELCH + key, JSON.stringify(value))
}

const getOnceFromSession = key => () => {
  const value = window.sessionStorage.getItem(PREFIX_UNWELCH + key)
  const parsedValue = JSONParser(value)
  if (parsedValue.error) {
    return null
  }

  window.sessionStorage.removeItem(PREFIX_UNWELCH + key)

  return parsedValue.value
}

export const saveTempAccept = saveToSession('temp_accept')
export const saveTempBet = saveToSession('temp_bet')

export const getTempAccept = getOnceFromSession('temp_accept')
export const getTempBet = getOnceFromSession('temp_bet')
