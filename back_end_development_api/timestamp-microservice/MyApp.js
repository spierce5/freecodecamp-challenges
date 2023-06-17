const cors = require('cors');
let express = require('express');
let app = express();
const port = process.env.PORT || 3000;

const publicDir = __dirname + '/public';
app.use("/public", express.static(publicDir));
app.use(cors({
    origin: '*'
}));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/home.html')
})

app.get('/api/:inputTime', (req, res) => {
  let inputTime = req.params.inputTime;
  if (/^-?\d+$/.test(req.params.inputTime)) {
    inputTime = Number.parseInt(inputTime);
  }
  let date = new Date(inputTime);
  if (date instanceof Date && !isNaN(date)) {
    res.json({
    'unix': date.getTime(),
    'utc': date.toUTCString()
  })
  } else {
    res.json({ error : "Invalid Date" })
  }
})

app.get('/api', (req, res) => {
  res.json({
    'unix': new Date().getTime(),
    'utc': new Date().toUTCString()
  })
})

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next()
});

app.listen(port, () => {
  console.log(`Node listening on port ${port}`)
})

module.exports = app;