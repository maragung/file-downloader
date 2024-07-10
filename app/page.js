use client;

import React, { useState } from 'react';
import axios from 'axios';
import Progress from 'progress';

const Download = () => {
  const [url, setUrl] = useState('');
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState(null);
  const [fileSize, setFileSize] = useState(0);
  const [md5Hash, setMd5Hash] = useState('');

  const downloadFile = async () => {
    try {
      const response = await axios.head(url);
      setFileSize(response.headers['content-length']);
      setMd5Hash(response.headers['content-md5']);

      const downloadResponse = await axios.get(url, {
        responseType: 'blob',
      });

      const fileBlob = downloadResponse.data;
      const fileName = getFileNameFromUrl(url);

      const fileURL = URL.createObjectURL(fileBlob);
      setFile(fileURL);

      const progressInterval = setInterval(() => {
        const loaded = downloadResponse.headers['content-length']
          ? (downloadResponse.data.loaded / downloadResponse.headers['content-length']) * 100
          : 100;
        setProgress(loaded);
      }, 100);

      return () => {
        clearInterval(progressInterval);
      };
    } catch (error) {
      console.error(error);
      alert('Error downloading file.');
    }
  };

  const getFileNameFromUrl = (url) => {
    const parts = url.split('/');
    return parts[parts.length - 1];
  };

  return (
    <div>
      <h1>Unduh File</h1>
      <p>Masukkan URL file:</p>
      <input type="text" id="url" value={url} onChange={(event) => setUrl(event.target.value)} />
      <button onClick={downloadFile}>Unduh File</button>

      {file && (
        <div>
          <a href={file} download={getFileNameFromUrl(url)}>
            Unduh File
          </a>
          <Progress percent={progress} />
          <p>Ukuran File: {fileSize} bytes</p>
          <p>MD5 Hash: {md5Hash}</p>
        </div>
      )}
    </div>
  );
};

export default Download;

