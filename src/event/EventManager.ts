import EventEmitter from "node:events";

class EventManager {
  private _emitter: EventEmitter = new EventEmitter();

  public emitChange(index: number): void {
    this._emitter.emit('change', { index });
  }

  public onChange(listener: (data: { index: number }) => void): void {
    this._emitter.on('change', listener);
  }

}

export const eventManager = new EventManager();