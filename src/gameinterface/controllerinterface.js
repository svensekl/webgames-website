
class ControllerInterface {
	onsession;
	constructor() {
		window.onmessage = msg => {
			if (!(msg.data.type === 'get-session')) {
				console.log('unrecognized message: ' + msg.data);
				return;
			}
			this.onsession(msg.data.session);
		}
	}

	getsession() {
		top.parent.postMessage({type: 'get-session'});
	}
}



export default ControllerInterface;
