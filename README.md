# Safoyana Digital Print

A comprehensive web-based custom manufacturing and e-commerce system designed to handle complex "Configure-and-Order" flows. This platform allows customers to customize print products, receive instant dynamic pricing, upload artwork, and manage their orders seamlessly.

## 🚀 Key Features

- **Configure-and-Order Flow:** Advanced product configuration supporting diverse print requirements and flexible product attributes using JSONB storage.
- **Dynamic Instant Quotes:** A robust pricing engine that calculates costs in real-time based on selected configurations and quantities.
- **Custom Artwork Uploads:** Secure file handling architecture for customers to upload and manage custom designs for their print orders.
- **Role-Based Access Control (RBAC):** Distinct access levels and dashboards for standard customers and system administrators.
- **Comprehensive Order Management:** Full lifecycle tracking from initial quote to final print fulfillment.

## 🛠️ Tech Stack

- **Frontend:** [Next.js](https://nextjs.org/)
- **Backend Framework:** [NestJS](https://nestjs.com/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Prisma](https://www.prisma.io/)

## 📂 Architecture Overview

The application is built as a modern full-stack platform. The **Next.js frontend** provides a fast, SEO-friendly, and highly interactive user experience for customers configuring their print orders.

The **NestJS backend** handles complex business logic with scalability in mind. The relational database schema is heavily optimized for e-commerce, utilizing PostgreSQL's native JSONB capabilities to handle dynamic product attributes without rigid table constraints. The API structure is logically segmented into modules for:

- Product Configuration & Inventory
- Dynamic Pricing Calculations
- Order & Checkout Management
- Secure File Handling

## ⚙️ Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- PostgreSQL
- npm or yarn
