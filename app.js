var express = require("express");
var bodyParser = require("body-parser");
require("body-parser-xml")(bodyParser);
var addRequestId = require("express-request-id")();

const multer = require("multer");
const multerS3 = require("multer-s3");
const uuid = require("uuid").v4;
const path = require("path");

var app = express();

app.use(addRequestId);
app.use(
  bodyParser.xml({
    limit: "1MB", // Reject payload bigger than 1 MB
    xmlParseOptions: {
      normalize: true, // Trim whitespace inside text nodes
      normalizeTags: true, // Transform tags to lowercase
      explicitArray: false, // Only put nodes in array if >1
    },
  })
);
// app.use(bodyParser());
app.use(express.static("publice"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const { originalname } = file;
    cb(null, `${originalname}`);
  },
});

const upload = multer({ storage });

app.post("/rest/upload", upload.single("file"), function (req, res) {
  return res.json({
    code: "0",
    data: {
      image: {
        hash_code: "61bdf049525b7d4c2cf79257ec7c2c56",
        url: `http://localhost:3002/rest/getImg/${req.file.filename}`,
      },
    },
    request_id: req.id,
  });
});

app.get("/rest/getImg/:img", function (req, res) {
  console.log(req.params.img);
  return res.sendFile(path.join(process.cwd(), "/uploads/" + req.params.img));
});

app.get("/", function (req, res) {
  const query = req.query.name;
  return res.json({ data: `${query}`, requestId: req.id });
});

app.post("/rest/create", function (req, res) {
  const body = req.body;
  const product = body;
  console.log(product);
  return res.json({
    code: 0,
    data: {
      item_id: "232611001",
      sku_list: [
        {
          shop_sku: "232611001_SGAMZ-356805001",
          seller_sku: "x",
          sku_id: "356805001",
        },
        {
          shop_sku: "232611001_SGAMZ-356805001",
          seller_sku: "x",
          sku_id: "356805001",
        },
      ],
    },
    requestId: req.id,
  });
});

app.put("/rest/update", function (req, res) {
  const body = req.body;
  const product = body;
  console.log(product.request.product.skus.sku);
  return res.json({
    code: "0",
    data: {},
    request_id: req.id,
  });
});

app.delete("/rest/delete/:skuid", function (req, res) {
  const sku_id = req.params.skuid;
  console.log(sku_id);

  return res.json({
    code: "0",
    data: {},
    request_id: req.id,
  });
});

var server = app.listen(3002, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Listening at http://%s:%s", host, port);
});
