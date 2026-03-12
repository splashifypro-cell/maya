# Maya Document Reader

<p align="center">
  <img src="https://www.sarvam.ai/sarvam-logo.png" alt="Sarvam AI Logo" width="200" />
</p>

A premium, full-stack document intelligence and image reader feature integrated into the **Splashify Pro** platform, powered by the **Sarvam AI Document Intelligence API**.

## 🚀 Overview

Maya is an AI-powered assistant designed to streamline document processing. It leverages Sarvam's state-of-the-art OCR and document understanding capabilities to extract text from various file formats with high accuracy, providing a seamless user experience within a modern chat interface.

## ✨ Key Features

- **Multi-format Support**: Process PNG, JPG, PDF, and TIFF files effortlessly (up to 10MB).
- **Sarvam Document Intelligence**: Implements the full 5-step secure workflow:
  1. **Initialise**: Job creation with `en-IN` language support.
  2. **Get Upload Link**: Secure presigned URLs for direct uploads.
  3. **Upload**: Real-time progress tracking for file uploads.
  4. **Start Job**: Automated processing trigger.
  5. **Status & Export**: Real-time polling and markdown export.
- **Modern UI/UX**:
  - **Shadcn UI**: Built with Radix-powered components (Avatar, Progress, ScrollArea, Card).
  - **Drag-and-Drop**: Intuitive file uploading directly into the chat.
  - **Real-time Progress**: Visual feedback during every stage of document processing.
- **Enterprise Ready**:
  - **Rate Limiting**: Backend protection (10 requests/minute per IP).
  - **Secure API Proxy**: Environment-variable based key management.
  - **High Accuracy**: Verified logic for ≥ 95% OCR accuracy.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS, Shadcn UI, Lucide Icons.
- **Backend**: Next.js Route Handlers, Sarvam AI API, Mongoose (MongoDB).
- **Testing**: Jest for unit testing logic and accuracy.

## 🚦 Getting Started

### 1. Prerequisites

Ensure you have a Sarvam AI API key. You can get one at [sarvam.ai](https://www.sarvam.ai/).

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
SARVAM_API_KEY=your_sarvam_api_key_here
MONGODB_URI=your_mongodb_uri_here
```

### 3. Installation

```bash
npm install
```

### 4. Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to interact with Maya.

### 5. Testing

Run the test suite to verify rate limiting and OCR logic:

```bash
npm run test
```

---

## 📄 License

This project is part of the Splashify Pro ecosystem. All rights reserved.

<p align="center">
  <b>Built with ❤️ using <a href="https://www.sarvam.ai/">Sarvam AI</a></b>
</p>
