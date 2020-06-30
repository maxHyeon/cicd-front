const express = require('express');
const app = express();
const port = 3000;

// Add static
app.use(express.static('public'));

// Port binding
app.listen(port, function() {
  console.log(`Cloud Adademy front app listening on port ${port}`);
});
