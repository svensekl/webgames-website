class EventEmitter {
	events;
    constructor() {
        this.events = {};
    }
    on(type, listener) {
        if (typeof listener !== "function")
            throw new Error("Listener must be a function");

        this.events[type] = this.events[type] || [];
        this.events[type].push(listener);
    }
    emit(type, arg) {
        if (this.events[type]) {
            this.events[type].forEach((listener) => {
                listener(arg);
            });
        }
    }
}



export default EventEmitter;
