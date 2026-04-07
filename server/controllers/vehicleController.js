const Vehicle = require('../models/Vehicle');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

// Helper to upload buffer to cloudinary
const uploadFromBuffer = (file) => {
  return new Promise((resolve, reject) => {
    let cld_upload_stream = cloudinary.uploader.upload_stream(
      {
        folder: 'dealer_inventory/vehicles',
        resource_type: file.mimetype.startsWith('video') ? 'video' : 'image'
      },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
    streamifier.createReadStream(file.buffer).pipe(cld_upload_stream);
  });
};

// @desc    Add a vehicle
// @route   POST /api/vehicles/add
// @access  Private
const addVehicle = async (req, res) => {
  try {
    const { title, brand, model, year, price, kmDriven, fuelType, transmission, description, status, location } = req.body;

    let imageUrls = [];
    let videoUrl = null;

    if (req.files) {
      // Handle images
      if (req.files.images) {
        const imagePromises = req.files.images.map((file) => uploadFromBuffer(file));
        const imageResults = await Promise.all(imagePromises);
        imageUrls = imageResults.map((result) => result.secure_url);
      }
      // Handle video
      if (req.files.video && req.files.video.length > 0) {
        const videoResult = await uploadFromBuffer(req.files.video[0]);
        videoUrl = videoResult.secure_url;
      }
    }

    const vehicle = await Vehicle.create({
      dealerId: req.dealer._id,
      title,
      brand,
      model,
      year: Number(year),
      price: Number(price),
      kmDriven: Number(kmDriven),
      fuelType,
      transmission,
      description,
      location,
      status: status || 'Available',
      images: imageUrls,
      video: videoUrl,
    });

    res.status(201).json({ success: true, data: vehicle });
  } catch (error) {
    console.error('Error adding vehicle:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all vehicles (with filters)
// @route   GET /api/vehicles
// @access  Public
const getVehicles = async (req, res) => {
  try {
    const { brand, fuelType, minPrice, maxPrice, dealerId, search } = req.query;

    const query = {};
    if (brand) query.brand = brand;
    if (fuelType) query.fuelType = fuelType;
    if (dealerId) query.dealerId = dealerId;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const vehicles = await Vehicle.find(query).populate('dealerId', 'name city whatsappNumber phone').sort('-createdAt');
    res.json({ success: true, count: vehicles.length, data: vehicles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single vehicle
// @route   GET /api/vehicles/:id
// @access  Public
const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate(
      'dealerId',
      'name email phone showroomName city whatsappNumber'
    );

    if (vehicle) {
      res.json({ success: true, data: vehicle });
    } else {
      res.status(404).json({ success: false, message: 'Vehicle not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a vehicle
// @route   PUT /api/vehicles/:id
// @access  Private
const updateVehicle = async (req, res) => {
  try {
    let vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    // Check if dealer owns the vehicle
    if (vehicle.dealerId.toString() !== req.dealer._id.toString()) {
      return res.status(401).json({ success: false, message: 'User not authorized to update this vehicle' });
    }

    vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: vehicle });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a vehicle
// @route   DELETE /api/vehicles/:id
// @access  Private
const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    // Authorization check
    if (vehicle.dealerId.toString() !== req.dealer._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "User not authorized to delete this vehicle",
      });
    }

    // ✅ PUBLIC ID EXTRACT FUNCTION (BEST VERSION)
    const extractPublicId = (url) => {
      try {
        const parts = url.split("/");
        const uploadIndex = parts.indexOf("upload");

        // upload ke baad ka path
        let publicId = parts.slice(uploadIndex + 1).join("/");

        // remove version (v12345/)
        publicId = publicId.replace(/^v\d+\//, "");

        // remove extension (.jpg/.png)
        publicId = publicId.replace(/\.[^/.]+$/, "");

        return publicId;
      } catch (err) {
        console.log("Public ID extract error:", err);
        return null;
      }
    };

    // =========================
    // 🔥 DELETE IMAGES
    // =========================
    if (vehicle.images && vehicle.images.length > 0) {
      for (const img of vehicle.images) {
        const imageUrl = typeof img === "string" ? img : img.url;

        // console.log("Image URL:", imageUrl);

        const publicId = extractPublicId(imageUrl);
        console.log("Public ID:", publicId);

        if (publicId) {
          const result = await cloudinary.uploader.destroy(publicId);
          // console.log("Delete result:", result);
        }
      }
    }

    // =========================
    // 🔥 DELETE VIDEO
    // =========================
    if (vehicle.video) {
      const videoUrl =
        typeof vehicle.video === "string"
          ? vehicle.video
          : vehicle.video.url;

      const publicId = extractPublicId(videoUrl);
      console.log("Video Public ID:", publicId);

      if (publicId) {
        const result = await cloudinary.uploader.destroy(publicId, {
          resource_type: "video",
        });
        // console.log("Video delete result:", result);
      }
    }

    // =========================
    // 🔥 DELETE FROM DB
    // =========================
    await vehicle.deleteOne();

    return res.json({
      success: true,
      message: "Vehicle and all media deleted successfully",
    });
  } catch (error) {
    console.error("Delete Vehicle Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// @desc    Delete multiple vehicles
// @route   POST /api/vehicles/bulk-delete
// @access  Private
const deleteMultipleVehicles = async (req, res) => {
  try {
    const { vehicleIds } = req.body;

    if (!vehicleIds || !Array.isArray(vehicleIds) || vehicleIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No vehicle IDs provided",
      });
    }

    const vehicles = await Vehicle.find({ _id: { $in: vehicleIds } });

    // Authorization check
    for (const vehicle of vehicles) {
      if (vehicle.dealerId.toString() !== req.dealer._id.toString()) {
        return res.status(401).json({
          success: false,
          message: "User not authorized to delete some of these vehicles",
        });
      }
    }

    const extractPublicId = (url) => {
      try {
        const parts = url.split("/");
        const uploadIndex = parts.indexOf("upload");
        let publicId = parts.slice(uploadIndex + 1).join("/");
        publicId = publicId.replace(/^v\d+\//, "");
        publicId = publicId.replace(/\.[^/.]+$/, "");
        return publicId;
      } catch (err) {
        console.log("Public ID extract error:", err);
        return null;
      }
    };

    for (const vehicle of vehicles) {
      if (vehicle.images && vehicle.images.length > 0) {
        for (const img of vehicle.images) {
          const imageUrl = typeof img === "string" ? img : img.url;
          const publicId = extractPublicId(imageUrl);
          if (publicId) {
            await cloudinary.uploader.destroy(publicId);
          }
        }
      }

      if (vehicle.video) {
        const videoUrl = typeof vehicle.video === "string" ? vehicle.video : vehicle.video.url;
        const publicId = extractPublicId(videoUrl);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
        }
      }

      await vehicle.deleteOne();
    }

    return res.json({
      success: true,
      message: "Vehicles deleted successfully",
    });
  } catch (error) {
    console.error("Bulk Delete Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  deleteMultipleVehicles,
};
