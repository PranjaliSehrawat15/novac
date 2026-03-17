<div align="center">

# 🚀 NovaCRM
### AI-Powered Smart Sales Platform

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![AWS](https://img.shields.io/badge/Amazon_AWS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)](https://aws.amazon.com/)
[![DynamoDB](https://img.shields.io/badge/Amazon%20DynamoDB-4053D6?style=for-the-badge&logo=Amazon%20DynamoDB&logoColor=white)](https://aws.amazon.com/dynamodb/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)](https://jwt.io/)

**NovaCRM** is a full-stack, cloud-native CRM platform that integrates AI-powered automation via **Amazon Bedrock** and **Amazon Nova** foundation models — making your entire sales pipeline smarter, faster, and more efficient.

🌐 **Live Demo:** [novacrm-sigma.vercel.app](https://novacrm-sigma.vercel.app/login)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Architecture](#-architecture) • [Getting Started](#-getting-started) • [AI Capabilities](#-ai-capabilities) • [Roadmap](#-roadmap)

</div>

---

## 💡 Inspiration

Traditional CRM systems are passive — they store data but offer little intelligence. Sales reps spend valuable time manually writing follow-up emails, analyzing leads, and organizing meeting notes instead of building relationships.

NovaCRM was built to change that. By integrating **Amazon Nova** models through **Amazon Bedrock**, it transforms the CRM from a passive database into an active sales co-pilot.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Secure Authentication** | JWT-based login with role-based access control (Admin / Manager / Employee) |
| 👥 **Lead Management** | Create, assign, and track leads through customizable pipeline stages |
| 💼 **Deal & Pipeline Tracking** | Visualize deals moving through your sales funnel in real time |
| 📝 **Activity & Notes** | Log interactions, meetings, and notes tied to specific leads and deals |
| 📊 **Analytics Dashboard** | Gain insights into team performance, lead conversion, and deal health |
| 🤖 **AI Email Generation** | Auto-generate personalized follow-up emails with Amazon Nova |
| 🧠 **Meeting Summarization** | AI-powered summarization of meeting notes for quick review |
| 🔍 **Lead Intelligence** | AI-driven analysis of leads to prioritize opportunities |
| 💬 **CRM AI Assistant** | Ask natural language questions about your CRM data |

---

## 🛠 Tech Stack

### Frontend
- **React** + **Vite** — Fast, responsive SPA with component-driven architecture

### Backend
- **Node.js** + **Express.js** — RESTful API with modular routes and controllers
- **JWT** — Stateless authentication and authorization tokens

### Database
- **Amazon DynamoDB** — Scalable NoSQL storage for all CRM entities

### AI / Cloud
- **Amazon Bedrock** — Managed AI service for accessing foundation models
- **Amazon Nova** — Foundation models powering email generation, summarization, and lead analysis
- **AWS** — Cloud infrastructure and deployment

---

## 🏗 Architecture

```
┌──────────────────────────────────────────────────────────┐
│                   Frontend  (React + Vite)                │
│   Dashboard │ Leads │ Deals │ Activities │ Analytics      │
└──────────────────────┬───────────────────────────────────┘
                       │  REST API
┌──────────────────────▼───────────────────────────────────┐
│                Backend  (Node.js + Express)               │
│   Auth │ CRM Routes │ AI Routes │ Analytics Routes        │
└──────┬────────────────────────────────┬──────────────────┘
       │                                │
┌──────▼──────────┐         ┌───────────▼──────────────┐
│  Amazon         │         │  Amazon Bedrock           │
│  DynamoDB       │         │  (Amazon Nova AI)         │
│  Users · Leads  │         │  Email · Summary · Leads  │
│  Deals · Notes  │         └──────────────────────────┘
└─────────────────┘
```

---

## 🤖 AI Capabilities

Powered by **Amazon Nova** through **Amazon Bedrock**:

- ✉️ **Follow-Up Email Generation** — Draft personalized emails based on lead context
- 📋 **Meeting Note Summarization** — Extract key decisions and action items instantly
- 🔎 **Lead Analysis & Insights** — Surface high-priority opportunities automatically
- 💬 **Natural Language Assistant** — Query your CRM in plain English

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- AWS Account with Bedrock access enabled
- Amazon DynamoDB tables provisioned

### Installation

```bash
# Clone the repository
git clone https://github.com/paarth293/novac.git
cd novac/novac_aws

# Install backend dependencies
npm install
```

### Environment Variables

Create a `.env` file:

```env
PORT=5000
JWT_SECRET=your_jwt_secret_key
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
DYNAMODB_TABLE_PREFIX=novacrm_
BEDROCK_MODEL_ID=amazon.nova-pro-v1:0
```

### Run

```bash
npm run dev
```

---

## 🔐 Role-Based Access Control

| Role | Capabilities |
|---|---|
| **Admin** | Full access — manage users, all leads, deals, settings |
| **Manager** | View team leads/deals, assign leads, view analytics |
| **Employee** | Manage own leads, deals, log activities, use AI tools |

---

## 📈 Roadmap

- [ ] Advanced Lead Scoring
- [ ] Predictive Sales Analytics & Deal Forecasting
- [ ] Automated Communication Workflows
- [ ] Enhanced Natural Language AI Assistant
- [ ] Third-Party Integrations (Slack, Google Workspace)
- [ ] Deeper Analytics Dashboards

---

<div align="center">

**Built with ❤️ using Amazon Bedrock · Amazon Nova · React · Node.js · DynamoDB**

⭐ Star this repo if you found it useful!

</div>
