export default ({ app }, inject) => {
  inject('numberFormat', (num) => {
    return num.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,');
  });
}