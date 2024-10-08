# MicroEvalX - Microservices for File Encryption and Decryption

## Overview
MicroEvalX is a robust microservice architecture designed to securely handle the encryption and decryption of files stored in a cloud environment. This system uses modern security practices to ensure that all file operations are secure and scalable, suitable for enterprise-level applications.

## Architecture
MicroEvalX consists of several microservices, each responsible for a part of the system functionality. The architecture promotes scalability, security, and efficient data handling.

### Microservices:
1. **Authentication Service**
2. **User Profile Service**
3. **Encryption Service**
4. **Decryption Service**
5. **File Management Service**
6. **API Gateway**
7. **Key Management Service** (Optional)
8. **Logging Service** (Optional)
9. **Monitoring Service** (Optional)

## Features

### 1. Authentication Service
- Handles user authentication processes such as login, registration, and logout.
- Uses JSON Web Tokens (JWT) to manage user sessions securely.

### 2. User Profile Service
- Manages user profile information including updating and retrieving user details.
- Integrates with the Authentication Service for secure access to user data.

### 3. Encryption Service
- Provides file encryption services using AES CFB mode before storing files in the database.
- Works with the Key Management Service for secure key handling.

### 4. Decryption Service
- Handles decryption of files upon user request, ensuring files are securely transmitted back to the user.

### 5. File Management Service
- Manages file uploads and downloads, maintaining a secure and efficient file storage system.
- Ensures integrity checks and supports large file operations.

### 6. API Gateway
- Routes requests to appropriate microservices and handles load balancing.
- Manages API request authentication and authorization.

### 7. Key Management Service (Optional)
- Manages encryption keys, providing key storage, rotation, and retrieval functionality.

### 8. Logging Service (Optional)
- Captures and stores logs from all microservices, providing insights and aiding in troubleshooting.

### 9. Monitoring Service (Optional)
- Monitors microservice health and performance, alerting administrators to potential issues.

## Technology Stack

### Database
- **Supabase PostgreSQL**: Main database for storing user and file metadata.
- **MongoDB/Firebase**: Used by the Encryption Service to store encrypted file metadata.

### Storage
- **Supabase Storage/AWS S3**: For storing encrypted files, ensuring high availability and security.

### Security
- **OWASP ZAP, SonarQube**: Tools for security testing and code quality analysis.
- **AWS KMS/HashiCorp Vault**: For managing encryption keys securely.

### Testing and Monitoring
- **Postman, JMeter**: For API testing and performance evaluation.
- **Gatling, Chaos Monkey**: For load testing and resilience testing.
- **Prometheus, Grafana**: For monitoring services and visualizing metrics.
- **Kibana, Grafana + Loki**: For log management and analysis.

### Deployment
- **Docker & Kubernetes**: For containerization and orchestration, enabling easy scaling and management of microservices.
- **Istio**: Service mesh for secure and efficient service-to-service communication.

## Setup and Deployment
Detailed instructions on setting up and deploying the microservices will be provided, covering configuration, dependencies, and environmental setup.

## Contribution
Contributions to MicroEvalX are welcome. Please refer to our contribution guidelines for more information on how to submit pull requests, report issues, and request features.
