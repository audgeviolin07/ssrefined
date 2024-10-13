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
const OPENAI_API_KEY = "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"; 

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
      console.error("Something went wrong while fetching data: ", error.response?.data || error.message);
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
              { role: "system", content: "Help identify disaster locations from tweets." },
              { role: "user", content: `Please identify the disaster location from this tweet: "${tweet.text}"` },
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
            { role: "user", content: `Here is the receipt text: "${relevantText}". Can you check if it contains homebuilding items?` },
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
      {/* Big Floating Star Emojis */}
      <div className="star-container">
        <div className="star">⭐</div>
        <div className="star">⭐</div>
        <div className="star">⭐</div>
        <div className="star">⭐</div>
        <div className="star">⭐</div>
      </div>

      <header style={{ backgroundColor: '#fefcea', padding: '15px 30px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ fontSize: '28px', fontWeight: 'bold', color: '#ffd700', textDecoration: 'none', fontFamily: 'Poppins, sans-serif' }}>
            StellarShine ⭐
          </Link>
          <nav style={{ display: 'flex', gap: '20px' }}>
            <Link href="/about" style={{ color: '#333', textDecoration: 'none', fontSize: '18px', fontFamily: 'Poppins, sans-serif', transition: 'color 0.3s' }}>About</Link>
            <Link href="/docs" style={{ color: '#333', textDecoration: 'none', fontSize: '18px', fontFamily: 'Poppins, sans-serif', transition: 'color 0.3s' }}>Docs</Link>
            <Link href="/contact" style={{ color: '#333', textDecoration: 'none', fontSize: '18px', fontFamily: 'Poppins, sans-serif', transition: 'color 0.3s' }}>Contact</Link>
            <button 
              onClick={() => alert('Connect Wallet clicked')} 
              style={{ 
                backgroundColor: '#ffd700', 
                color: '#333', 
                padding: '10px 20px', 
                border: 'none', 
                borderRadius: '5px', 
                cursor: 'pointer', 
                fontSize: '16px', 
                fontFamily: 'Poppins, sans-serif',
                transition: 'background-color 0.3s'
              }}
            >
              Connect Wallet
            </button>
          </nav>
        </div>
      </header>

      <div style={{ textAlign: 'center', marginTop: '50px', padding: '20px', background: 'linear-gradient(145deg, #fff7cc, #ffd700)', borderRadius: '10px', color: '#333', boxShadow: '0px 0px 15px rgba(255, 215, 0, 0.5)', fontFamily: 'Poppins, sans-serif' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>Welcome to StellarShine ⭐</h1>
        <p style={{ fontSize: '24px', color: '#333', marginBottom: '30px' }}>Shining a spotlight to those in need</p>
      </div>

      <div style={{ padding: '20px', background: 'linear-gradient(145deg, #fff7cc, #ffd700)', color: '#333', borderRadius: '10px', margin: '20px', boxShadow: '0px 0px 15px rgba(255, 215, 0, 0.5)', fontFamily: 'Poppins, sans-serif' }}>
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ color: '#333', marginBottom: '15px' }}>Upload Your Receipt</h3>
          <div {...getRootProps({ className: "dropzone" })} style={{ border: '2px dashed #ffd700', padding: '30px', textAlign: 'center', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0px 0px 10px rgba(255, 215, 0, 0.4)', fontFamily: 'Poppins, sans-serif' }}>
            <input {...getInputProps()} />
            {receiptFile ? (
              <p style={{ color: '#333' }}>{receiptFile.name}</p>
            ) : (
              <p style={{ color: '#333' }}>Drag and drop your receipt here, or click to select a file</p>
            )}
          </div>
          <button onClick={handleFileUpload} style={{ marginTop: '15px', backgroundColor: '#ffd700', color: '#333', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', boxShadow: '0px 0px 10px rgba(255, 215, 0, 0.4)', fontFamily: 'Poppins, sans-serif' }}>
            Validate Receipt
          </button>
          {validationResult && (
            <div style={{ marginTop: '15px', color: '#333' }}>
              <p>Validation Result: {validationResult}</p>
            </div>
          )}
        </div>

        <div>
          <h3 style={{ color: '#333', marginBottom: '15px' }}>Recent Disaster Locations</h3>
          {loading ? (
            <p style={{ color: '#333' }}>Loading...</p>
          ) : disasterLocations.length > 0 ? (
            <Slider {...sliderSettings}>
              {disasterLocations.map((location, index) => (
                <div key={index} style={{ padding: '10px', textAlign: 'center' }}>
                  <p style={{ color: '#333', backgroundColor: '#fff', padding: '10px', borderRadius: '5px', boxShadow: '0px 0px 10px rgba(255, 215, 0, 0.4)' }}>{location}</p>
                </div>
              ))}
            </Slider>
          ) : (
            <p style={{ color: '#333' }}>No disaster locations found.</p>
          )}
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

        .star-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: -1;
          pointer-events: none;
        }

        .star {
          position: absolute;
          font-size: 50px;
          color: #ffd700;
          text-shadow: 0 0 10px rgba(255, 215, 0, 0.8), 0 0 20px rgba(255, 215, 0, 0.8), 0 0 30px rgba(255, 215, 0, 0.8);
          animation: float 10s infinite ease-in-out;
        }

        .star:nth-child(1) {
          top: 20%;
          left: 15%;
          animation-duration: 8s;
        }

        .star:nth-child(2) {
          top: 40%;
          left: 70%;
          animation-duration: 12s;
        }

        .star:nth-child(3) {
          top: 60%;
          left: 30%;
          animation-duration: 10s;
        }

        .star:nth-child(4) {
          top: 75%;
          left: 50%;
          animation-duration: 9s;
        }

        .star:nth-child(5) {
          top: 10%;
          left: 80%;
          animation-duration: 11s;
        }

        @keyframes float {
          0% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
          100% {
            transform: translateY(0px) rotate(360deg);
          }
        }
      `}</style>
    </>
  );
};





// import Link from 'next/link';
// import type { FC } from 'react';
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useDropzone } from "react-dropzone";
// import Tesseract from "tesseract.js";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// const TWITTER_API_BEARER_TOKEN = "YOUR_TWITTER_BEARER_TOKEN"; 
// const OPENAI_API_KEY = ""; 

// export const HomePageTitle: FC = () => {
//   const [disasterLocations, setDisasterLocations] = useState<string[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [receiptFile, setReceiptFile] = useState<File | null>(null);
//   const [validationResult, setValidationResult] = useState<string>("");

//   useEffect(() => {
//     fetchTwitterData();
//   }, []);

//   const fetchTwitterData = async () => {
//     setLoading(true);
//     try {
//       const query = "earthquake OR flood OR wildfire";
//       const twitterResponse = await axios.get(
//         `https://api.twitter.com/2/tweets/search/recent?query=${query}&tweet.fields=text&max_results=20`,
//         {
//           headers: {
//             Authorization: `Bearer ${TWITTER_API_BEARER_TOKEN}`,
//           },
//         }
//       );

//       const tweets = twitterResponse.data.data || [];
//       const locations = await analyzeTweets(tweets);
//       setDisasterLocations(locations);
//     } catch (error) {
//       console.error("Error fetching data: ", error.response?.data || error.message);
//     }
//     setLoading(false);
//   };

//   const analyzeTweets = async (tweets: any[]) => {
//     const locations: string[] = [];
//     for (const tweet of tweets) {
//       try {
//         const openaiResponse = await axios.post(
//           "https://api.openai.com/v1/chat/completions",
//           {
//             model: "gpt-3.5-turbo",
//             messages: [
//               { role: "system", content: "Identify disaster locations from tweets." },
//               { role: "user", content: `Extract any location names related to natural disasters from the following tweet: ${tweet.text}` },
//             ],
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${OPENAI_API_KEY}`,
//             },
//           }
//         );

//         const result = openaiResponse.data.choices[0].message.content.trim();
//         if (result) {
//           locations.push(result);
//         }
//       } catch (error) {
//         console.error("Error analyzing tweet: ", error.response?.data || error.message);
//       }
//     }
//     return locations;
//   };

//   const { getRootProps, getInputProps } = useDropzone({
//     accept: "image/*",
//     onDrop: (acceptedFiles) => setReceiptFile(acceptedFiles[0]),
//   });

//   const handleFileUpload = async () => {
//     if (!receiptFile) {
//       alert("Please upload a receipt file.");
//       return;
//     }

//     try {
//       const { data: { text } } = await Tesseract.recognize(receiptFile, "eng", {
//         logger: (info) => console.log(info)
//       });

//       const relevantText = cleanAndSummarizeText(text);

//       const response = await axios.post(
//         "https://api.openai.com/v1/chat/completions",
//         {
//           model: "gpt-3.5-turbo",
//           messages: [
//             { role: "system", content: "You are an assistant that validates receipts for homebuilding items." },
//             { role: "user", content: `Check if the following receipt contains homebuilding items: ${relevantText}` },
//           ],
//           max_tokens: 60,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${OPENAI_API_KEY}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const validationResult = response.data.choices[0].message.content.trim();
//       setValidationResult(validationResult);
//     } catch (error) {
//       console.error("Error during receipt validation:", error.response?.data || error.message);
//       setValidationResult("Failed to validate receipt.");
//     }
//   };

//   const cleanAndSummarizeText = (text: string) => {
//     const cleanedText = text.replace(/\s+/g, ' ').trim();
//     const relevantKeywords = ['lumber', 'cement', 'nails', 'wood', 'bricks', 'screws', 'paint'];
//     const containsKeywords = relevantKeywords.some(keyword => cleanedText.toLowerCase().includes(keyword));

//     return containsKeywords ? cleanedText : "No relevant homebuilding items found.";
//   };

//   const sliderSettings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 3,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 3000,
//     pauseOnHover: true,
//   };

//   return (
//     <>
//       <header style={{ backgroundColor: '#1E2A15', padding: '15px 30px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)' }}>
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <Link href="/" style={{ fontSize: '28px', fontWeight: 'bold', color: '#FFD700', textDecoration: 'none' }}>
//             StellarShine
//           </Link>
//           <nav style={{ display: 'flex', gap: '20px' }}>
//             <Link href="/about" style={{ color: '#fff', textDecoration: 'none', fontSize: '18px', transition: 'color 0.3s' }}>About</Link>
//             <Link href="/docs" style={{ color: '#fff', textDecoration: 'none', fontSize: '18px', transition: 'color 0.3s' }}>Docs</Link>
//             <Link href="/contact" style={{ color: '#fff', textDecoration: 'none', fontSize: '18px', transition: 'color 0.3s' }}>Contact</Link>
//             <button 
//               onClick={() => alert('Connect Wallet clicked')} 
//               style={{ 
//                 backgroundColor: '#FFD700', 
//                 color: '#2E3B25', 
//                 padding: '10px 20px', 
//                 border: 'none', 
//                 borderRadius: '5px', 
//                 cursor: 'pointer', 
//                 fontSize: '16px',
//                 transition: 'background-color 0.3s'
//               }}
//             >
//               Connect Wallet
//             </button>
//           </nav>
//         </div>
//       </header>

//       <div style={{ textAlign: 'center', marginTop: '50px', padding: '20px', backgroundColor: '#1E2A15', borderRadius: '10px', color: '#fff' }}>
//         <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#FFD700', marginBottom: '10px' }}>StellarShine</h1>
//         <p style={{ fontSize: '24px', color: '#fff', marginBottom: '30px' }}>Shine & Smile with us</p>
//       </div>

//       <div style={{ padding: '20px', backgroundColor: '#1E2A15', color: '#fff', borderRadius: '10px', margin: '20px' }}>
//         <div style={{ marginBottom: '40px' }}>
//           <h3 style={{ color: '#FFD700', marginBottom: '15px' }}>Upload and Validate Receipt</h3>
//           <div {...getRootProps({ className: "dropzone" })} style={{ border: '2px dashed #FFD700', padding: '30px', textAlign: 'center', backgroundColor: '#2E3B25', borderRadius: '10px' }}>
//             <input {...getInputProps()} />
//             {receiptFile ? (
//               <p style={{ color: '#FFD700' }}>{receiptFile.name}</p>
//             ) : (
//               <p style={{ color: '#FFD700' }}>Drag and drop your receipt image here, or click to select a file</p>
//             )}
//           </div>
//           <button onClick={handleFileUpload} style={{ marginTop: '15px', backgroundColor: '#FFD700', color: '#2E3B25', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
//             Validate Receipt
//           </button>
//           {validationResult && (
//             <div style={{ marginTop: '15px', color: '#FFD700' }}>
//               <p>Validation Result: {validationResult}</p>
//             </div>
//           )}
//         </div>

//         <div>
//           <h3 style={{ color: '#FFD700', marginBottom: '15px' }}>Recent Disaster Locations</h3>
//           {loading ? (
//             <p style={{ color: '#FFD700' }}>Loading...</p>
//           ) : disasterLocations.length > 0 ? (
//             <Slider {...sliderSettings}>
//               {disasterLocations.map((location, index) => (
//                 <div key={index} style={{ padding: '10px', textAlign: 'center' }}>
//                   <p style={{ color: '#FFD700', backgroundColor: '#2E3B25', padding: '10px', borderRadius: '5px' }}>{location}</p>
//                 </div>
//               ))}
//             </Slider>
//           ) : (
//             <p style={{ color: '#FFD700' }}>No disaster locations found.</p>
//           )}
//         </div>
//       </div>

   
//     </>
//   );
// };
