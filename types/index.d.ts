declare type User = {
  id: string;
  username: string;
  email: string;
  avatar: string;
  blocked: string[];
};

declare type userChats = {
  chats: Chat[];
};

declare type Chat = {
  chatId: string;
  receiverId: string;
  lastMessage: string;
  updatedAt: Date;
  isSeen: boolean;
};

declare type Chats = {
  id: string;
  createdAt: Date;
  messages: Message[];
};

declare type Message = {
  chatId: string;
  senderId: string;
  text: string;
  image: string;
  createdAt: Date;
};

type ChatWithUser = Chat & { user: User };
