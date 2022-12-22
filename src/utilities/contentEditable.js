export const selectAllInlineText =(e ) => {
  e.target.focus()
  e.target.select()
}


export const saveContentAfterEnter = (e) => {
  if (e.key === 'Enter') {
    e.target.blur()
  }
}