import { useState } from "react";
import { db, storage } from "../firebase"; 
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export default function UploadForm() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !category || !image) {
      alert("Please fill out all fields");
      return;
    }

    try {
      setLoading(true);
      setProgress(0);

      const imageRef = ref(storage, `uploads/${Date.now()}_${image.name}`);
      const uploadTask = uploadBytesResumable(imageRef, image);

      await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            setProgress(percent);
          },
          (error) => {
            console.error("Upload failed:", error);
            reject(error);
          },
          () => {
            resolve();
          }
        );
      });

      const imageUrl = await getDownloadURL(uploadTask.snapshot.ref);

      await addDoc(collection(db, "products"), {
        title,
        category,
        imageUrl,
        createdAt: new Date(),
      });

      alert("Data with image submitted successfully!");
      setTitle("");
      setCategory("");
      setImage(null);
      setProgress(0);
    } catch (error) {
      console.error("Error uploading data:", error);
      alert("Error uploading data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded max-w-sm mx-auto">
      <input
        type="text"
        placeholder="Enter title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="block w-full p-2 border mb-2"
      />

      <input
        type="text"
        placeholder="Enter category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="block w-full p-2 border mb-2"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        className="block w-full p-2 border mb-2"
      />

      {loading && (
        <div className="mb-2">
          <div className="w-full bg-gray-200 rounded h-4">
            <div
              className="bg-blue-600 h-4 rounded"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-center mt-1">{progress}%</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? "Uploading..." : "Submit"}
      </button>
    </form>
  );
}
