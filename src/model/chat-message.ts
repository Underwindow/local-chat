import { nanoid } from 'nanoid';

export default class ChatMessageDTO {
  public readonly id: string;
  public readonly user: string;
  public readonly message: string;

  constructor(user: string, message: string) {
    this.id = nanoid(8);
    this.user = user;
    this.message = message;
  }
}
