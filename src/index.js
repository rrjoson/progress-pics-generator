import React, { useState } from "react";
import { render } from "react-dom";
import { Stage, Layer, Image, Text } from "react-konva";
import useImage from "use-image";
import { format } from "date-fns";

const App = () => {
  const imageRef = React.useRef();
  const stageRef = React.useRef();
  const [image1, setImage1] = useState({});
  const [image2, setImage2] = useState({});

  const [img1] = useImage(image1.src, "Anonymous");
  const [img2] = useImage(image2.src, "Anonymous");

  const readFileAsync = async file => {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const downloadURI = (uri, name) => {
    const link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveImage = event => {
    event.preventDefault();
    const dataURL = stageRef.current.toDataURL({
      mimeType: "image/png",
      pixelRatio: 3
    });
    downloadURI(dataURL, "stage");
  };

  return (
    <div>
      <div>
        <input
          ref={imageRef}
          type="file"
          accept={"image/*"}
          onChange={async event => {
            const file = event.target.files[0];
            const image = await readFileAsync(file);
            setImage1({
              src: image,
              lastModifiedDate: format(file.lastModifiedDate, "PP")
            });
          }}
        />
        <input
          ref={imageRef}
          type="file"
          accept={"image/*"}
          onChange={async event => {
            const file = event.target.files[0];
            const image = await readFileAsync(file);
            setImage2({
              src: image,
              lastModifiedDate: format(file.lastModifiedDate, "PP")
            });
          }}
        />
      </div>
      <div>
        <Stage
          width={600}
          height={750}
          style={{ border: "1px solid grey" }}
          ref={stageRef}
        >
          <Layer>
            <Image width={300} height={750} image={img1} />
            <Image width={300} height={750} image={img2} x={300} />
            <Text x={20} y={20} text={image1.lastModifiedDate} />
            <Text x={320} y={20} text={image2.lastModifiedDate} />
          </Layer>
        </Stage>
        <button
          style={{ position: "absolute", top: "0", right: "0" }}
          onClick={handleSaveImage}
        >
          Export
        </button>
      </div>
    </div>
  );
};

render(<App />, document.getElementById("root"));
