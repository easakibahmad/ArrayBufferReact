import React, { useState } from 'react';

import './App.css';
import DragAndDrop from './components/DragAndDrop';

const App = () => {
	const [originalImage, setOriginalImage] = useState<string | null>(null);
	const [processedImage, setProcessedImage] = useState<string | null>(null);

	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			const file = e.target.files[0];

			if (!file.type.startsWith('image/')) {
				alert('Please upload a valid image file.');
				return;
			}

			const reader = new FileReader();
			reader.readAsArrayBuffer(file);

			reader.onload = async () => {
				if (reader.result instanceof ArrayBuffer) {
					const arrayBuffer = reader.result;

					// Display original image
					const originalBlob = new Blob([arrayBuffer], { type: file.type });
					const originalUrl = URL.createObjectURL(originalBlob);
					setOriginalImage(originalUrl);

					// Convert to black and white
					const processedUrl = await convertToBlackAndWhite(
						arrayBuffer,
						file.type,
					);
					setProcessedImage(processedUrl);
				}
			};

			reader.onerror = () => {
				alert('Error reading the file. Please try again.');
			};
		}
	};

	const convertToBlackAndWhite = (
		arrayBuffer: ArrayBuffer,
		fileType: string,
	): Promise<string> => {
		const blob = new Blob([arrayBuffer], { type: fileType });
		const imageUrl = URL.createObjectURL(blob);

		return new Promise((resolve) => {
			const img = new Image();
			img.src = imageUrl;
			img.onload = () => {
				const canvas = document.createElement('canvas');
				const ctx = canvas.getContext('2d');
				canvas.width = img.width;
				canvas.height = img.height;

				ctx?.drawImage(img, 0, 0, img.width, img.height);

				const imageData = ctx?.getImageData(0, 0, img.width, img.height);
				const data = imageData?.data;

				if (data) {
					for (let i = 0; i < data.length; i += 4) {
						const r = data[i];
						const g = data[i + 1];
						const b = data[i + 2];

						const gray = 0.3 * r + 0.59 * g + 0.11 * b;
						data[i] = data[i + 1] = data[i + 2] = gray;
					}
				}

				if (imageData) ctx?.putImageData(imageData, 0, 0);

				resolve(canvas.toDataURL(fileType));
			};
		});
	};

	return (
		<div style={{ textAlign: 'center' }}>
      <DragAndDrop/>
			<h1>Image Black and White Converter</h1>
			<input type="file" accept="image/*" onChange={handleImageUpload} />
			<div
				style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}
			>
				{originalImage && (
					<div style={{ marginRight: '20px' }}>
						<h3>Original Image</h3>
						<img
							src={originalImage}
							alt="Original"
							style={{ maxWidth: '300px' }}
						/>
					</div>
				)}
				{processedImage && (
					<div>
						<h3>Black and White Image</h3>
						<img
							src={processedImage}
							alt="Black and White"
							style={{ maxWidth: '300px' }}
						/>
						<br />
						<a href={processedImage} download="black-and-white-image.png">
							<button>Download</button>
						</a>
					</div>
				)}
			</div>
		</div>
	);
};

export default App;