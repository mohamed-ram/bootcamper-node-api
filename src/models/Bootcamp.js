const mongoose = require("mongoose");
const slugify = require("slugify");
const geocoder = require("../utils/geocoder");

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
      },
      coordenates: {
        type: [Number],
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// create bootcamp slug.
bootcampSchema.pre("save", function (next) {
  const bootcamp = this;
  bootcamp.slug = slugify(bootcamp.name, { lower: true });
  next();
});

// geocode & create location field.
bootcampSchema.pre("save", async function (next) {
  const bootcamp = this;
  const loc = await geocoder.geocode(bootcamp.address);
  bootcamp.location = {
    type: "Point",
    coordenates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    zipcode: loc[0].zipcode,
    country: loc[0].country,
  };
  next();
});

// cascade deleting bootcamp
bootcampSchema.pre("remove", async function (next) {
  await this.model("Course").deleteMany({ bootcamp: this._id });
  next();
});

// reverse populate
bootcampSchema.virtual("courses", {
  ref: "Course",
  localField: "_id",
  foreignField: "bootcamp",
  justOne: false,
});

const Bootcamp = new mongoose.model("Bootcamp", bootcampSchema);

module.exports = Bootcamp;
