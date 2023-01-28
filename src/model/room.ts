export default class RoomDTO {
  public readonly title: string;
  public readonly id: string;

  constructor(title: string, id: string) {
    this.title = title;
    this.id = id;
  }
}
