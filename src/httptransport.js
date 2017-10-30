const BaseTransporter = require("moleculer").Transporters.BaseTransporter;

class HttpTransporter extends BaseTransporter {
	constructor(opts) {
		super(opts);
	}

	connect() {
		// TODO: connect to http services to get available endpoints
		return this.onConnected();
	}

	disconnect() {
		this.connected = false;
		return Promise.resolve();
	}

	publish(packet) {
		const data = packet.serialize();
		this.bus.emit(this.getTopicName(packet.type, packet.target), data);
		return Promise.resolve();
	}
}

module.exports = HttpTransporter;
