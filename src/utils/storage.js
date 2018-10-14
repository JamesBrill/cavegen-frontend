const store = window.localStorage

export const writeCaveName = ({ id, name }) => {
  store.setItem(`cavegen__${id}__name`, name)
}

export const writeCaveText = ({ id, text }) => {
  store.setItem(`cavegen__${id}__text`, text)
}

export const writeCave = ({ id, name, text }) => {
  writeCaveName({ id, name })
  writeCaveText({ id, text })
}

export const readCave = ({ id }) => ({
  id,
  name: store.getItem(`cavegen__${id}__name`),
  text: store.getItem(`cavegen__${id}__text`)
})

export const readAllCaves = () => {
  const ids = Object.keys(store)
    .filter(key => /^cavegen__.*__name$/.test(key))
    .map(key => key.replace('cavegen__', '').replace('__name', ''))
  return ids.map(id => readCave({ id }))
}
