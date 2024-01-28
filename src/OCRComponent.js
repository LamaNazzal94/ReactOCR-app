// OCRComponent.js
import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import './OCRComponent.css';

const OCRComponent = () => {
  const [imageSrc, setImageSrc] = useState('');
  const [extractedText, setExtractedText] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (upload) => {
        setImageSrc(upload.target.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const performOCR = async () => {
    try {
      const { data } = await Tesseract.recognize(imageSrc, 'eng');

      setExtractedText(data.text);
    } catch (error) {
      console.error('Error during OCR:', error);
      setExtractedText('Error during OCR. Please try again.');
    }
  };

  const fillFormWithExtractedData = () => {
    // Define your regex patterns for extracting information
    const nameRegex = /(?:Name:|Name\s*)([^\n]+)/i;
    const dobRegex = /(?:DOB:|DOB\s*)([^\n]+)/i;
    const expiresRegex = /(?:Expires:|Expires\s*)([^\n]+)/i;
    const idRegex = /(?:ID:|ID\s*)([^\n]+)/i;

    // Extract information from the text using regex
    const nameMatch = extractedText.match(nameRegex);
    const dobMatch = extractedText.match(dobRegex);
    const expiresMatch = extractedText.match(expiresRegex);
    const idMatch = extractedText.match(idRegex);

    // Fill the form with the extracted data
    if (nameMatch) document.getElementById('name').value = nameMatch[1].trim();
    if (dobMatch) document.getElementById('dob').value = dobMatch[1].trim();
    if (expiresMatch) document.getElementById('expires').value = expiresMatch[1].trim();
    if (idMatch) document.getElementById('id').value = idMatch[1].trim();
  };

  return (
    <div className="ocr-container">
      <div className="ocr-header">
        <input type="file" accept="image/*" onChange={handleImageChange} className="ocr-input" />
       


        <button onClick={performOCR} className="ocr-button">
          Perform OCR
        </button>
      </div>

      {imageSrc && <img src={imageSrc} alt="Selected for OCR" className="ocr-image" />}

      {extractedText && (
        <div className="extracted-text-container">
          <h3>Extracted Text:</h3>
          <p className="extracted-text">{extractedText}</p>
          <button onClick={fillFormWithExtractedData} className="fill-form-button">
            Fill Form
          </button>
        </div>
      )}

      <form className="form">
        <label className="form-label">Name:</label>
        <input type="text" id="name" className="form-input" />

        <label className="form-label">Date of Birth:</label>
        <input type="text" id="dob" className="form-input" />
        
        <label className="form-label">Expires On:</label>
        <input type="text" id="expires" className="form-input" />

        <label className="form-label">ID Number:</label>
        <input type="text" id="id" className="form-input" />
      </form>
    </div>
  );
};

export default OCRComponent;