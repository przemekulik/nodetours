var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var auth = require('basic-auth');

app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//////////////////////////////
//// Search API - Cruises ////
//////////////////////////////

// GET / (root)
//// Przemek - WORKING
app.get('/', function (req, res) {
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.write(JSON.stringify({Application: "NodeTours", Version: '1.0', Host: host, Port: port}));
  res.end();
});


// GET /cruises
//// Przemek - WORKING
//// TODO: Add HTTP 400 for bad request (bad filters)
app.get('/cruises', function (req, res) {
  getCruiseData(function (err, cruises) {
    if (err) {
      console.log("GET /cruises : Error reading cruise file");
      console.log(err);
    } else {
      // Rread query-string params || default when not passed
      var startDate = req.query.startDate || "0";
      var endDate = req.query.endDate || "99999999";
      var startPort = req.query.startPort || "";
      var numDays = req.query.numDays || "99999999";
      // Apply filtering based on query string params
      cruises = cruises.filter(function(cruise) {
        // Find matching cruise
        return cruise.numDays <= numDays && cruise.startDate >= startDate && cruise.endDate <= endDate && cruise.startPort.includes(startPort);
      });

      // If no cruises found return HTTP 400 Bad request
      if (typeof cruises !== 'undefined') {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(cruises, null, 3));
      } else {
        res.writeHead(204, {'Content-Type': 'application/json'});
        res.write(JSON.stringify({"Status": "Success", "Message": "No cruises"}, null, 3));
      };
      res.end();
    };
  });
});

// GET /cruises/{cruiseID}
//// Przemek - WORKING
app.get('/cruises/:cruiseID', function (req, res) {
  getCruiseData(function (err, cruises) {
    if (err) {
      console.log("GET /cruises/{cruiseID} : Error reading cruise file");
      console.log(err);
    } else {
      var cruise = cruises.filter(function(cruise) {
        // Find matching cruise
        return cruise.cruiseID == req.params.cruiseID;
      });
      if (typeof cruise[0] !== 'undefined') {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(cruise, null, 3));
      } else {
        res.writeHead(204, {'Content-Type': 'application/json'});
        res.write(JSON.stringify({"Invalid or not existing cruise ID": req.params.cruiseID}, null, 3));
      };
      res.end();
    };
  });
});

/////////////////////////////////
//// Sign-up API - customers ////
/////////////////////////////////

// POST /customer
//// Przenek - WORKING
app.post('/customer', function (req, res) {
  getCustomerData(function (err, customers) {
    if (err) {
      console.log("POST /customer : Error reading customer file");
      console.log(err);
    } else {
      var existingCustomer = false;
      // Find matching customer and update it
      for (i = 0; i < customers.length; i++) {
        if (customers[i].customer.emailAddress == req.body.customer.emailAddress) {
          existingCustomer = true;
          break;
        };
      };
    };
    if (!existingCustomer) {
      customers.push(req.body);
      writeCustomerData(customers, function (err, result) {
        if (err) {
          console.log("POST /customer : Error writing customer file");
          console.log(err);
          res.writeHead(500, {'Content-Type': 'application/json'});
          res.write(JSON.stringify({"Status": "Error saving customer data"}, null, 3));
        } else {
          // All OK
          res.writeHead(201, {'Content-Type': 'application/json'});
          res.write(JSON.stringify({"Status": "Success", "Successfuly created customer with ID": req.body.customer.emailAddress}, null, 3));
        };
        res.end();
      });
    } else {
      // Existing customer
      res.writeHead(400, {'Content-Type': 'application/json'});
      res.write(JSON.stringify({"Status": "Error", "Invalid or not existing customer ID": req.body.customer.emailAddress}, null, 3));
      res.end();
    };
  });
});

// GET /customer/{customerID}
//// Przemek - WORKING
app.get('/customer/:customerID', function (req, res) {
  checkUser(req, function (user) {
    // Call checkUser function passing request payload that should contain Authorization header
    if (user.isValid) { // User is valid
      getCustomerData(function (err, customers) {
        if (err) {
          console.log("GET /customer/{customerID} : Error reading customer file");
          console.log(err);
        } else {
          var existingCustomer = false;
          for (i = 0; i < customers.length; i++) {
            if (customers[i].customer.emailAddress == req.params.customerID) {
              var existingCustomer = true;
              var customer = customers[i];
              res.writeHead(200, {'Content-Type': 'application/json'});
              res.write(JSON.stringify(customer, null, 3));
              break;
            }; 
          };
          if (!existingCustomer) {
            res.writeHead(400, {'Content-Type': 'application/json'});
            res.write(JSON.stringify({"Status": "Error", "Invalid customer ID": req.params.customerID}, null, 3));
          };
          res.end();
        };
      });
    } else { // Not a valid user
      res.writeHead(401, "You need some creds, son...", {'Content-Type': 'application/json'});
      res.write(JSON.stringify({"Status": "Error", "Message": "You need some creds, son..."}, null, 3));
      res.end();
    };
  });
});

// PUT /customer/{customerID}
//// Przemek - WORKING
//// FIXME: allow updating of own record only
//// TODO: add admin right support
app.put('/customer/:customerID', function (req, res) {
  checkUser(req, function (user) {
    if (user.isValid) {
      getCustomerData(function (err, customers) {
        if (err) {
          console.log("PUT /customer/{customerID} : Error reading customer file");
          console.log(err);
        } else {
          var existingCustomer = false;
          // Find matching customer and update it
          for (i = 0; i < customers.length; i++) {
            if (customers[i].customer.emailAddress == req.params.customerID) {
              customers[i] = req.body;
              existingCustomer = true;
              break;
            };
          };
        };
        if (existingCustomer) {
          writeCustomerData(customers, function (err, result) {
            if (err) {
              console.log("PUT /customer/{customerID} : Error writing customer file");
              console.log(err);
              res.writeHead(500, {'Content-Type': 'application/json'});
              res.write(JSON.stringify({"Status": "Error saving customer data"}, null, 3));
            } else {
              // All OK
              res.writeHead(200, {'Content-Type': 'application/json'});
              res.write(JSON.stringify({"Status": "Success", "Successfuly updated customer with ID": req.params.customerID}, null, 3));
            };
            res.end();
          });
        } else {
          // No such customer
          res.writeHead(400, {'Content-Type': 'application/json'});
          res.write(JSON.stringify({"Status": "Error", "Invalid or not existing customer ID": req.params.customerID}, null, 3));
          res.end();
        };
      });
    } else {
      res.writeHead(401, "You need some creds, son...", {'Content-Type': 'application/json'});
      res.write(JSON.stringify({"Status": "Error", "Message": "You need some creds, son..."}, null, 3));
      res.end();
    };
  });
});

// DELETE /customer/{customerID}
//// Przemek - WORKING
//// FIXME: allow delete of own customer record only w /403
//// TODO: add admin rights support 
app.delete('/customer/:customerID', function (req, res) {
  checkUser(req, function (user) {
    if (user.isValid) {
      getCustomerData(function (err, customers) {
        if (err) {
          console.log("DELETE /customer/{customerID} : Error reading customer file");
          console.log(err);
        } else {
          var existingCustomer = false;
          for (let i = 0; i < customers.length; i++) {
            if (customers[i].customer.emailAddress == req.params.customerID) {
              customers.splice(i, 1);
              existingCustomer = true;
              break;
            };            
          };
        };
        if (existingCustomer) {
          writeCustomerData(customers, function (err, result) {
            if (err) {
              console.log("DELETE /customer/{customerID} : Error writing customer file");
              console.log(err);
              res.writeHead(500, {'Content-Type': 'application/json'});
              res.write(JSON.stringify({"Status": "Error saving customer data"}, null, 3));
            } else {
              res.writeHead(200, {'Content-Type': 'application/json'});
              res.write(JSON.stringify({"Status": "Success", "Successfuly deleted customer with ID": req.params.customerID}, null, 3));
            };
            res.end();
          });
        } else {
          res.writeHead(400, {'Content-Type': 'application/json'});
          res.write(JSON.stringify({"Status": "Error", "Invalid or not existing customer ID": req.params.customerID}, null, 3));
          res.end();
        }
      });
    } else {
      res.writeHead(401, "You need some creds, son...", {'Content-Type': 'application/json'});
      res.write(JSON.stringify({"Status": "Error", "Message": "You need some creds, son..."}, null, 3));
      res.end();
    };
  });
});

//////////////////////////////////
//// Bookings API - bookings  ////
//////////////////////////////////

// GET /bookings
//// Przemek - WORKING
app.get('/bookings', function (req, res) {
  checkUser(req, function (user) {
    if (user.isValid) {
      getBookingData( function (err, bookings) {
        if (err) {
          console.log("GET /bookings : Error reading customer file");
          console.log(err);
        } else {
          bookings = bookings.filter(function(booking) {
            return booking.customerID == user.name;
          });
        };
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(bookings, null, 3));
        res.end();
      });
    } else {
      res.writeHead(401, "You need some creds, son...", {'Content-Type': 'application/json'});
      res.write(JSON.stringify({"Status": "Error", "Message": "You need some creds, son..."}, null, 3));
      res.end();
    };
  });
});

// POST /bookings
//// Przemek - WORKING
//// TODO: fix for 400 when booking fails (when?)
app.post('/bookings', function (req, res) {
  checkUser(req, function (user) {
    if (user.isValid) {
      getBookingData( function (err, bookings) {
        if (err) {
          console.log("POST /bookings : Error reading customer file");
          console.log(err);
        } else {
          // Construct boking record
          //FIXME: allow booking only for logged in customer
          var newBooking = {
            "bookingID": parseInt(maxBookingID) + 1,
            "cruiseID": req.body.cruiseID,            
            "customerID": req.body.person[0].emailAddress, // first Customer as the one making booking
            "room": req.body.room,
            "person": req.body.person
          };

          // Parse existing file/data, add POST new booking to existing bookings array and save file
          bookings.push(newBooking);
          // Store last booking OD
          maxBookingID++;
          //console.log("Registered a booking. Last booking ID: " + maxBookingID);

          writeBookingData(bookings, function (err, result) {
            if (err) {
              console.log("POST /bookings : Error writing booking file");
              console.log(err);
              res.writeHead(500, {'Content-Type': 'application/json'});
              res.write(JSON.stringify({"Status": "Error saving bookings data"}, null, 3));
            } else {
              res.writeHead(201, {'Content-Type': 'application/json'});
              res.write(JSON.stringify(newBooking, null, 3));
            };
            res.end();
          })
        };
      });
    } else {
      res.writeHead(401, "You need some creds, son...", {'Content-Type': 'application/json'});
      res.write(JSON.stringify({"Status": "Error", "Message": "You need some creds, son..."}, null, 3));
      res.end();
    };
  });
});

// GET /bookings/{bookingID}
//// Przemek - WORKING
app.get('/bookings/:bookingID', function (req, res) {
  checkUser(req, function (user) {
    if (user.isValid) {
      getBookingData( function (err, bookings) {
        if (err) {
          console.log("GET /bookings/{bookingID} : Error reading customer file");
          console.log(err);
        } else {
          //FIXME: return only if booking belongs to current user
          booking = bookings.filter(function(booking) {
            return booking.bookingID == req.params.bookingID
            //return booking.customerID == user.name;
          });
        };
        // If no booking found return HTTP 204 No Content
        if (typeof booking[0] !== 'undefined') {
          res.writeHead(200, {'Content-Type': 'application/json'});
          res.write(JSON.stringify(booking, null, 3));
        } else {
          // Original SAGTours had 404 here
          res.writeHead(400, {'Content-Type': 'application/json'});
          res.write(JSON.stringify({"Status": "Error", "Invalid booking ID": req.params.bookingID}, null, 3));
        };
        res.end();
      });
    } else {
      res.writeHead(401, "You need some creds, son...", {'Content-Type': 'application/json'});
      res.write(JSON.stringify({"Status": "Error", "Message": "You need some creds, son..."}, null, 3));
      res.end();
    };
  });
});

// PUT /bookings/{bookingID}
app.put('/bookings/:bookingID', function (req, res) {
  checkUser(req, function (user) {
    if (user.isValid) {
      getBookingData(function (err, bookings) {
        if (err) {
          console.log("PUT /bookings/{bookingID} : Error reading booking file");
          console.log(err);
        } else {
          // Construct boking record
          //FIXME: return only if booking belongs to current user
          var updatedBooking = {
            "bookingID": parseInt(req.params.bookingID),
            "cruiseID": req.body.cruiseID,
            "customerID": req.body.person[0].emailAddress, // first Customer as the one making booking
            "room": req.body.room,
            "person": req.body.person
          };
          // Parse existing file
          // Loop over it and update matching booking with PUT body data
          var existingBooking = false;
            for (var i = 0; i < bookings.length; i++) {
              if (bookings[i].bookingID == req.params.bookingID) {
                bookings[i] = updatedBooking;
                existingBooking = true;
                break;
              };
            };
        };
        if (existingBooking) {
          writeBookingData(bookings, function (err, result) {
            if (err) {
              console.log("PUT /bookings/{bookingID} : Error writing booking file");
              console.log(err);
              res.writeHead(500, {'Content-Type': 'application/json'});
              res.write(JSON.stringify({"Status": "Error saving booking data"}, null, 3));
            } else {
              // All OK
              res.writeHead(200, {'Content-Type': 'application/json'});
              res.write(JSON.stringify({"Status": "Success", "Successfuly updated booking with ID": req.params.bookingID}, null, 3));
            };
            res.end();
          });
        } else {
          // No such booking
          res.writeHead(400, {'Content-Type': 'application/json'});
          res.write(JSON.stringify({"Status": "Error", "Invalid or not existing booking ID": req.params.bookingID}, null, 3));
          res.end();
        };
      });
    } else {
      res.writeHead(401, "You need some creds, son...", {'Content-Type': 'application/json'});
      res.write(JSON.stringify({"Status": "Error", "Message": "You need some creds, son..."}, null, 3));
      res.end();
    };
  });
});

// DELETE /bookings/{bookingID}
//// Przemek - WORKING
app.delete('/bookings/:bookingID', function (req, res) {
  checkUser(req, function (user) {
    if (user.isValid) {
      getBookingData(function (err, bookings) {
        if (err) {
          console.log("DELETE /bookings/{bookingID} : Error reading booking file");
          console.log(err);
        } else {
          var existingBooking = false;
          for (i = 0; i < bookings.length; i++) {
            //FIXME: allow deleting of on record only
            if (bookings[i].bookingID == req.params.bookingID) {
              bookings.splice(i, 1);
              existingBooking = true;
              break;
            };            
          };
        };
        if (existingBooking) {
          writeBookingData(bookings, function (err, result) {
            if (err) {
              console.log("DELETE /bookings/{bookingID} : Error writing booking file");
              console.log(err);
              res.writeHead(500, {'Content-Type': 'application/json'});
              res.write(JSON.stringify({"Status": "Error saving booking data"}, null, 3));
            } else {
              res.writeHead(200, {'Content-Type': 'application/json'});
              res.write(JSON.stringify({"Status": "Success", "Successfuly deleted booking with ID": req.params.bookingID}, null, 3));
            };
            res.end();
          });
        } else {
          res.writeHead(400, {'Content-Type': 'application/json'});
          res.write(JSON.stringify({"Status": "Error", "Invalid or not existing boooking ID": req.params.bookingID}, null, 3));
          res.end();
        }
      });
    } else {
      res.writeHead(401, "You need some creds, son...", {'Content-Type': 'application/json'});
      res.write(JSON.stringify({"Status": "Error", "Message": "You need some creds, son..."}, null, 3));
      res.end();
    };
  });
});

//////////////////////////
//// Global functions ////
//////////////////////////

// Check user
// Reads The Authorization header for basic auth, chckes if username exists in customers.json file 
function checkUser (creds, callback) {
  var user = {
    name: "",
    pass: "",
    isValid: false,
    isAdmin: false
  };
  getCustomerData(function (err, data) {
    if (err) {
      console.log("Check user / getCustomerData : Error getting customer data");
      console.log(err);
      callback(err, isValidUser);
    } else {
      var userCreds = auth(creds);
      if (typeof userCreds !== 'undefined') {
        var users = data;
        user.name = userCreds.name;
        user.pass = userCreds.pass;
        for (i = 0; i < users.length; i++) {         
          if (users[i].customer.emailAddress == userCreds.name && "manage" == userCreds.pass) {
            // password hardcoded - sorry...
            user.isValid = true;
            //FIXME: store and read admin info from the file
            //user.isAdmin = user.customer.isAdmin;
            if (userCreds.name == "Administrator") {
              user.isAdmin = true;
            };  
          };
        };
      };
    };
    callback(user);
  });
};

// Get customer data
function getCustomerData(callback) {
  var customerData;
  fs.readFile(__dirname + "/data/" + "customers.json", "utf8", function (err, data) {
    if (err) {
      console.log("getCustomerData : Error reading customer file");
      console.log(err);
      callback(err, null);
    } else {
      if (data.length == 0) {
        data = "[]";
      };
      var customerData = JSON.parse(data);
      callback(null, customerData);
    };
  });
};

// Write customer data
function writeCustomerData(customer, callback) {
  fs.writeFile(__dirname + "/data/" + "customers.json", JSON.stringify(customer, null, 3), "utf8", function(err) {
    if (err) {
      console.log("writeCustomerData : Error writing customer file");
      console.log(err);
      callback(err);
    } else {
      callback(null);
    };
  });
};

// Get booking data
function getBookingData(callback) {
  var bookingData;
  fs.readFile(__dirname + "/data/" + "bookings.json", "utf8", function (err, data) {
    if (err) {
      console.log("getBookingData : Error reading booking file");
      console.log(err);
      callback(err, null);
    } else {
      if (data.length == 0) {
        data = "[]";
      };
      var bookingData = JSON.parse(data);
      callback(null, bookingData);
    };
  });
};

// Write booking data
function writeBookingData(booking, callback) {
  fs.writeFile(__dirname + "/data/" + "bookings.json", JSON.stringify(booking, null, 3), "utf8", function(err) {
    if (err) {
      console.log("writeBookingData : Error writing booking file");
      console.log(err);
      callback(err);
    } else {
      callback(null);
    };
  });
};

// Get cruise data
function getCruiseData(callback) {
  var cruiseData;
  fs.readFile(__dirname + "/data/" + "cruises.json", "utf8", function (err, data) {
    if (err) {
      console.log("getCruiseData : Error reading cruises file");
      console.log(err);
      callback(err, null);
    } else {
      if (data.length == 0) {
        data = "[]";
      };
      var cruiseData = JSON.parse(data);
      callback(null, cruiseData);
    };
  });
};

// Get element if biggest value of property in array
function getMax(arr, prop) {
  var max;
  for (var i = 0 ; i < arr.length ; i++) {
    if ( !max || parseInt(arr[i][prop]) > parseInt(max[prop]) )
      max = arr[i];
  };
  return max;
};

//////////////////////////
////      Server      ////
//////////////////////////

// Start server and initialize stuff
var server = app.listen(process.env.PORT || 7777, function () {
  host = require('os').hostname();
  port = server.address().port;
  console.log("NodeTours app listening at http://%s:%s", host, port)

  // Get max existing booking ID
  maxBookingID = 0;
  fs.readFile(__dirname + "/data/" + "bookings.json", 'utf8', function (err, data) {
    if (err) {
      console.log("Server : Error reading booking file");
      console.log(err);
      res.writeHead(404, {'Content-Type': 'text/plain'});
    }
    if (data.length == 0) {
      maxBookingID = 0;
    } else {
      var bookings = JSON.parse(data);
      var lastBookingID = getMax(bookings, "bookingID");
      var bookingsCount = Object.keys(bookings).length;
      maxBookingID = lastBookingID.bookingID;
      
    };
    console.log("Last booking ID: " + maxBookingID);
    console.log("Bookings count: " + bookingsCount);
  });
});