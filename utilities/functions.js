// Get element with biggest value of property in array
module.exports.getMax = function getMax(arr, prop) {
  var max;
  for (var i = 0 ; i < arr.length ; i++) {
    if ( !max || parseInt(arr[i][prop]) > parseInt(max[prop]) )
      max = arr[i];
  };
  return max;
};