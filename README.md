# Mini CRM Platform - With Redis Integration

A comprehensive Mini CRM platform built for the Xeno SDE Internship Assignment. This platform enables customer segmentation, personalized campaign delivery, real-time event processing through Redis Pub/Sub, and incorporates AI-powered features.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Architecture Evolution](#architecture-evolution)
- [Tech Stack](#tech-stack)
- [Key Features](#key-features)
- [Redis Implementation](#redis-implementation)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Development Workflow](#development-workflow)
- [Screenshots](#screenshots)
- [Known Limitations](#known-limitations)
- [Future Enhancements](#future-enhancements)

## 🚀 Project Overview

This Mini CRM platform provides a complete customer relationship management solution with:

- **Customer & Order Management**: CSV-based import and real-time data processing
- **Advanced Segmentation**: Flexible rule-based audience targeting with AND/OR logic
- **Campaign Management**: AI-powered campaign creation with automated delivery
- **Real-time Event Processing**: Redis Pub/Sub for instant notifications and workflow automation
- **Authentication**: Secure Google OAuth 2.0 integration
- **AI Integration**: Google Gemini-powered message generation and content suggestions
- **Scalable Architecture**: Kafka-based message queuing with background workers

## 🏗️ Architecture Evolution

### Original Architecture (Pre-Redis)
The platform initially used a simpler architecture focused on direct database operations and Kafka messaging:

![Original Architecture](./architeccture.jpeg)
*Original architecture with MongoDB, Kafka, and basic API layer*

### Updated Architecture (With Redis Integration)
The enhanced architecture introduces Redis for real-time event processing and improved scalability:

![Updated Architecture with Redis](./updated_redis_architechture.png)
*Enhanced architecture featuring Redis Pub/Sub for real-time event handling and improved system integration*

### Key Architectural Improvements with Redis:

1. **Real-time Event Processing**: Redis Pub/Sub enables instant notifications across services
2. **Decoupled Systems**: Services communicate through events, reducing direct dependencies  
3. **Scalability**: Multiple services can subscribe to relevant events independently
4. **Monitoring & Analytics**: Real-time event streams provide better observability
5. **Performance**: In-memory caching reduces database load for frequently accessed data

## 💻 Tech Stack

### Frontend
- **Next.js 14+** with App Router
- **React 19** with TypeScript
- **Tailwind CSS** for styling
- **Zustand** for state management
- **React OAuth Google** for authentication

### Backend
- **Node.js** with Express.js and TypeScript
- **MongoDB** with Mongoose ODM
- **Redis** (Upstash) for Pub/Sub and caching
- **Apache Kafka** for message queuing and background processing
- **Google OAuth 2.0** for authentication
- **Google Gemini AI** for content generation

### Infrastructure & DevOps
- **Upstash Redis** for managed Redis service
- **MongoDB Atlas** (or local MongoDB)
- **Kafka** for distributed messaging
- **Swagger** for API documentation

## ⭐ Key Features

### Core CRM Features
- ✅ **Customer Management**: Import customers via CSV with deduplication
- ✅ **Order Management**: Track customer orders and revenue data
- ✅ **Advanced Segmentation**: Create complex audience rules with AND/OR logic
- ✅ **Campaign Creation**: Design and send targeted campaigns
- ✅ **Real-time Analytics**: Monitor campaign performance and delivery status

### Advanced Features  
- ✅ **AI-Powered Messaging**: Generate personalized campaign content using Google Gemini
- ✅ **Real-time Event Processing**: Redis Pub/Sub for instant notifications
- ✅ **Background Processing**: Kafka-based worker system for scalable operations
- ✅ **Authentication**: Secure Google OAuth integration
- ✅ **API Documentation**: Comprehensive Swagger documentation

## 🔥 Redis Implementation

### Redis Pub/Sub Channels

The platform uses Redis for real-time event processing across the following channels:

| Channel | Event Trigger | Purpose |
|---------|---------------|---------|
| `customer:created` | New customer creation | Notify services, trigger workflows |
| `customer:updated` | Customer data modification | Sync updates across services |  
| `order:created` | New order placement | Start order processing, inventory updates |
| `campaign:created` | Campaign creation | Prepare analytics, setup tracking |
| `campaign:queued` | Campaign queued for delivery | Begin dispatch workflow |
| `segmentRule:created` | New segmentation rule | Update real-time targeting logic |

### Event Publishing

Events are published in the following services:

```typescript
// Customer events
await redis.publish("customer:created", JSON.stringify(customerData));
await redis.publish("customer:updated", JSON.stringify(customerData));

// Order events  
await redis.publish('order:created', JSON.stringify(orderData));

// Campaign events
await redis.publish('campaign:created', JSON.stringify(campaignData));
await redis.publish('campaign:queued', JSON.stringify(campaignData));

// Segmentation events
await redis.publish('segmentRule:created', JSON.stringify(ruleData));
```

### Event Subscription

The platform subscribes to all events via `redisSubscriber.ts` for monitoring and logging:

```typescript
// Subscribe to all channels for monitoring
const channels = [
  "customer:created", "customer:updated", 
  "order:created", "campaign:created", 
  "campaign:queued", "segmentRule:created"
];

sub.subscribe(...channels);
sub.on("message", (channel, message) => {
  // Process events based on channel
});
```

### Redis Configuration

Redis is configured for Upstash with TLS:

```typescript
const redis = new Redis(process.env.UPSTASH_REDIS_URL, {
  password: process.env.UPSTASH_REDIS_PASSWORD,
  tls: {}, // Upstash requires TLS
});
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18+ recommended)
- **npm** (v9+) or yarn
- **MongoDB** (local installation or MongoDB Atlas)
- **Redis** (Upstash or local Redis server)
- **Kafka** (optional, for background processing)
- **Google Cloud OAuth 2.0** credentials
- **Google Gemini API** key (optional, for AI features)

### Repository Structure

```
├── backend/                 # Express.js + TypeScript API
│   ├── src/
│   │   ├── apis/           # Controllers, routes, services
│   │   ├── models/         # Mongoose schemas
│   │   ├── utils/          # Redis, Kafka, DB utilities
│   │   ├── workers/        # Background Kafka workers
│   │   └── docs/          # Swagger documentation
│   └── package.json
├── frontend/               # Next.js application
│   ├── app/               # Next.js App Router pages
│   ├── components/        # React components
│   ├── store/            # Zustand state management
│   └── package.json
├── architeccture.jpeg      # Original architecture diagram
├── updated_redis_architechture.png  # New Redis architecture
└── README.md
```

## 📸 Screenshots

Below are screenshots showcasing the main features of the Mini CRM platform:

### Dashboard & Analytics
| Dashboard Overview | Campaign Management |
|:--:|:--:|
| ![Dashboard](./dashboard.jpeg) | ![Campaign](./campaign.png) |
| *Main dashboard with key metrics and quick actions* | *Campaign creation with AI-powered message editor* |

### Customer & Order Management  
| Customer Management | Order Tracking |
|:--:|:--:|
| ![Customers](./customer.png) | ![Orders](./orders.png) |
| *Customer list with import and filtering capabilities* | *Order management and revenue tracking* |

### Advanced Features
| Segmentation Rules | System Architecture |
|:--:|:--:|
| ![Segmentation](./segmentationrule.png) | ![Architecture](./updated_redis_architechture.png) |
| *Advanced rule builder with AND/OR logic* | *Updated system architecture with Redis integration* |

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
   ```bash
   cp .env.example .env  # Create .env file with required variables
   ```

4. **Start development server:**
   ```bash
   npm run dev          # Development with auto-reload
   ```

5. **Build for production:**
   ```bash
   npm run build        # Compile TypeScript
   npm start           # Run production server
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
   ```bash
   cp .env.local.example .env.local  # Create environment file
   ```

4. **Start development server:**
   ```bash
   npm run dev          # Start Next.js dev server
   ```

5. **Build for production:**
   ```bash
   npm run build        # Build for production
   npm start           # Start production server
   ```

### Available Scripts

**Backend Scripts:**
- `npm run dev` - Start development server with nodemon
- `npm run build` - Compile TypeScript to JavaScript  
- `npm start` - Run compiled production server

**Frontend Scripts:**
- `npm run dev` - Start Next.js development server
- `npm run build` - Build optimized production bundle
- `npm start` - Start production server
- `npm run lint` - Run ESLint for code quality

## ⚙️ Environment Variables

### Backend Configuration (`backend/.env`)

```env
# Server Configuration
PORT=5001

# Database Configuration  
MONGO_URI=mongodb://localhost:27017/mini-crm
# Or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/mini-crm

# Redis Configuration (Upstash)
UPSTASH_REDIS_URL=rediss://your-upstash-redis-url
UPSTASH_REDIS_PASSWORD=your-upstash-password

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# JWT Configuration (if using custom tokens)
JWT_SECRET=your-jwt-secret-key

# Kafka Configuration (Optional)
KAFKA_BROKERS=localhost:9092
KAFKA_CLIENT_ID=mini-crm
KAFKA_GROUP_ID=mini-crm-workers
KAFKA_TOPIC_DISPATCH=campaigns.dispatch
KAFKA_TOPIC_DELIVERY=campaigns.delivery  
KAFKA_TOPIC_STATUS=campaigns.status

# SMTP Configuration (for email delivery)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com

# AI Configuration (Optional)
GEMINI_API_KEY=your-gemini-api-key
```

### Frontend Configuration (`frontend/.env.local`)

```env
# API Configuration
NEXT_PUBLIC_BACKEND_URL=http://localhost:5001

# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id

# AI Configuration (Optional - prefer server-side)
GEMINI_API_KEY=your-gemini-api-key
```

### Security Best Practices

⚠️ **Important Security Notes:**
- Never commit `.env` files to version control
- Use different credentials for development and production
- Prefer server-side API calls for sensitive operations
- Rotate API keys regularly
- Use environment-specific configurations

## 📚 API Documentation

The backend provides comprehensive API documentation via Swagger UI:

- **Local Development**: `http://localhost:5001/api-docs`
- **API Base URL**: `http://localhost:5001`

### Key API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/google` | Google OAuth authentication |
| `GET` | `/api/customers` | Get customer list |
| `POST` | `/api/customers` | Create/update customer |
| `POST` | `/api/upload/customers` | Bulk import customers via CSV |
| `POST` | `/api/upload/orders` | Bulk import orders via CSV |
| `GET` | `/api/orders` | Get order list |
| `POST` | `/api/orders` | Create new order |
| `POST` | `/api/segment-rules` | Create segmentation rule |
| `GET` | `/api/segment-rules` | Get segmentation rules |
| `POST` | `/api/campaigns` | Create new campaign |
| `POST` | `/api/campaigns/:id/queue` | Queue campaign for delivery |
| `GET` | `/api/status/:campaignId` | Get campaign delivery status |

## 👨‍💻 Development Workflow

### Backend Development

1. **Adding New Features:**
   ```bash
   # Create new controller
   backend/src/apis/controllers/feature.controller.ts
   
   # Create service layer  
   backend/src/apis/services/feature.service.ts
   
   # Add routes
   backend/src/apis/routes/feature.route.ts
   
   # Update main app.ts to include routes
   ```

2. **Database Models:**
   - Models are located in `backend/src/models/`
   - Uses Mongoose ODM with TypeScript
   - Connection handled by `backend/src/utils/connectDb.ts`

3. **Redis Event Publishing:**
   ```typescript
   import redis from '../utils/redis';
   
   // Publish events after data operations
   await redis.publish('event:name', JSON.stringify(data));
   ```

4. **Kafka Workers:**
   - Background workers in `backend/src/workers/`
   - Use `kafkajs` library for message processing
   - Topics defined in `backend/src/utils/kafka.ts`

### Frontend Development

1. **Adding New Pages:**
   ```bash
   # Create page using App Router
   frontend/app/feature/page.tsx
   
   # Add reusable components
   frontend/components/Feature.tsx
   ```

2. **State Management:**
   - Uses Zustand for client-side state
   - Auth state: `frontend/store/useAuthStore.ts`
   - Update store patterns for new features

3. **API Integration:**
   ```typescript
   // Make API calls to backend
   const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/endpoint`);
   ```

## 🚧 Known Limitations

### Current Limitations
- **Testing**: No automated test suite implemented
- **Email Integration**: Campaign delivery is simulated (not integrated with real email providers)
- **UI Features**: Some advanced analytics and campaign history features are incomplete
- **Error Handling**: Limited error boundaries and retry mechanisms
- **Caching**: Redis caching not fully implemented for all data operations

### Performance Considerations  
- **Database Queries**: Some complex segmentation queries could be optimized
- **File Uploads**: Large CSV processing might timeout without proper chunking
- **Real-time Updates**: WebSocket connections not implemented for live dashboard updates

## 🔮 Future Enhancements

### Planned Features
1. **Testing Infrastructure**
   - Unit tests with Jest/Vitest
   - Integration tests with Supertest
   - E2E tests with Playwright

2. **Production Readiness**
   - Docker containerization with docker-compose
   - CI/CD pipeline setup
   - Environment-specific configurations
   - Monitoring and logging improvements

3. **Advanced Analytics**
   - Real-time campaign performance metrics
   - Customer lifetime value calculations  
   - Advanced segmentation insights
   - A/B testing for campaigns

4. **Integration Improvements**
   - Real email service providers (SendGrid, Amazon SES)
   - SMS campaign support
   - Social media integrations
   - Webhook support for external systems

5. **Performance & Scalability**
   - Redis caching for frequently accessed data
   - Database indexing optimization
   - Background job queuing improvements
   - WebSocket for real-time updates

### Technical Debt
- Fix TypeScript compilation errors
- Implement proper error boundaries
- Add request validation middleware
- Optimize database queries
- Add rate limiting and security headers

## 🔗 Links & Resources

- **Architecture Board**: [Eraser.io Workspace](https://app.eraser.io/workspace/yyAluEDWqQb71DYQqJBn?origin=share)
- **Original Architecture**: [Legacy Eraser Board](https://app.eraser.io/workspace/36ANjKUhFR08RVT2h4PA?origin=share)

## 📞 Support & Contributing

For questions, issues, or contributions:

1. Check the console logs for detailed error messages
2. Ensure all required services (MongoDB, Redis, Kafka) are running
3. Verify environment variables are correctly configured
4. Review the API documentation at `/api-docs`

## 📜 License

No license file present. Add a `LICENSE` file if you intend to open-source this repository.

---

**Built with ❤️ for the Xeno SDE Internship Assignment**
