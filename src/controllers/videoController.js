import Video from "../models/Video";

export const home = async (req, res) => {
  const videos = await Video.find({}).sort({ createdAt: "desc" });
  return res.render("home.html", { pageTitle: "Home", videos });
};

export const watch = async (req, res) => {
  const { id } = req.params;

  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404.html", {
      pageTitle: "Video Not Found",
    });
  }

  return res.render("watch.html", {
    pageTitle: video.title,
    video,
  });
};

export const getEdit = async (req, res) => {
  const { id } = req.params;

  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404.html", {
      pageTitle: "Video Not Found",
    });
  }

  return res.render("edit.html", {
    pageTitle: `Editing`,
    video,
  });
};

export const postEdit = async (req, res) => {
  const { id } = req.params;

  const video = await Video.exists({ _id: id });
  if (!video) {
    return res.status(404).render("404.html", {
      pageTitle: "Video Not Found",
    });
  }

  await Video.findByIdAndUpdate(id, req.body);
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload.html", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  try {
    await Video.create(req.body);
    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.status(400).render("upload.html", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;

  try {
    await Video.findByIdAndDelete(id);
    return res.redirect("/");
  } catch (error) {
    return res.redirect(`/videos/${id}`);
  }
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i"),
      },
    });
  }
  return res.render("search.html", { pageTitle: "Search", videos });
};
