
export const formatNumber = (numb: any) => {
  numb = Number.parseFloat(numb).toFixed(2);
  var str = numb.toString().split(".");
  str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (str.length == 1) {
    str[1] = "00";
  }
  return "$" + str.join(".");
}