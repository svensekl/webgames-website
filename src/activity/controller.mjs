import Activity from './activity';

// emits lrud
class Controller extends Activity {
	constructor(name) {
		super(name || "Controller"); // in case this is used without extending it
	}

	// handle packet
	onMessage(json) {
		if (json.type !== 'control') {
			super.onMessage(json);
			return;
		}
		if (!json.action) {
			throw new Error('Garbled control packet: ' + JSON.stringify(json));
		}
		super.emit('action', json.action);
	}
}

export default Controller;
