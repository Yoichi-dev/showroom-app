export default ({ app }, inject) => {
  inject('nameCut', (name) => {

    let editName = name

    if (editName.includes('@')) {
      editName = editName.substring(0, editName.indexOf('@'))
    }

    if (editName.includes('＠')) {
      editName = editName.substring(0, editName.indexOf('＠'))
    }

    if (editName === '') {
      editName = name
    }

    return editName
  });
}