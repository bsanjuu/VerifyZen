# VerifyZen Backend

Production-ready backend API for the VerifyZen credential verification SaaS platform.

## Features

- **TypeScript** - Full type safety and modern JavaScript features
- **Express.js** - Fast, unopinionated web framework
- **PostgreSQL** - Robust relational database with Sequelize ORM
- **AWS Integration** - S3, Textract, DynamoDB, Step Functions, SES
- **OpenAI** - AI-powered document parsing and analysis
- **JWT Authentication** - Secure token-based authentication
- **Rate Limiting** - Protection against abuse
- **Comprehensive Validation** - Zod schema validation
- **Professional Logging** - Winston logger with multiple transports
- **Docker Support** - Full containerization with Docker Compose

## Project Structure

```
backend/
├── src/
│   ├── api/
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Express middleware
│   │   └── routes/          # API routes
│   ├── config/              # Configuration files
│   ├── external/            # External API clients
│   ├── lambdas/             # AWS Lambda functions
│   ├── models/              # Database models
│   ├── services/            # Business logic
│   ├── utils/               # Utility functions
│   ├── workflows/           # Step Functions definitions
│   ├── app.ts               # Express app configuration
│   └── server.ts            # Server entry point
├── database/
│   ├── migrations/          # Database migrations
│   └── seeders/             # Database seeders
├── Dockerfile               # Docker configuration
├── docker-compose.yml       # Docker Compose setup
└── package.json             # Dependencies and scripts
```

## Prerequisites

- Node.js >= 18.0.0
- PostgreSQL >= 13
- Redis (optional, for caching)
- AWS Account (for S3, Textract, etc.)
- OpenAI API Key

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in your configuration:

```bash
cp .env.example .env
```

Edit `.env` with your credentials.

### 3. Database Setup

Create the database and run migrations:

```bash
# Using Sequelize CLI
npx sequelize-cli db:create
npx sequelize-cli db:migrate

# Or use the npm script
npm run migrate
```

### 4. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000`

## Docker Setup

### Using Docker Compose (Recommended)

```bash
# Start all services (PostgreSQL, Redis, Backend)
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop all services
docker-compose down
```

### Build Docker Image Only

```bash
docker build -t verifyzen-backend .
```

## API Documentation

### Authentication Endpoints

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh access token

### Candidate Endpoints

- `POST /api/v1/candidates` - Create candidate
- `GET /api/v1/candidates` - List candidates
- `GET /api/v1/candidates/:id` - Get candidate details
- `PUT /api/v1/candidates/:id` - Update candidate
- `DELETE /api/v1/candidates/:id` - Delete candidate

### Verification Endpoints

- `POST /api/v1/verifications` - Start verification
- `GET /api/v1/verifications/:id` - Get verification status
- `GET /api/v1/verifications` - List verifications

### Report Endpoints

- `GET /api/v1/reports/:id` - Get verification report
- `GET /api/v1/reports/:id/pdf` - Download PDF report

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix linting issues
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database with test data

## Database Models

### User
- Authentication and authorization
- Subscription management
- API key generation

### Candidate
- Candidate information
- Resume storage
- LinkedIn profile links

### Company
- Company verification database
- Status tracking
- Metadata storage

### VerificationResult
- Verification status
- Risk scores
- Findings and recommendations
- Generated reports

## External Services Integration

### AWS Services

- **S3** - Document storage (resumes, reports)
- **Textract** - Document text extraction
- **DynamoDB** - Fast caching layer
- **SES** - Email notifications
- **Step Functions** - Workflow orchestration

### Third-Party APIs

- **OpenAI** - Document parsing and analysis
- **LinkedIn API** - Profile verification
- **Clearbit** - Company information
- **Crunchbase** - Company verification
- **Hipolabs** - Education institution verification

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation with Zod
- SQL injection prevention (Sequelize ORM)
- XSS protection

## Environment Variables

See `.env.example` for all required and optional environment variables.

### Required Variables

- `JWT_SECRET` - JWT signing secret (min 32 chars)
- `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` - Database configuration
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` - AWS credentials
- `OPENAI_API_KEY` - OpenAI API key

### Optional Variables

- `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET` - LinkedIn OAuth
- `STRIPE_SECRET_KEY` - Payment processing
- `CLEARBIT_API_KEY`, `CRUNCHBASE_API_KEY` - Enhanced company verification

## Deployment

### AWS Deployment

1. Build Docker image:
```bash
docker build -t verifyzen-backend .
```

2. Push to ECR:
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin your-account-id.dkr.ecr.us-east-1.amazonaws.com
docker tag verifyzen-backend:latest your-account-id.dkr.ecr.us-east-1.amazonaws.com/verifyzen-backend:latest
docker push your-account-id.dkr.ecr.us-east-1.amazonaws.com/verifyzen-backend:latest
```

3. Deploy to ECS/Fargate using AWS Console or Terraform

### Health Check

The API includes a health check endpoint:

```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2025-11-29T12:00:00.000Z",
  "uptime": 123.456,
  "environment": "development"
}
```

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

## Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL is running
- Check database credentials in `.env`
- Verify network connectivity

### AWS Service Errors

- Verify AWS credentials
- Check IAM permissions
- Ensure services are available in your region

### OpenAI API Errors

- Verify API key is valid
- Check API rate limits
- Ensure sufficient credits

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Submit a pull request

## License

MIT

## Support

For support, email support@verifyzen.com or open an issue on GitHub.
