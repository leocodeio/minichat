# MiniChat - WhatsApp Clone Implementation

## Completed Tasks
- [x] Make the .env reach ./app/server/services/auth/auth-client.ts
- [x] Setup basic screens for landingpage, auth, and dashboard
- [x] Setup endpoints and middlewares correctly for better auth
- [x] Implement email/password authentication
- [x] Implement session management
- [x] Implement i18n
- [x] Implement shadcn ui
- [x] Implement multi color
- [x] Implement dark mode
- [x] Error pages

---

## Phase 1: Database Schema & Models

### 1.1 Extend User Model
- [x] Add unique user code generation system
   - [x] Create unique 8-10 character alphanumeric code for each user
   - [x] Add `uniqueCode` field to User model in Prisma schema
   - [x] Add index on uniqueCode for fast lookups
   - [x] Implement code generation utility function
   - [x] Add code uniqueness validation

### 1.2 Create Chat Models
- [x] Design and implement Chat/Conversation model
   - [x] Create Chat model with id, createdAt, updatedAt
   - [x] Add isGroup field (for future group chat support)
   - [x] Add ChatParticipant junction table
   - [x] Link Chat to User through ChatParticipant
   - [x] Add lastMessageAt timestamp
   - [x] Add chat metadata (name, description for groups)

### 1.3 Create Message Model
- [x] Design and implement Message model
   - [x] Create Message model with id, content, createdAt
   - [x] Add sender relationship (User)
   - [x] Add chat relationship (Chat)
   - [x] Add message status (sent, delivered, read)
   - [x] Add message type (text, image, file, etc.)
   - [x] Add readBy array for tracking read receipts
   - [x] Add replyTo for message threading
   - [x] Add deletedAt for soft deletes

### 1.4 Create Contact/Friend System
- [x] Design Contact model
   - [x] Create Contact/Friend model
   - [x] Add user-to-user relationship
   - [x] Add contact status (pending, accepted, blocked)
   - [x] Add nickname/custom name field
   - [x] Add createdAt, updatedAt timestamps

### 1.5 Run Migrations
- [x] Generate Prisma migration
- [x] Test migration on development database
- [x] Update Prisma client
- [x] Seed test data if needed

---

## Phase 2: Backend API Development

### 2.1 User Profile APIs
- [x] Create user profile endpoints
   - [x] GET /api/user/profile - Get current user profile
   - [x] PUT /api/user/profile - Update user profile
   - [x] GET /api/user/by-code/:code - Find user by unique code
   - [x] POST /api/user/regenerate-code - Generate new unique code
   - [x] PUT /api/user/profile-picture - Upload profile picture

### 2.2 Contact Management APIs
- [x] Create contact endpoints
   - [x] POST /api/contacts/add - Add contact by unique code
   - [x] GET /api/contacts - Get all contacts
   - [x] PUT /api/contacts/:id - Update contact (nickname)
   - [x] DELETE /api/contacts/:id - Remove contact
   - [x] POST /api/contacts/:id/block - Block contact
   - [x] GET /api/contacts/search - Search contacts

### 2.3 Chat Management APIs
- [x] Create chat endpoints
   - [x] POST /api/chats - Create new chat
   - [x] GET /api/chats - Get all user chats (with last message)
   - [x] GET /api/chats/:id - Get specific chat details
   - [x] DELETE /api/chats/:id - Delete chat
   - [x] PUT /api/chats/:id/archive - Archive/unarchive chat
   - [x] GET /api/chats/:id/messages - Get chat messages (paginated)

### 2.4 Message APIs
- [x] Create message endpoints
   - [x] POST /api/messages - Send message
   - [x] GET /api/messages/:id - Get specific message
   - [x] PUT /api/messages/:id - Edit message
   - [x] DELETE /api/messages/:id - Delete message
   - [x] POST /api/messages/:id/read - Mark as read
   - [x] POST /api/messages/bulk-read - Mark multiple as read

### 2.5 Real-time WebSocket Setup
- [x] Implement WebSocket/Socket.io
   - [x] Install and configure Socket.io
   - [x] Create WebSocket connection handler
   - [x] Implement authentication for WebSocket
   - [x] Create room management for chats
   - [x] Implement message broadcasting
   - [x] Add typing indicators
   - [x] Add online/offline status
   - [x] Handle reconnection logic

---

## Phase 3: Frontend Components

### 3.1 User Profile Components
- [x] Create profile components
   - [x] ProfileDisplay component (show user info)
   - [x] ProfileEdit component (edit form)
   - [x] UniqueCodeDisplay component (copy to clipboard)
   - [x] ProfilePictureUpload component
   - [ ] QR code generator for unique code (optional)

### 3.2 Contact Components
- [x] Create contact management UI
   - [x] ContactList component
   - [x] ContactCard component
   - [x] AddContactDialog component (search by code)
   - [x] ContactProfile component
   - [x] BlockContactConfirmDialog

### 3.3 Chat List Components
- [ ] Create chat list UI
  - [ ] ChatList component (sidebar)
  - [ ] ChatListItem component
  - [ ] ChatSearch component
  - [ ] NewChatDialog component
  - [ ] ChatListHeader with actions
  - [ ] Unread message badge
  - [ ] Last message preview
  - [ ] Timestamp display

### 3.4 Message Components
- [ ] Create messaging UI
  - [ ] MessageList component (virtualized)
  - [ ] MessageBubble component (sent/received)
  - [ ] MessageInput component
  - [ ] TypingIndicator component
  - [ ] MessageStatus component (checkmarks)
  - [ ] MessageTimestamp component
  - [ ] MessageContextMenu (edit, delete, reply)
  - [ ] ReplyPreview component
  - [ ] EmojiPicker component

### 3.5 Chat Window Components
- [ ] Create chat window layout
  - [ ] ChatHeader component (contact name, status)
  - [ ] ChatBody component (message area)
  - [ ] ChatFooter component (input area)
  - [ ] ChatActions dropdown menu
  - [ ] EmptyChat placeholder
  - [ ] LoadingMessages skeleton

---

## Phase 4: Pages & Layouts

### 4.1 Update Dashboard
- [ ] Transform dashboard into chat layout
  - [ ] Create two-column layout (sidebar + main)
  - [ ] Add responsive mobile layout
  - [ ] Implement chat list sidebar
  - [ ] Implement main chat area
  - [ ] Add empty state when no chat selected

### 4.2 Profile Pages
- [ ] Create profile pages
  - [ ] /dashboard/profile - User profile page
  - [ ] /dashboard/profile/edit - Edit profile page
  - [ ] /dashboard/settings - Settings page

### 4.3 Contact Pages
- [ ] Create contact pages
  - [ ] /dashboard/contacts - Contacts list page
  - [ ] /dashboard/contacts/add - Add contact page

### 4.4 Chat Pages
- [ ] Create chat routing
  - [ ] /dashboard/chat - Main chat interface
  - [ ] /dashboard/chat/:chatId - Specific chat view
  - [ ] Mobile-specific routing logic

---

## Phase 5: Real-time Features

### 5.1 WebSocket Integration
- [ ] Connect frontend to WebSocket
  - [ ] Create WebSocket context/hook
  - [ ] Implement connection management
  - [ ] Handle authentication token
  - [ ] Add reconnection logic
  - [ ] Add error handling

### 5.2 Message Real-time Updates
- [ ] Implement real-time messaging
  - [ ] Send message via WebSocket
  - [ ] Receive message via WebSocket
  - [ ] Update UI on new message
  - [ ] Play notification sound
  - [ ] Show browser notification

### 5.3 Presence & Status
- [ ] Implement user presence
  - [ ] Show online/offline status
  - [ ] Implement typing indicators
  - [ ] Show "last seen" timestamp
  - [ ] Update status in real-time

### 5.4 Message Status Updates
- [ ] Implement delivery receipts
  - [ ] Send delivery confirmation
  - [ ] Send read confirmation
  - [ ] Update message status in UI
  - [ ] Show checkmarks (sent/delivered/read)

---

## Phase 6: File Sharing

### 6.1 File Upload Infrastructure
- [ ] Setup file storage
  - [ ] Choose storage solution (S3, Cloudinary, etc.)
  - [ ] Configure environment variables
  - [ ] Create file upload utility
  - [ ] Implement file validation
  - [ ] Add file size limits

### 6.2 Image Sharing
- [ ] Implement image messages
  - [ ] Create image upload endpoint
  - [ ] Add image preview component
  - [ ] Implement image compression
  - [ ] Add image lightbox/modal view
  - [ ] Generate thumbnails

### 6.3 Document Sharing
- [ ] Implement document messages
  - [ ] Create document upload endpoint
  - [ ] Add document preview component
  - [ ] Show file metadata (name, size, type)
  - [ ] Implement download functionality
  - [ ] Add file icons by type

### 6.4 Message Attachments UI
- [ ] Create attachment components
  - [ ] FileAttachment component
  - [ ] ImageAttachment component
  - [ ] AttachmentPreview component
  - [ ] AttachmentUploadProgress

---

## Phase 7: Enhanced Features

### 7.1 Message Features
- [ ] Implement message actions
  - [ ] Edit message functionality
  - [ ] Delete message functionality
  - [ ] Reply to message
  - [ ] Forward message (future)
  - [ ] Copy message text
  - [ ] Message reactions (optional)

### 7.2 Search Functionality
- [ ] Implement search
  - [ ] Search messages in chat
  - [ ] Search across all chats
  - [ ] Search contacts
  - [ ] Highlight search results
  - [ ] Search history

### 7.3 Notifications
- [ ] Implement notification system
  - [ ] Browser push notifications
  - [ ] In-app notification center
  - [ ] Notification preferences
  - [ ] Mute chat notifications
  - [ ] Sound settings

### 7.4 Chat Settings
- [ ] Implement chat-specific settings
  - [ ] Mute chat
  - [ ] Archive chat
  - [ ] Clear chat history
  - [ ] Export chat
  - [ ] Chat wallpaper (optional)

---

## Phase 8: Security & Privacy

### 8.1 Privacy Controls
- [ ] Implement privacy features
  - [ ] Block users
  - [ ] Report users
  - [ ] Privacy settings page
  - [ ] Control who can message you
  - [ ] Last seen privacy

### 8.2 Message Encryption
- [ ] Consider encryption (optional)
  - [ ] Research end-to-end encryption options
  - [ ] Implement if feasible
  - [ ] Add encryption indicators

### 8.3 Session Management
- [ ] Enhance session security
  - [ ] Active sessions list
  - [ ] Logout from specific device
  - [ ] Logout all devices
  - [ ] Session activity log

---

## Phase 9: Performance Optimization

### 9.1 Database Optimization
- [ ] Optimize queries
  - [ ] Add necessary indexes
  - [ ] Implement pagination for messages
  - [ ] Add caching layer (Redis)
  - [ ] Optimize N+1 queries
  - [ ] Add database query logging

### 9.2 Frontend Optimization
- [ ] Optimize React components
  - [ ] Implement virtual scrolling for messages
  - [ ] Add React.memo where needed
  - [ ] Optimize re-renders
  - [ ] Lazy load images
  - [ ] Code splitting for routes

### 9.3 WebSocket Optimization
- [ ] Optimize real-time performance
  - [ ] Implement message batching
  - [ ] Add connection pooling
  - [ ] Optimize event payload size
  - [ ] Add reconnection backoff

---

## Phase 10: Testing & Deployment

### 10.1 Testing
- [ ] Write tests
  - [ ] Unit tests for utilities
  - [ ] API endpoint tests
  - [ ] Component tests
  - [ ] Integration tests
  - [ ] E2E tests for critical flows

### 10.2 Error Handling
- [ ] Improve error handling
  - [ ] Add global error boundary
  - [ ] Implement error logging
  - [ ] Add user-friendly error messages
  - [ ] Handle offline scenarios
  - [ ] Add retry mechanisms

### 10.3 Documentation
- [ ] Create documentation
  - [ ] API documentation
  - [ ] Component documentation
  - [ ] Deployment guide
  - [ ] User guide
  - [ ] Contributing guide

### 10.4 Deployment
- [ ] Deploy application
  - [ ] Setup production database
  - [ ] Configure environment variables
  - [ ] Setup CI/CD pipeline
  - [ ] Deploy to hosting platform
  - [ ] Setup monitoring and logging
  - [ ] Configure domain and SSL

---

## Phase 11: Future Enhancements (Optional)

### 11.1 Group Chats
- [ ] Implement group functionality
  - [ ] Create group chat
  - [ ] Add/remove members
  - [ ] Group admin controls
  - [ ] Group info page

### 11.2 Voice Messages
- [ ] Implement voice messages
  - [ ] Record audio
  - [ ] Upload audio
  - [ ] Play audio in chat

### 11.3 Status/Stories
- [ ] Implement status feature
  - [ ] Post status updates
  - [ ] View contact statuses
  - [ ] 24-hour expiry

### 11.4 Advanced Features
- [ ] Additional features
  - [ ] Message scheduling
  - [ ] Chat backup/restore
  - [ ] Multi-device support
  - [ ] Desktop application (Electron)

---

## Notes
- Prioritize core messaging functionality first
- Keep UI/UX similar to existing theme implementation
- Maintain i18n support for all new features
- Ensure mobile responsiveness throughout
- Test real-time features thoroughly
- Consider scalability from the start
