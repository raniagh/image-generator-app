"use client";

import { useEffect, useState } from "react";
import "./App.css";
import { Configuration, OpenAIApi } from "openai";
export default function Home() {
  const [result, setResult] = useState(
    "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
  );
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [typedText, setTypedText] = useState("");
  const text = "Creating image...Please Wait...";

  const apiKey = process.env.NEXT_PUBLIC_API_KEY;
  if (!apiKey) {
    throw new Error("apiKey is not defined in config file");
  }
  const configuration = new Configuration({ apiKey });
  const openai = new OpenAIApi(configuration);

  const generateImage = async () => {
    setLoading(true);
    const res = await openai.createImage({
      prompt: prompt,
      n: 1,
      size: "512x512",
    });
    setLoading(false);
    const data = res.data;
    setResult(data.data[0].url || "no image found");
  };

  useEffect(() => {
    if (loading) {
      let i = 0;
      const typing = setInterval(() => {
        setTypedText(text.slice(0, i));
        i++;
        if (i > text.length + 1) {
          i = 0;
          setTypedText("");
        }
      }, 100);
      return () => clearInterval(typing);
    }
    // write some logic here
  }, [loading]);

  const sendEmail = (url = "") => {
    url = result;
    const message = `Here's your image download link: ${url}`;
    window.location.href = `mailto:someone@example.com?subject=Image Download Link&body=${message}`;
  };

  return (
    <div className="app-main">
      <h2>Create Images With Your Imagination</h2>
      <textarea
        className="app-input"
        placeholder="Create any type of image you can think of with 
as much added description as you would like"
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button onClick={generateImage}>Generate Image</button>
      <>
        {loading ? (
          <>
            <h3>{typedText}</h3>
            <div className="lds-ripple">
              <div></div>
              <div></div>
            </div>
          </>
        ) : (
          <img
            onClick={() => sendEmail(result)}
            src={result}
            style={{ cursor: "pointer" }}
            className="result-image"
            alt="result"
          />
        )}
      </>
    </div>
  );
}
