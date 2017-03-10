var MobileMessagingCordova = function () {};

/**
 * Starts a new Mobile Messaging session.
 *
 * @name init
 * @param {Json} configuration for Mobile Messaging
 * Configuration format:
 *	{
 *       applicationCode: '<The application code of your Application from Push Portal website>',
 *       geofencingEnabled: true,
 *		 messageStorage: '<Message storage save callback>',
 *		 defaultMessageStorage: true,
 *       android: {
 *           senderId: 'sender_id'
 *       },
 *       ios: {
 *			notificationTypes: ['alert', 'sound', 'badge']
 *       }
 * 	}
 * @param {Function} error callback
 */
MobileMessagingCordova.prototype.init = function(config, error) {
	this.configuration = config;

	var messageStorage = config.messageStorage;
	if (messageStorage) {
		if (typeof messageStorage.start !== 'function') {
			console.error('Missing messageStorage.start function definition');
			error('Missing messageStorage.start function definition');
			return;
		}
		if (typeof messageStorage.stop !== 'function') {
			console.error('Missing messageStorage.stop function definition');
			error('Missing messageStorage.stop function definition');
			return;
		}
		if (typeof messageStorage.save !== 'function') {
			console.error('Missing messageStorage.save function definition');
			error('Missing messageStorage.save function definition');
			return;
		}
		if (typeof messageStorage.find !== 'function') {
			console.error('Missing messageStorage.find function definition');
			error('Missing messageStorage.find function definition');
			return;
		}
		if (typeof messageStorage.findAll !== 'function') {
			console.error('Missing messageStorage.findAll function definition');
			error('Missing messageStorage.findAll function definition');
			return;
		}

		cordova.exec(messageStorage.start, function(){}, 'MobileMessagingCordova', 'messageStorage_register', ['messageStorage.start']);
		cordova.exec(messageStorage.stop, function(){}, 'MobileMessagingCordova', 'messageStorage_register', ['messageStorage.stop']);
		cordova.exec(messageStorage.save, function(){}, 'MobileMessagingCordova', 'messageStorage_register', ['messageStorage.save']);
		cordova.exec(messageStorage_find, function(){}, 'MobileMessagingCordova', 'messageStorage_register', ['messageStorage.find']);
		cordova.exec(messageStorage_findAll, function(){}, 'MobileMessagingCordova', 'messageStorage_register', ['messageStorage.findAll']);
	}

	if (!config.applicationCode) {
		console.error('No application code provided');
		error('No application code provided');
		return;
	}

	cordova.exec(function(){}, error, 'MobileMessagingCordova', 'init', [config]);
};

/**
 * Register to event coming from MobileMessaging library.
 * The following events are supported:
 *
 *   - messageReceived
 *   - registrationUpdated
 *   - tokenReceived (iOS only)
 *
 * @name register
 * @param {String} eventName
 * @param {Function} callback will be called when registration is complete
 */
MobileMessagingCordova.prototype.register = function(eventName, callback) {
	cordova.exec(callback, function(){}, 'MobileMessagingCordova', 'register', [eventName])
};

/**
 * Un register from MobileMessaging library event.
 *
 * @name unregister
 * @param {String} eventName
 * @param {Function} callback will be called when unregistration is complete
 */
MobileMessagingCordova.prototype.unregister = function(eventName, callback) {
	cordova.exec(callback, function(){}, 'MobileMessagingCordova', 'unregister', [eventName])
};

/**
 * Sync user data to the server.
 *
 * @name syncUserData
 * @param {Object} userData object containing user data
 * @param {Function} callback will be called with synchronized user data on success
 * @param {Function} errorCallback will be called on error
 */
MobileMessagingCordova.prototype.syncUserData = function(userData, callback, errorCallback) {
	cordova.exec(callback, errorCallback, 'MobileMessagingCordova', 'syncUserData', [userData])
};

/**
 * Fetch user data from the server.
 *
 * @name fetchUserData
 * @param {Function} callback will be called with fetched user data  on success
 * @param {Function} errorCallback will be called on error
 */
MobileMessagingCordova.prototype.fetchUserData = function(callback, errorCallback) {
	cordova.exec(callback, errorCallback, 'MobileMessagingCordova', 'fetchUserData', [])
};

/**
 * Mark messages as seen
 *
 * @name markMessagesSeen
 * @param {Array} array of identifiers of message to mark as seen
 * @param {Function} callback will be called upon completion
 * @param {Function} errorCallback will be called on error
 */
MobileMessagingCordova.prototype.markMessagesSeen = function(messageIds, callback, errorCallback) {
	cordova.exec(callback, errorCallback, 'MobileMessagingCordova', 'markMessagesSeen', messageIds)
};

MobileMessagingCordova.prototype.defaultMessageStorage = function() {
	var config = this.configuration;
	if (!config.defaultMessageStorage) {
		return undefined;
	}

	var defaultMessageStorage = {
		find: function(messageId, callback) {
			cordova.exec(callback, function(){}, 'MobileMessagingCordova', 'defaultMessageStorage_find', [messageId]);
	    },

	    findAll: function(callback) {
			cordova.exec(callback, function(){}, 'MobileMessagingCordova', 'defaultMessageStorage_findAll', []);
	    },

	    delete: function(messageId, callback) {
			cordova.exec(callback, function(){}, 'MobileMessagingCordova', 'defaultMessageStorage_delete', [messageId]);
	    },

	    deleteAll: function(callback) {
			cordova.exec(callback, function(){}, 'MobileMessagingCordova', 'defaultMessageStorage_deleteAll', []);
	    }
	};
	return defaultMessageStorage;
};

function messageStorage_find(messageId) {
	var messageStorage = this.configuration.messageStorage;
	messageStorage.find(messageId, function(message) {
		cordova.exec(function(){}, function(){}, 'MobileMessagingCordova', 'messageStorage_findResult', [message]);
	});
}

function messageStorage_findAll() {
	var messageStorage = this.configuration.messageStorage;
	messageStorage.findAll(function(messages) {
		cordova.exec(function(){}, function(){}, 'MobileMessagingCordova', 'messageStorage_findAllResult', messages);
	});
}

MobileMessaging = new MobileMessagingCordova();
module.exports = MobileMessaging;