const mongoose = require("mongoose");

const partSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: { type: String, required: true }, // store only image path or URL
});

module.exports = mongoose.model("Part", partSchema);
