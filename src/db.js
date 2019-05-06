const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/jwt-simple', {
  useNewUrlParser: true
});
