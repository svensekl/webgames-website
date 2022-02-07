import EventEmitter from './eventEmitter';

class Lifecycle {
	static stopped = new Lifecycle('stopped');
	static working = new Lifecycle('working');
	static paused = new Lifecycle('paused');

	constructor(name) {
		this.name = name;
	}
}

// all communication with server
class Session extends EventEmitter {
	sid;
	sock;
	activity;
	lifecycle = Lifecycle.stopped;
	constructor() {
		super();

		this.lifetimeMessage = (msg) => {
			let json;
			try {
				json = JSON.parse(msg.data);
			} catch(err) {
				throw new Error("message is not json format: " + msg.data);
			}

			if (!json.type) {
				throw new Error("message is not a valid packet: " + msg.data);
			}

			if (json.type === "session-end") {
				console.log('ending session');
				// end of session TODO: reason
				this.sock.close();
				return;
			}

			// transform a passthrough packet
			if (json.type === 'passthrough') {
				if (!json.data) {
					throw new Error("Garbled passthrough message: " + msg.data);
				}
				
				json = json.data;
			}

			this.activity.onMessage(json);
		}
	}

	start(activity) {
		if (this.lifecycle !== Lifecycle.stopped) {
			return false;
		}
		this.sock = new WebSocket("ws://localhost");

		// send a session-create packet as soon as possible
		this.sock.onopen = () => {
			console.log('sending');
			const json = {
				"type": "session-create"
			};
			this.sock.send(JSON.stringify(json));
			this.lifecycle = Lifecycle.working;
		}
		// wait for a session-start message
		this.sock.onmessage = (msg) => {
			let json;
			try {
				json = JSON.parse(msg.data);
			} catch(err) {
				throw new Error("first message is not json format")
			}
			if (json.type !== "session-start" || !json.sid) {
				throw new Error("first packet is not a valid session-start packet")
			}
			this.sid = json.sid;
			this.#startActivity(activity);
			this.sock.onmessage = this.lifetimeMessage;
			this.emit('session-start');
		};
		return true;
	}

	stop() {
		// TODO: implement
		if (this.lifecycle === Lifecycle.stopped) {
			return true;
		}

		this.lifecycle = Lifecycle.stopped;
		return true;
	}

	#startActivity(activity) {
		this.activity = activity;
		activity.start(this);
	}

	// no idea why this is a function. just deal with it
	changeActivity(activity) {
		this.#startActivity(activity);
	}
}

export default Session;
