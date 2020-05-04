// Get element with biggest value of property in array
exports.getMax = function getMax(arr, prop) {
  let max;
  for (let i = 0 ; i < arr.length ; i++) {
    if ( !max || parseInt(arr[i][prop]) > parseInt(max[prop]) )
      max = arr[i];
  };
  return max;
};