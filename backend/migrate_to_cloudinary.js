require("dotenv").config();
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");
const Profile = require("./models/profile");
const Hiring = require("./models/hiring");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function migrate() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected!");

    // 1. Migrate Profiles
    console.log("\n--- Checking Profiles ---");
    // Find profiles where image has "localhost" or starts with "/images/"
    const profiles = await Profile.find({ 
      $or: [
        { image: { $regex: /localhost:4000\/images\// } },
        { image: { $regex: /^\/images\// } }
      ]
    });
    console.log(`Found ${profiles.length} profiles with local/localhost images.`);

    for (const profile of profiles) {
      const fileName = profile.image.split("/").pop(); // Get just the filename
      const filePath = path.join(__dirname, "upload", "images", fileName);

      if (fs.existsSync(filePath)) {
        console.log(`Uploading ${fileName} for profile: ${profile.name}...`);
        const result = await cloudinary.uploader.upload(filePath, {
          folder: "skillconnect_profiles",
        });
        
        profile.image = result.secure_url;
        await profile.save();
        console.log(`✅ Success: ${result.secure_url}`);
      } else {
        console.log(`❌ File missing locally: ${filePath}`);
      }
    }

    // 2. Migrate Hirings (Work Proofs)
    console.log("\n--- Checking Work Proofs ---");
    const hirings = await Hiring.find({ 
      $or: [
        { completionImage: { $regex: /localhost:4000\/images\// } },
        { completionImage: { $regex: /^\/images\// } }
      ]
    });
    console.log(`Found ${hirings.length} hirings with local/localhost images.`);

    for (const hiring of hirings) {
      const fileName = hiring.completionImage.split("/").pop(); // Get just the filename
      const filePath = path.join(__dirname, "upload", "images", fileName);

      if (fs.existsSync(filePath)) {
        console.log(`Uploading ${fileName} for hiring ID: ${hiring._id}...`);
        const result = await cloudinary.uploader.upload(filePath, {
          folder: "skillconnect_proofs",
        });
        
        hiring.completionImage = result.secure_url;
        await hiring.save();
        console.log(`✅ Success: ${result.secure_url}`);
      } else {
        console.log(`❌ File missing locally: ${filePath}`);
      }
    }

    console.log("\n✨ Migration complete! All your images are now on Cloudinary and will work on production.");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrate();
