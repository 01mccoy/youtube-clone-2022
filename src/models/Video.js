import mongoose from "mongoose";

// hashtags 는 POST 로 req.body 로 넘어갈 때 join 되어서 나오므로 [String] 형태
const formatHashTags = (hashtags) =>
  hashtags[0]
    .split(",")
    .map((word) => word.trim())
    .map((word) => (word.startsWith("#") ? word : `#${word}`));

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: 40,
    default: "no title",
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxLength: 500,
    default: ".",
  },
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
});

videoSchema.pre("save", async function () {
  this.hashtags = formatHashTags(this.hashtags);
});

// Video.findByIdAndUpdate() 로 업데이트 되는 데이터는 "save" 를 부르지 않음
// 업데이트 시에는 findOneAndUpdate 이벤트를 촉발
videoSchema.pre("findOneAndUpdate", async function () {
  this._update.hashtags = formatHashTags(Array(this._update.hashtags));
  // save 이벤트에서의 this.hashtags 는 [""] 형태인데
  // this._update.hashtags 는 "" 형태임...
  //? 왜 둘이 형태가 다르지??
});

const Video = mongoose.model("Video", videoSchema);

export default Video;
