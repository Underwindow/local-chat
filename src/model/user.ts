export default class UserDTO {
  public readonly id: string;
  public readonly name: string;

  constructor(name: string, id: string) {
    this.id = id;
    this.name = name;
  }
}