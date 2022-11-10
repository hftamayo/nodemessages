exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        title: "First Post",
        content: "This is the first post",
        imageUrl: "images/grub03.jpg",
      },
    ],
  });
};

exports.createPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  //create the post in the db
  res.status(201).json({
    message: "Post created successfully",
    post: { id: new Date().toISOString(), title: title, content: content },
  });
};
