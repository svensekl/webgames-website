import Controller from '../controller'

class LRUD extends Controller {
	contructor() {
		super("LRUD");
	}
	onMessage(json) {
		if (json.type !== 'control') {
			super.onMessage(json);
			return;
		}
		if (!json.action) {
			throw new Error('garbled message: ' + JSON.stringify(json));
		}
		super.emit('lrud', json.action);
	}
}

export default LRUD;
