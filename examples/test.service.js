"use strict";

const _ = require("lodash");
const { MoleculerError } = require("moleculer").Errors;

module.exports = {
	name: "test",
	actions: {
		hello: {
			responseType: "text/plain",
			handler(ctx) {
				return "Hello Moleculer";
			}
		},

		greeter: {
			params: {
				name: "string"
			},
			handler(ctx) {
				return `Hello ${ctx.params.name}`;
			}
		},

		echo: {
			handler(ctx) {
				return {
					action: _.omit(ctx.action, ["handler", "service"]),
					params: ctx.params,
					meta: ctx.meta
				};
			}
		},

		sayHi(ctx) {
			return "Hi!";
		},

		dangerZone: {
			publish: false,
			handler(ctx) {
				return "You cannot call this action via API Gateway!";
			}
		},

		slow(ctx) {
			let time = ctx.params.delay || 5000;
			return this.Promise.resolve().delay(time).then(() => `Done after ${time / 1000} sec!`);
		},

		wrong(ctx) {
			throw new MoleculerError("It is a wrong action! I always throw error!");
		}
	}
};
