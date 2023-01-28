import User from '@/model/user';

export default interface ChatMessage {
  id: string;
  user: User;
  message: string;
}
