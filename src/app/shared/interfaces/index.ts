export interface User {
  _id: number;
  bio: string;
  created_at: string;
  display_name: string;
  email: string;
  email_verified: boolean;
  logo: string;
  name: string;
  notifications: {
    email: boolean;
    push: boolean;
  };
  partnered: boolean;
  twitter_connected: boolean;
  type: string;
  updated_at: string;
}

export interface Message {
  content: string;
  author: string;
  color: string;
  createdAt: number;
  repeatCount: number;
}
