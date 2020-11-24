const logger = require("./loggers");

// Get element with biggest value of property in array
exports.getMax = function getMax(arr, prop) {
  let max;
  for (let i = 0 ; i < arr.length ; i++) {
    if ( !max || parseInt(arr[i][prop]) > parseInt(max[prop]) )
      max = arr[i];
  };
  return max;
};

// Return filter expression to get date for specified locale in specified input field
exports.localeFilter = function localeFilter(inputField, locale) {
  return {
    $reduce: {
      input: inputField,
      initialValue: "",
      in: {
        $cond: [{ $eq: ["$$this.locale", locale] }, "$$this.value", "$$value"]
      }
    }
  };
}

function supportedLocales() {
  return ['en', 'pl', 'ru', 'ar'];
}

// Return default locale if requested is not supported
exports.locale = function locale(locale) {
  if (supportedLocales().includes(locale)) {
    return locale;
  } else {
    return 'en';
  }
}