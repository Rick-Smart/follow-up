export class User {
  constructor({
    uid,
    email,
    role,
    name = "",
    active = true,
    createdAt = new Date().toISOString(),
    lastUpdated = new Date().toISOString(),
  }) {
    this.uid = uid;
    this.email = email;
    this.role = role;
    this.name = name;
    this.active = active;
    this.createdAt = createdAt;
    this.lastUpdated = lastUpdated;
  }

  toFirestore() {
    return {
      email: this.email,
      role: this.role,
      name: this.name,
      active: this.active,
      createdAt: this.createdAt,
      lastUpdated: this.lastUpdated,
    };
  }

  static fromFirestore(data) {
    return new User(data);
  }
}
