import { useState, useEffect } from "react";
import {
  Wrapper,
  useFieldExtension,
  FieldExtensionType,
  FieldExtensionFeature,
} from "@graphcms/uix-react-sdk";
import Media from "../components/Media";
import styles from "./uixMedia.module.scss";

const Input = () => {
  const { value, model, onChange } = useFieldExtension();
  const [localValue, setLocalValue] = useState(value || "");
  const [source, setSource] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const parentType = model.apiId;

  const isValidUrl = (type, url) => {
    let regExp;

    if (url !== "") {
      if (type === "Video") {
        regExp = new RegExp(
          "(https?:\\/\\/(.+?\\.)?cloudflarestream\\.com(\\/[A-Za-z0-9\\-\\._~:\\/\\?#\\[\\]@!$&'\\(\\)\\*\\+,;\\=]*)?)"
        );
      } else if (type === "Image") {
        regExp = new RegExp(
          "(https?:\\/\\/(.+?\\.)?amazonaws\\.com(\\/[A-Za-z0-9\\-\\._~:\\/\\?#\\[\\]@!$&'\\(\\)\\*\\+,;\\=]*)?)"
        );
      }

      return regExp.test(url);
    }
  };

  useEffect(() => {
    onChange(localValue);
    if (parentType === "Video") {
      setSource(
        localValue.replace("manifest/video.m3u8", "thumbnails/thumbnail.jpg")
      );
    } else if (parentType === "Image") {
      setSource(localValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localValue, onChange]);

  useEffect(() => {
    if (source !== "") {
      if (parentType === "Video" && !isValidUrl(parentType, source)) {
        setErrMsg("URL not valid. Please enter a valid video URL.");
      } else if (parentType === "Image" && !isValidUrl(parentType, source)) {
        setErrMsg("URL not valid. Please enter a valid image URL.");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source]);

  return (
    <div className={styles.container}>
      <input
        className={styles.input}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder="Media"
      />
      <div className={styles.mediaContainer}>
        {!errMsg && <Media className={styles.media} src={source} />}
      </div>
      {errMsg && <p>{errMsg}</p>}
    </div>
  );
};

const declaration = {
  extensionType: "field",
  fieldType: FieldExtensionType.STRING,
  features: [FieldExtensionFeature.FieldRenderer],
  name: "UIX Media",
  description: "Load and preview media",
};

const UIXMedia = () => {
  return (
    <Wrapper declaration={declaration}>
      <Input />
    </Wrapper>
  );
};

export default UIXMedia;
