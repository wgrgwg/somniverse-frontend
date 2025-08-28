type EventHandler = () => void;

class EventBus {
  private events: Record<string, EventHandler[]> = {};

  on(event: string, handler: EventHandler) {
    this.events[event] = this.events[event] || [];
    this.events[event].push(handler);
  }

  off(event: string, handler: EventHandler) {
    this.events[event] = (this.events[event] || []).filter(
      (h) => h !== handler,
    );
  }

  emit(event: string) {
    (this.events[event] || []).forEach((h) => h());
  }
}

export const eventBus = new EventBus();
