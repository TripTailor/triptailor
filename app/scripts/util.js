import $ from 'jquery';

const getQueryValue = (variable) => {
  var query = window.location.search.substring(1);
  var parameters = query.split("&");
  for(var i = 0; i < parameters.length; i++) {
    var pair = parameters[i].split("=");
    if(pair[0] == variable) {
      return pair[1];
    }
  }
  return "";
};

const arrayToString = (arr) => {
  var str = "";
  arr.forEach((elem) => str += elem + "-");
  return arr.length > 1 ? str.substring(0, str.length - 1) : str;
}

const dateToString = (date) => {
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
};

const tagsToQuery = (tags) => {
  var params = "";
  tags.forEach((tag) => params += "&tags[]=" + tag);
  return params;
};

export { getQueryValue, arrayToString, dateToString, tagsToQuery };
