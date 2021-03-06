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
  return arr.length > 0 ? str.substring(0, str.length - 1) : str;
}

const dateToString = (date) => {
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
};

const arrayToQuery = (tags, query) => {
  var params = "";
  tags.forEach((tag) => params += "&" + query + "[]=" + tag);
  return params;
};

const queryDateToString = (queryDate) => {
  var date = queryDate.split("-");
  return new Date(date[0], date[1], date[2]);
}

export { getQueryValue, arrayToString, dateToString, arrayToQuery, queryDateToString };
