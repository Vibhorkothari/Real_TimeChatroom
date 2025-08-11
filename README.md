# Real-Time Chatroom 💬

A modern, responsive real-time chat application built with React, Node.js, Socket.io, and MongoDB.

## ✨ Features

- 🔐 **Authentication** - Secure login/register with JWT
- 💬 **Real-time Messaging** - Instant message delivery with Socket.io
- 🏠 **Private Rooms** - Create and join private chat rooms
- 👥 **Direct Messages** - One-on-one conversations
- 🎨 **Dark/Light Mode** - Toggle between themes
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🎭 **Emoji Support** - Rich emoji picker
- 🖼️ **Chat Backgrounds** - Customizable chat wallpapers
- ⚙️ **Room Settings** - Manage room details and members
- 👤 **Member Management** - View room members and roles
- 💾 **Message History** - Persistent chat history with MongoDB TTL
- ❤️ **Message Reactions** - React to messages with emojis

## 🛠️ Tech Stack

### Frontend
- **React** - UI framework
- **Socket.io Client** - Real-time communication
- **Zustand** - State management
- **React Router** - Navigation
- **React Icons** - Icon library
- **React Hot Toast** - Notifications
- **Date-fns** - Date formatting

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Socket.io** - Real-time server
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Real_TimeChatroom
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install client dependencies
   cd client && npm install
   
   # Install server dependencies
   cd ../server && npm install
   ```

3. **Environment Setup**
   ```bash
   # Create .env file in root directory
   cp .env.example .env
   ```
   
   Add your environment variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5001
   ```

4. **Start the application**
   ```bash
   # From root directory
   npm run dev
   ```

   This will start both:
   - Backend server on http://localhost:5001
   - Frontend client on http://localhost:3000

## 📁 Project Structure

```
Real_TimeChatroom/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── store/         # Zustand stores
│   │   ├── context/       # React context
│   │   └── ...
│   └── package.json
├── server/                # Node.js backend
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── middleware/       # Express middleware
│   ├── socket/           # Socket.io handlers
│   └── index.js
├── package.json          # Root package.json
├── .env                  # Environment variables
└── README.md
```

## 🔧 Available Scripts

### Root Directory
- `npm run dev` - Start both client and server in development mode
- `npm run client` - Start only the React client
- `npm run server` - Start only the Node.js server

### Client Directory
- `npm start` - Start React development server
- `npm run build` - Build for production
- `npm test` - Run tests

### Server Directory
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `GET /api/auth/users` - Get all users

### Rooms
- `GET /api/rooms/my-rooms` - Get user's rooms
- `POST /api/rooms` - Create new room
- `GET /api/rooms/:roomId` - Get room details
- `PUT /api/rooms/:roomId` - Update room
- `DELETE /api/rooms/:roomId` - Delete room
- `POST /api/rooms/:roomId/join` - Join room
- `POST /api/rooms/:roomId/leave` - Leave room

### Messages
- `GET /api/messages/room/:roomId` - Get room messages
- `POST /api/messages` - Send message
- `POST /api/messages/:messageId/reactions` - Add reaction

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/chatroom
JWT_SECRET=your_super_secret_jwt_key
PORT=5001
```

## 📱 Features in Detail

### Real-time Communication
- Instant message delivery
- Typing indicators
- Online/offline status
- Message reactions

### User Experience
- Responsive design for all devices
- Dark/light theme toggle
- Customizable chat backgrounds
- Emoji picker
- Message history persistence

### Room Management
- Create private rooms
- Invite members
- Room settings
- Member list
- Leave/delete rooms

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Vibhor Kothari**
- Real-time messaging platform
- Built with modern web technologies
- Responsive and user-friendly design

---

⭐ **Star this repository if you found it helpful!**
