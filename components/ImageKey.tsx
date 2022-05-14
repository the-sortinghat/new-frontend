import { useEffect } from "react";
import ImageKeyGenerator from "../services/graph/image_key";

const ImageKey: React.FC = () => {
  useEffect(() => {
    ImageKeyGenerator({ container: document.getElementById("image-key")! });
  });

  return (
    <>
      <h2>Image key</h2>
      <div
        id="image-key"
        style={{ width: "100%", height: "100%", border: "1px solid #cccccc" }}
      ></div>
    </>
  );
};

export default ImageKey;
