export default class Queue {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  enqueue(data) {
    const node = { data: data, next: null };
    if (!this.head) {
      this.head = node;
      this.tail = this.head;
    } else {
      this.tail.next = node;
      this.tail = node;
    }
    this.length++;
    return this;
  }

  dequeue() {
    if (this.length !== 0) {
      this.head = this.head.next;
      this.length--;
    } else {
      console.log("List empty");
    }
    return this;
  }

  peek() {
    return this.head;
  }

  get(index) {
    if (this.length === 0) {
      console.log("List empty!");
      return;
    }

    if (index < 0 || index >= this.length) {
      console.log("Invalid index");
      return;
    }

    let i = 0;
    let node = this.head;
    while (i !== index) {
      node = node.next;
      i++;
    }
    return node;
  }

  size() {
    return this.length;
  }
}
