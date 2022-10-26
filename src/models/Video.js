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
  this._update.hashtags = formatHashTags(this._update.hashtags);

  // 그냥 this.hashtags 를 쓰면 안됨
  // save 이벤트가 보내주는 this 와 findOneAndUpdate 가 보내주는 this 는 구조가 다름
  // this(document) 를 얻어오려면 아래와 같이 해야 함
  // 코드가 매우 길어져서 비추
  // const docToUpdate = await this.model.findOne(this.getQuery());

  /* 
  그냥 const hashtags = docToUpdate.hashtags 로 얻어와서 바꾸면
  hashtags 변수는 read-only 라서 바꿀 수 없다고 나옴.
  doc 외부로 빠져나온 변수는 변환이 불가능한가봄...
  그래서 그냥 얻어온 doc 으로 써야 함.
  */

  // docToUpdate.hashtags = await docToUpdate.hashtags[0]
  //   .split(",")
  //   .map((word) => word.trim())
  //   .map((word) => (word.startsWith("#") ? word : `#${word}`));

  // this.set 으로 세팅 안해주면 로컬 변수만 바뀌는 꼴!
  //this.set({ hashtags: docToUpdate.hashtags });
});

const Video = mongoose.model("Video", videoSchema);

export default Video;
