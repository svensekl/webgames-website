import EventEmitter from '../eventEmitter'

class Activity extends EventEmitter {
	sock;
	name;
	packettypes;
	constructor(name) {
		super();
		this.name = name;
	}

	onMessage(json) {
		console.log('activity message: ' + json);
	}

	start(session) {
		let sock = session.sock;
		console.log(session);
		// send activity start message
		const startmsg = {
			'type': 'activity-start',
			'activity-id': this.name,
		}
		sock.send(JSON.stringify(startmsg));
	}
}

export default Activity;
