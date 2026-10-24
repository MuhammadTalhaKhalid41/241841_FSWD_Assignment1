export class Ticket {
  constructor({ id, customerName, issue, priority, status, createdAt = new Date().toISOString() }) {
    this.id = id;
    this.customerName = customerName.trim();
    this.issue = issue.trim();
    this.priority = priority;
    this.status = status;
    this.createdAt = createdAt;
  }

  update(details) {
    const { customerName, issue, priority, status } = details;
    Object.assign(this, {
      customerName: customerName.trim(),
      issue: issue.trim(),
      priority,
      status
    });
  }
}
