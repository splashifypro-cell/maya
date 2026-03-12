# Maya Document Reader

<p align="center">
  <img src="https://www.sarvam.ai/sarvam-logo.png" alt="Sarvam AI Logo" width="200" />
</p>

A premium, full-stack AI chat assistant integrated into the **Splashify Pro** platform, powered by **Sarvam AI**.

## 🚀 Overview

Maya is an AI-powered assistant designed to provide seamless customer interactions. It leverages Sarvam's state-of-the-art conversational AI to handle inquiries about pricing, onboarding, and support within a modern chat interface.

## ✨ Key Features

- **Sarvam AI Conversational Interface**: High-fidelity AI responses across multiple languages.
- **Modern UI/UX**:
  - **Shadcn UI**: Built with Radix-powered components (Avatar, ScrollArea, Card).
  - **Real-time Status**: Visual feedback for AI thinking and online status.
- **Enterprise Ready**:
  - **Rate Limiting**: Backend protection (10 requests/minute per IP).
  - **Secure API Proxy**: Environment-variable based key management.
  - **Chat Persistence**: MongoDB integration for session management.

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
