import Controller from '../controller'

class LR extends Controller {
	contructor() {
		super("LR");
	}
	onMessage(json) {
		if (json.type !== 'control') {
			super.onMessage(json);
			return;
		}
		if (!json.action) {
			throw new Error('garbled message: ' + JSON.stringify(json));
		}
		super.emit('lr', json.action);
	}
}

export default LR;
