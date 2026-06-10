type ObserverCallback<T> = (payload: T) => void;

export interface ISubject<T> {
  subscribe(callback: ObserverCallback<T>): () => void;
  unsubscribe(callback: ObserverCallback<T>): void;
  notify(payload: T): void;
}

class Subject<T> implements ISubject<T> {
  private observers = new Set<ObserverCallback<T>>();

  subscribe(callback: ObserverCallback<T>) {
    this.observers.add(callback);

    return () => this.unsubscribe(callback);
  }

  unsubscribe(callback: ObserverCallback<T>) {
    this.observers.delete(callback);
  }

  notify(payload: T) {
    const snapshot = Array.from(this.observers);

    for (const callback of snapshot) {
      callback(payload);
    }
  }
}

export default Subject;
