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
}

export { getQueryValue };
