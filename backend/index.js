const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const Profile = require("./models/profile.js");

const defaultPhoneNumber = (name) => {
  const base = 7000000000;
  const text = String(name || "skillconnect");
  let hash = 0;

  for (const char of text) {
    hash = (hash * 31 + char.charCodeAt(0)) % 1000000000;
  }

  return base + hash;
};

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://rakeshmundel000_db_user:lukDyMAU0PfUkmlo@skilhirehub.eimjdvo.mongodb.net/?appName=SkilHireHub");

app.get("/", (req, res) => {
  res.send("Express App is running");
});

const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

app.use("/images", express.static("upload/images"));

app.post("/upload", upload.single("profile"), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`
  });
});

app.post("/addprofile", async (req, res) => {
  const profile = new Profile({
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    description: req.body.description,
    skills: req.body.skills,
    experience: req.body.experience,
    certificate: req.body.certificate,
    location: req.body.location,
    owner: req.body.owner,
    phone: req.body.phone || defaultPhoneNumber(req.body.name)
  });

  await profile.save();

  res.json({
    success: true,
    name: req.body.name
  });
});

app.post("/fill-missing-phones", async (req, res) => {
  const profiles = await Profile.find({
    $or: [
      { phone: { $exists: false } },
      { phone: null }
    ]
  });

  let updated = 0;

  for (const profile of profiles) {
    await Profile.updateOne(
      { _id: profile._id },
      { $set: { phone: defaultPhoneNumber(profile.name) } }
    );
    updated += 1;
  }

  res.json({ success: true, updated });
});

app.post("/removeprofile", async (req, res) => {
  await Profile.findOneAndDelete({ id: req.body.id });
  res.json({
    success: true,
    name: req.body.name
  });
});

app.get("/allprofiles", async (req, res) => {
  const profiles = await Profile.find({});
  res.send(profiles);
});

app.get("/topprofessional", async (req, res) => {
  const profiles = await Profile.find({});
  res.send(profiles);
});

app.get("/search", async (req, res) => {
  const query = (req.query.query || "").trim();
  const location = (req.query.location || "").trim();

  if (!query && !location) {
    return res.json([]);
  }

  const filters = [];

  if (query) {
    filters.push({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { location: { $regex: query, $options: "i" } },
        { skills: { $regex: query, $options: "i" } }
      ]
    });
  }

  if (location) {
    filters.push({
      location: { $regex: location, $options: "i" }
    });
  }

  const profiles = await Profile.find(
    filters.length === 1 ? filters[0] : { $and: filters }
  );

  res.json(profiles);
});

app.get("/propage/:id", async (req, res) => {
  const profile = await Profile.findById(req.params.id);
  res.json(profile);
});

app.put("/updateprofile/:id", async (req, res) => {
  await Profile.findByIdAndUpdate(req.params.id, req.body);
  res.json({ success: true });
});

app.listen(port, (error) => {
  if (!error) {
    console.log("Server is running on port " + port);
  } else {
    console.log("Error:" + error);
  }
});
