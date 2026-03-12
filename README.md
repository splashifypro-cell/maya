# Maya AI Assistant

<p align="center">
  <img src="https://assets.sarvam.ai/assets/svgs/sarvam-wordmark-black.svg" alt="Sarvam AI Logo" width="200" />
</p>

A premium, full-stack AI chat assistant integrated into the **Splashify Pro** platform, powered by [**Sarvam AI**](https://www.sarvam.ai/).

---

## 🔌 Embed Maya on Your Website

You can now embed Maya on any external website using a simple script tag, just like Zoho or Intercom.

### **Quick Setup**
Add the following code before the closing `</body>` tag of your website:

```html
<!-- Maya AI Chat Widget -->
<script src="https://agentmaya.vercel.app/widget.js" defer></script>
```

### **Manual Initialization (Optional)**
If you need to control when the widget loads, you can use the manual loader:
```html
<script>
  window.mayaConfig = {
    // Future configuration options like theme or initial message
  };
</script>
<script src="https://agentmaya.vercel.app/widget.js" defer></script>
```

---

## 🛠️ Admin Panel

Maya includes a powerful administrative dashboard to manage conversations and team members.

- **URL**: `https://agentmaya.vercel.app/admin`
- **Default Credentials**:
  - **Email**: `sayan@splashifypro.in`
  - **Password**: `Admin@0908`

### **Admin Features**
- **Real-time Dashboard**: Monitor active visitors, open conversations, and team status.
- **Conversation Management**: Live chat with visitors, resolve sessions, and view user details.
- **Team Management**: Add, edit, and manage support agents and their roles.
- **Widget Customization**: Update brand colors, bot names, and welcome messages with a live preview.

---

## 🚀 Overview

Maya is an AI-powered assistant designed to provide seamless customer interactions. It leverages Sarvam's state-of-the-art conversational AI to handle inquiries about pricing, onboarding, and support within a modern chat interface.

## ✨ Key Features

- **Sarvam AI Conversational Interface**: High-fidelity AI responses across multiple languages.
- **Modern UI/UX**:
  - **Shadcn UI**: Built with Radix-powered components (Avatar, ScrollArea, Card).
  - **Real-time Status**: Visual feedback for AI thinking and online status.
- **Enterprise Ready**:
  - **Pusher Integration**: Real-time bi-directional messaging between agents and visitors.
  - **NextAuth Security**: Protected admin routes with session management.
  - **Rate Limiting**: Backend protection (10 requests/minute per IP).
  - **Chat Persistence**: MongoDB integration for complete session history.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS, Shadcn UI, Lucide Icons.
- **Backend**: Next.js Route Handlers, Sarvam AI API, Mongoose (MongoDB), Pusher.
- **Authentication**: NextAuth.js with MongoDB Adapter.

## 🚦 Getting Started

### 1. Prerequisites

Ensure you have the following API keys:
- **Sarvam AI**: [sarvam.ai](https://www.sarvam.ai/)
- **MongoDB Atlas**: [mongodb.com](https://www.mongodb.com/cloud/atlas)
- **Pusher**: [pusher.com](https://pusher.com/)

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Core
SARVAM_API_KEY=your_sarvam_api_key_here
MONGODB_URI=your_mongodb_uri_here

# Auth
NEXTAUTH_SECRET=your_random_secret_here
NEXTAUTH_URL=http://localhost:3000

# Pusher (Real-time)
PUSHER_APP_ID=your_id
PUSHER_KEY=your_key
PUSHER_SECRET=your_secret
PUSHER_CLUSTER=your_cluster
NEXT_PUBLIC_PUSHER_KEY=your_key
NEXT_PUBLIC_PUSHER_CLUSTER=your_cluster
```

### 3. Installation & Development

```bash
npm install
npm run dev
```

---

## 📄 License

This project is part of the Splashify Pro ecosystem. All rights reserved.

<p align="center">
  <b>Built with ❤️ using <a href="https://www.sarvam.ai/">Sarvam AI</a></b>
</p>
