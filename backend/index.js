require("dotenv").config();
const port = process.env.PORT || 4000;
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const multer=require("multer");
const path=require("path");
const cors=require("cors");
const Profile=require("./models/profile.js");

app.use(express.json());
app.use(cors());


//Database Connection with MongoDB
mongoose.connect(process.env.MONGODB_URI)

//API Creation
app.get("/",(req,res)=>{
    res.send("Express App is running");
})

const storage=multer.diskStorage({
    destination:'./upload/images',
    filename:(req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload=multer({storage:storage})

//Creating Upload Endpoint for images
app.use('/images',express.static('upload/images'))

app.post("/upload",upload.single('profile'),(req,res)=>{
    res.json({
        success:1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`
    })
})

app.post('/addprofile',async (req,res)=>{
    const profile=new Profile({
        name:req.body.name,
    image:req.body.image,
    category:req.body.category,
    description:req.body.description,
    skills:req.body.skills,
    experience:req.body.experience,
    certificate:req.body.certificate,
    location:req.body.location,
    owner: req.body.owner,
    phone:req.body.phone
  });
  console.log(profile);
  await profile.save();
  console.log("Saved");
  res.json({
    success:true,
    name:req.body.name,
  
    })
})

app.post('/removeprofile', async (req, res) => {
  await Profile.findOneAndDelete({ id: req.body.id });
  console.log("Removed");
  res.json({
    success: true,
    name: req.body.name
  });
});

//Creating API for getting all products
app.get('/allprofiles',async(req,res)=>{
    let profiles=await Profile.find({});
    console.log("All Profiles Fetched");
    res.send(profiles);
})


//creating endpoint for new Collection data
/*app.get('/newcollection',async(req,res)=>{
    let products=await Product.find({});
    let newcollection=products.slice(1).slice(-8);
    console.log ("new Collection fetched");
    res.send(newcollection);
})
*/
//creating endpoint for the popular in women Category
app.get('/topprofessional',async(req,res)=>{
    let profiles=await Profile.find({});
    let top_professional=profiles.slice(0,9);
    console.log ("Top Professional fetched");
    res.send(profiles);
})

app.get("/search", async (req, res) => {
  const query = req.query.query;   // ✅ THIS LINE WAS MISSING

  if (!query) {
    return res.json([]);
  }

  const profiles = await Profile.find({
    $or: [
      { name: { $regex: query, $options: "i" } },
      { category: { $regex: query, $options: "i" } },
      { location: { $regex: query, $options: "i" } },
      { skills: { $regex: query, $options: "i" } }
    ]
  });

  res.json(profiles);
});



// get listing
app.get("/propage/:id", async (req, res) => {
  const profile = await Profile.findById(req.params.id);
  res.json(profile);
});

// update listing
app.put("/updateprofile/:id", async (req, res) => {
  await Profile.findByIdAndUpdate(req.params.id, req.body);
  res.json({ success: true });
});

 

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Payment Session Creation
app.post("/create-checkout-session", async (req, res) => {
  const { profileId, name, price } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Hiring ${name}`,
            },
            unit_amount: price * 100, // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:5173/success`,
      cancel_url: `http://localhost:5173/cancel`,
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Seed endpoint for demo data
app.get('/seed', async (req, res) => {
  const demoProfiles = [
    {
      name: "Alex Johnson",
      image: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400",
      category: "Plumber",
      description: "Expert plumber with 10 years of experience in leak repairs and installations.",
      owner: "admin_seed_1",
      location: "San Francisco, CA",
      phone: 1234567890,
      price: 45,
      skills: "Pipe Fitting, Leak Detection, Solar Water Heater",
      experience: 10,
      certificate: "Licensed Master Plumber"
    },
    {
      name: "Sarah Chen",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
      category: "Software Developer",
      description: "Full-stack developer specializing in React, Node.js, and scaling web applications.",
      owner: "admin_seed_2",
      location: "Seattle, WA",
      phone: 2345678901,
      price: 85,
      skills: "React, MongoDB, Node.js, AWS",
      experience: 6,
      certificate: "AWS Certified Developer"
    },
    {
      name: "Michael Smith",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
      category: "Electrician",
      description: "Residential electrician focused on smart home installations and power upgrades.",
      owner: "admin_seed_3",
      location: "Austin, TX",
      phone: 3456789012,
      price: 60,
      skills: "Smart Home, Wiring, Circuit Repair",
      experience: 8,
      certificate: "Journeyman Electrician"
    }
  ];

  try {
    await Profile.deleteMany({ owner: { $regex: 'admin_seed' } }); // Clean old seed data
    await Profile.insertMany(demoProfiles);
    res.json({ message: "Database seeded successfully with 3 profiles!", count: demoProfiles.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port,(error)=>{
    if(!error){
        console.log("Server is running on port "+port);
    }
    else{
        console.log("Error:"+error);
    }
});