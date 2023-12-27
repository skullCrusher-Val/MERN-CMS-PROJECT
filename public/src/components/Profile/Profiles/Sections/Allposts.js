import styles from "./Allposts.module.css";
import { Fragment, useEffect, useState } from "react";
import Editpost from "./Editpost";
import LoaderBig from "../../../Loader/LoaderBig";

const Allpost = (props) => {
  const [isEdit, setisEdit] = useState(false);
  const [postId, setPostId] = useState("");
  const [post, setPost] = useState([]);
  const [isLoader, setLoader] = useState(false);

  const editHandler = (e) => {
    e.preventDefault();
    setisEdit((pre) => !pre);
    const post_Id = e.target[0].value;
    setPostId(post_Id);
  };

  const backClickHandler = (value) => {
    setisEdit(value);
    setLoader(true);
    const token = localStorage.getItem("token");
    const url = "http://localhost:3030/post/getpost";
    fetch(url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("post not found");
        }
        return response.json();
      })
      .then((data) => {
        setPost(data.postData);
        setLoader(false);
      })
      .catch((err) => {
        console.log(err);
        setLoader(false);
      });
  };

  useEffect(() => {
    setLoader(true);
    const token = localStorage.getItem("token");
    const url = "http://localhost:3030/post/getpost";
    fetch(url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("post not found");
        }
        return response.json();
      })
      .then((data) => {
        setPost(data.postData);
        setLoader(false);
      })
      .catch((err) => {
        console.log(err);
        setLoader(false);
      });
  }, []);

  return (
    <Fragment>
      {isLoader && (
        <div className={styles["loader"]}>
          <LoaderBig />
        </div>
      )}
      {!isLoader && !isEdit && (
        <div className={styles["allpost-main"]}>
          {post.map((data) => (
            <div className={styles["allpost-sub"]} key={data.postId}>
              <img
                className={styles["blog-image"]}
                src={data.imageUrl}
                alt="images dssd"
              ></img>
              <p>{data.desc}</p>
              <div className={styles["action"]}>
                <form method="post" onSubmit={(e) => editHandler(e)}>
                  <input
                    type="hidden"
                    name="postId"
                    value={data.postId}
                  ></input>
                  <button className={styles["edit"]} type="submit">
                    <img
                      width="20"
                      height="20"
                      src="https://img.icons8.com/ios/50/create-new.png"
                      alt="create-new"
                    />
                  </button>
                </form>
                <form method="post">
                  <input
                    type="hidden"
                    name="postId"
                    value={data.postId}
                  ></input>
                  <button className={styles["delete"]} type="submit">
                    <img
                      width="20"
                      height="20"
                      src="https://img.icons8.com/ios-glyphs/60/filled-trash.png"
                      alt="filled-trash"
                    />
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}

      {isEdit && (
        <Editpost
          postCategory={props.postCategory}
          postId={postId}
          backBtn={backClickHandler}
        />
      )}
    </Fragment>
  );
};

export default Allpost;
