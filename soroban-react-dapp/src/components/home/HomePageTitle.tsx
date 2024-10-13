import Link from 'next/link';
import type { FC } from 'react';
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import Tesseract from "tesseract.js";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const TWITTER_API_BEARER_TOKEN = "YOUR_TWITTER_BEARER_TOKEN"; 
const OPENAI_API_KEY = ""; 

export const HomePageTitle: FC = () => {
  const [disasterLocations, setDisasterLocations] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [validationResult, setValidationResult] = useState<string>("");

  useEffect(() => {
    fetchTwitterData();
  }, []);

  const fetchTwitterData = async () => {
    setLoading(true);
    try {
      const query = "earthquake OR flood OR wildfire";
      const twitterResponse = await axios.get(
        `https://api.twitter.com/2/tweets/search/recent?query=${query}&tweet.fields=text&max_results=20`,
        {
          headers: {
            Authorization: `Bearer ${TWITTER_API_BEARER_TOKEN}`,
          },
        }
      );

      const tweets = twitterResponse.data.data || [];
      const locations = await analyzeTweets(tweets);
      setDisasterLocations(locations);
    } catch (error) {
      console.error("Error fetching data: ", error.response?.data || error.message);
    }
    setLoading(false);
  };

  const analyzeTweets = async (tweets: any[]) => {
    const locations: string[] = [];
    for (const tweet of tweets) {
      try {
        const openaiResponse = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: "gpt-3.5-turbo",
            messages: [
              { role: "system", content: "Identify disaster locations from tweets." },
              { role: "user", content: `Extract any location names related to natural disasters from the following tweet: ${tweet.text}` },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${OPENAI_API_KEY}`,
            },
          }
        );

        const result = openaiResponse.data.choices[0].message.content.trim();
        if (result) {
          locations.push(result);
        }
      } catch (error) {
        console.error("Error analyzing tweet: ", error.response?.data || error.message);
      }
    }
    return locations;
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => setReceiptFile(acceptedFiles[0]),
  });

  const handleFileUpload = async () => {
    if (!receiptFile) {
      alert("Please upload a receipt file.");
      return;
    }

    try {
      const { data: { text } } = await Tesseract.recognize(receiptFile, "eng", {
        logger: (info) => console.log(info)
      });

      const relevantText = cleanAndSummarizeText(text);

      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are an assistant that validates receipts for homebuilding items." },
            { role: "user", content: `Check if the following receipt contains homebuilding items: ${relevantText}` },
          ],
          max_tokens: 60,
        },
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const validationResult = response.data.choices[0].message.content.trim();
      setValidationResult(validationResult);
    } catch (error) {
      console.error("Error during receipt validation:", error.response?.data || error.message);
      setValidationResult("Failed to validate receipt.");
    }
  };

  const cleanAndSummarizeText = (text: string) => {
    const cleanedText = text.replace(/\s+/g, ' ').trim();
    const relevantKeywords = ['lumber', 'cement', 'nails', 'wood', 'bricks', 'screws', 'paint'];
    const containsKeywords = relevantKeywords.some(keyword => cleanedText.toLowerCase().includes(keyword));

    return containsKeywords ? cleanedText : "No relevant homebuilding items found.";
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
  };

  return (
    <>
      <header style={{ backgroundColor: '#1E2A15', padding: '15px 30px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ fontSize: '28px', fontWeight: 'bold', color: '#FFD700', textDecoration: 'none' }}>
            StellarShine
          </Link>
          <nav style={{ display: 'flex', gap: '20px' }}>
            <Link href="/about" style={{ color: '#fff', textDecoration: 'none', fontSize: '18px', transition: 'color 0.3s' }}>About</Link>
            <Link href="/docs" style={{ color: '#fff', textDecoration: 'none', fontSize: '18px', transition: 'color 0.3s' }}>Docs</Link>
            <Link href="/contact" style={{ color: '#fff', textDecoration: 'none', fontSize: '18px', transition: 'color 0.3s' }}>Contact</Link>
            <button 
              onClick={() => alert('Connect Wallet clicked')} 
              style={{ 
                backgroundColor: '#FFD700', 
                color: '#2E3B25', 
                padding: '10px 20px', 
                border: 'none', 
                borderRadius: '5px', 
                cursor: 'pointer', 
                fontSize: '16px',
                transition: 'background-color 0.3s'
              }}
            >
              Connect Wallet
            </button>
          </nav>
        </div>
      </header>

      <div style={{ textAlign: 'center', marginTop: '50px', padding: '20px', backgroundColor: '#1E2A15', borderRadius: '10px', color: '#fff' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#FFD700', marginBottom: '10px' }}>StellarShine</h1>
        <p style={{ fontSize: '24px', color: '#fff', marginBottom: '30px' }}>Shine & Smile with us</p>
      </div>

      <div style={{ padding: '20px', backgroundColor: '#1E2A15', color: '#fff', borderRadius: '10px', margin: '20px' }}>
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ color: '#FFD700', marginBottom: '15px' }}>Upload and Validate Receipt</h3>
          <div {...getRootProps({ className: "dropzone" })} style={{ border: '2px dashed #FFD700', padding: '30px', textAlign: 'center', backgroundColor: '#2E3B25', borderRadius: '10px' }}>
            <input {...getInputProps()} />
            {receiptFile ? (
              <p style={{ color: '#FFD700' }}>{receiptFile.name}</p>
            ) : (
              <p style={{ color: '#FFD700' }}>Drag and drop your receipt image here, or click to select a file</p>
            )}
          </div>
          <button onClick={handleFileUpload} style={{ marginTop: '15px', backgroundColor: '#FFD700', color: '#2E3B25', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Validate Receipt
          </button>
          {validationResult && (
            <div style={{ marginTop: '15px', color: '#FFD700' }}>
              <p>Validation Result: {validationResult}</p>
            </div>
          )}
        </div>

        <div>
          <h3 style={{ color: '#FFD700', marginBottom: '15px' }}>Recent Disaster Locations</h3>
          {loading ? (
            <p style={{ color: '#FFD700' }}>Loading...</p>
          ) : disasterLocations.length > 0 ? (
            <Slider {...sliderSettings}>
              {disasterLocations.map((location, index) => (
                <div key={index} style={{ padding: '10px', textAlign: 'center' }}>
                  <p style={{ color: '#FFD700', backgroundColor: '#2E3B25', padding: '10px', borderRadius: '5px' }}>{location}</p>
                </div>
              ))}
            </Slider>
          ) : (
            <p style={{ color: '#FFD700' }}>No disaster locations found.</p>
          )}
        </div>
      </div>

   
    </>
  );
};
