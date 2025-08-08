import EventEmitter from "node:events";

class EventManager {
  private _emitter: EventEmitter = new EventEmitter();

  public emitChange(index: number, newValue: string): void {
    this._emitter.emit('change', { index, newValue });
  }

  public onChange(listener: (data: { index: number; newValue: string }) => void): void {
    this._emitter.on('change', listener);
  }

}

export const eventManager = new EventManager();