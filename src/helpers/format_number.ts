
export const formatNumber = (numb:any) => {
    var str = numb.toString().split("."); 
    str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    if(str.length==1){
      str[1] = "00";
    }else{
      str[1] = Number.parseFloat(str[1]).toFixed(2); 
    }
    return "$"+str.join(".");
  }