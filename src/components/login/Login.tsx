import { useState } from "react";
import "./login.css";
import { toast } from "react-toastify";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import upload from "../../lib/upload";

export default function Login() {
  const [avatar, setAvatar] = useState<{ file: File | null; url: string }>({
    file: null,
    url: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const { email, password } = Object.fromEntries(formData.entries()) as {
      [key: string]: string;
    };

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful");
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
        toast.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    // formData.entries() eturns an iterator that allows you to loop through all the key/value pairs in the FormData object
    // ['username', 'user1'] and ['email', 'user1@example.com']

    // Object.fromEntries(formData.entries()) takes an iterator and transform into an object
    // {username: 'user1', email: 'user1@example.com'}

    const { username, email, password } = Object.fromEntries(
      formData.entries()
    ) as { [key: string]: string };

    // Validate input
    if (!username || !email || !password)
      return toast.warn("Please enter inputs!");
    if (!avatar.file) return toast.warn("Please upload an avatar!");

    // Validate unique username
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return toast.warn("Select another username");
    }

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const imgUrl = await upload(avatar.file! || "./avatar.png");
      console.log(imgUrl);

      await setDoc(doc(db, "users", res.user.uid), {
        username,
        email,
        avatar: imgUrl,
        id: res.user.uid,
        blocked: [],
      });

      await setDoc(doc(db, "userchats", res.user.uid), {
        chats: [],
      });

      toast.success("Account created successfully");
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        toast.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
    console.log(username, email, password);
  };

  return (
    <div className="login">
      <div className="item">
        <h2>Welcome back,</h2>
        <form onSubmit={handleLogin}>
          <input type="text" placeholder="Email" name="email" />
          <input type="password" placeholder="Password" name="password" />
          <button disabled={isLoading}>
            {isLoading ? "Loading..." : "Sign In"}
          </button>
        </form>
      </div>
      <div className="separator"></div>
      <div className="item">
        <h2>Create an Account</h2>
        <form onSubmit={handleRegister}>
          <label htmlFor="file">
            <img src={avatar.url || "./avatar.png"} alt="" />
            Upload an Image
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleAvatar}
          />
          <input type="text" placeholder="Username" name="username" />
          <input type="text" placeholder="Email" name="email" />
          <input type="password" placeholder="Password" name="password" />
          <button disabled={isLoading}>
            {isLoading ? "Loading..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
