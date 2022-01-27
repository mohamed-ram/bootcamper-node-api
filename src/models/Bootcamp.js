const mongoose = require("mongoose");

const bootcampSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please insert a bootcamp name."],
      unique: true,
      trim: true,
      maxlength: [50, "Name can not be more that 50 characters."],
    },
    slug: String,
    description: {
      type: String,
      required: [true, "Please insert a description"],
      maxlength: [500, "Description can not be more than 500 characters."],
    },
    website: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        "Please insert a valid URL with http or https.",
      ],
    },
    phone: {
      type: String,
      maxlength: [20, "Phone number can not be more than 20 characters."],
    },
    email: {
      type: String,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please insert a valid email.",
      ],
    },
    address: {
      type: String,
      required: [true, "Please add an address."],
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        // required: true,
      },
      coordenates: {
        type: [Number],
        // required: true,
        index: "2dsphere",
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
    },
    careers: {
      type: [String],
      required: true,
      enum: [
        "Web Development",
        "Mobile development",
        "UI/UX",
        "Data science",
        "Business",
        "Other",
      ],
    },
    averageRating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [10, "Rating can not be more than 10"],
    },
    averageCost: {
      type: Number,
    },
    photo: {
      type: String,
      default: "no-image.jpg",
    },
    housing: {
      type: Boolean,
      default: false,
    },
    jobAssistance: {
      type: Boolean,
      default: false,
    },
    jobGarantee: {
      type: Boolean,
      default: false,
    },
    acceptGi: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Bootcamp = new mongoose.model("Bootcamp", bootcampSchema);

module.exports = Bootcamp;
