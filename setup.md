# AMIT CRM Management - Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v18.x or later)
- MongoDB (local or MongoDB Atlas)
- Kafka (for message queuing)
- Google Cloud Platform project with OAuth 2.0 credentials

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   Create a `.env` file in the `backend` directory with the following content:
   ```env
   # Server Configuration
   PORT=5001

   # Database Configuration
   MONGO_URI=mongodb://localhost:27017/amit-crm

   # JWT Configuration
   JWT_SECRET=your_strong_jwt_secret_key_here

   # Google OAuth Configuration
   GOOGLE_CLIENT_ID=your_google_oauth_client_id
   GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret

   # Kafka Configuration
   KAFKA_BROKERS=localhost:9092
   KAFKA_CLIENT_ID=amit-crm
   KAFKA_GROUP_ID=amit-crm-group
   KAFKA_TOPIC_DISPATCH=campaigns.dispatch
   KAFKA_TOPIC_DELIVERY=campaigns.delivery
   KAFKA_TOPIC_STATUS=campaigns.status

   # Email Configuration (SMTP)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   SMTP_FROM=noreply@amitcrm.com
   ```

4. **Start the backend server:**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   Create a `.env.local` file in the `frontend` directory with the following content:
   ```env
   # Google OAuth Configuration
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_oauth_client_id

   # Backend API URL
   NEXT_PUBLIC_BACKEND_URL=http://localhost:5001

   # AI Configuration (for message generation)
   GEMINI_API_KEY=your_google_gemini_api_key
   ```

4. **Start the frontend development server:**
   ```bash
   npm run dev
   ```

## 🎯 Features Implemented

### ✅ Core Features
- **Customer Management**: Import and manage customer data via CSV uploads
- **Order Management**: Track customer orders and revenue
- **Segment Rules**: Create intelligent customer segments with AND/OR logic
- **Campaign Creation**: Design targeted email campaigns with AI-powered messaging
- **Real-time Status Tracking**: Monitor campaign delivery with live updates

### ✅ Advanced Features
- **Kafka Message Queuing**: Scalable message delivery with proper status tracking
- **AI Integration**: Google Gemini-powered message generation
- **Modern UI**: Beautiful, responsive design with AMIT CRM branding
- **Performance Optimized**: Efficient data fetching and state management
- **Real-time Updates**: Live campaign status monitoring

### ✅ Message Flow
1. **Draft**: Campaign created but not sent
2. **Queued**: Campaign added to Kafka queue
3. **Processing**: Campaign being prepared for delivery
4. **Sending**: Messages being sent to customers
5. **Sent**: Campaign completed successfully
6. **Partial Failed**: Some messages failed to send
7. **Failed**: Campaign failed completely

## 🔧 Configuration

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000` (for development)
   - Your production domain (for production)

### Kafka Setup
1. Install Kafka locally or use a cloud service
2. Start Zookeeper: `bin/zookeeper-server-start.sh config/zookeeper.properties`
3. Start Kafka: `bin/kafka-server-start.sh config/server.properties`
4. Create topics:
   ```bash
   bin/kafka-topics.sh --create --topic campaigns.dispatch --bootstrap-server localhost:9092
   bin/kafka-topics.sh --create --topic campaigns.delivery --bootstrap-server localhost:9092
   bin/kafka-topics.sh --create --topic campaigns.status --bootstrap-server localhost:9092
   ```

### MongoDB Setup
1. Install MongoDB locally or use MongoDB Atlas
2. Create a database named `amit-crm`
3. Update the `MONGO_URI` in your `.env` file

## 📊 API Documentation

Once the backend is running, you can access the Swagger API documentation at:
`http://localhost:5001/api-docs`

## 🎨 UI Features

- **Modern Design**: Clean, professional interface with AMIT CRM branding
- **Responsive Layout**: Works on desktop and mobile devices
- **Real-time Updates**: Live campaign status monitoring
- **Interactive Components**: Smooth animations and transitions
- **Data Visualization**: Charts and progress indicators
- **Intuitive Navigation**: Easy-to-use sidebar navigation

## 🚀 Deployment

### Backend Deployment
- Deploy to services like Render, Heroku, or AWS
- Set up MongoDB Atlas for database
- Configure Kafka cluster (or use cloud service)
- Update environment variables

### Frontend Deployment
- Deploy to Vercel, Netlify, or similar
- Update `NEXT_PUBLIC_BACKEND_URL` to production API URL
- Configure Google OAuth for production domain

## 🎯 Next Steps

1. Set up your environment variables
2. Start MongoDB and Kafka services
3. Run the backend server
4. Run the frontend development server
5. Access the application at `http://localhost:3000`
6. Create your first customer segment and campaign!

## 📞 Support

For any issues or questions, please check the console logs and ensure all services are running properly.
