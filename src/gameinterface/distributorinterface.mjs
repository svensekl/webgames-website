
class DistributorInterface {
	constructor(session) {
		window.onmessage = msg => {
			switch (msg.data.type) {
				case 'get-session':
					document.getElementById("frame").contentWindow.postMessage(
						{type: 'get-session', session: session});
			}
		}
	}
}

export default DistributorInterface;
