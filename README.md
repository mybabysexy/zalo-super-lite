# Super Lite Zalo

A super lite Zalo client for old devices, specially made for BlackBerry 9900.

## Description

Super Lite Zalo is a lightweight web application designed to bring modern messaging capabilities to legacy devices with limited processing power and older browsers. This project particularly targets the BlackBerry 9900 and similar older devices, providing a minimalistic yet functional messaging experience compatible with Zalo's messaging platform.

## Preview

Here are some pictures of the application:

![Preview 1](/public/images/preview-1.jpg)
![Preview 2](/public/images/preview-2.jpg)
![Preview 3](/public/images/preview-3.jpg)

(Yeah, I took the picture by another phone, since I can't find any working screen capture tool available)

## Features

- Send and receive direct messages
- Receive stickers and emojis
- Lightweight interface optimized for low-end devices
- IE8 compatibility for legacy browser support
- Login with token authentication
- Mobile-friendly responsive design

## Coming Soon

- Group chat support
- Message search functionality
- Media sharing improvements
- Performance optimizations for even older devices

## Installation

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Local Development

```bash
# Clone the repository
git clone https://github.com/duc1607/bb-zl-ejs.git

# Navigate to the project directory
cd bb-zl-ejs

# Install dependencies
npm install

# Start development server
npm run dev
```

### Docker Deployment

```bash
# Build and start with Docker Compose
docker-compose up -d

# View logs
docker logs bb-zl-ejs

# Stop the container
docker-compose down
```

## Technology Stack

- Express.js 5.0.0
- EJS 3.1.10 templating
- WebSockets (ws) for real-time messaging
- Docker containerization

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

Please follow the existing code style and make sure your changes pass linting.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

- **duc1607**

## Acknowledgments

- Special thanks to [RFS-ADRENO](https://github.com/RFS-ADRENO) for creating [zca-js](https://github.com/RFS-ADRENO/zca-js), which is a core library used in this project
- Special thanks to the BlackBerry community for keeping these devices alive
