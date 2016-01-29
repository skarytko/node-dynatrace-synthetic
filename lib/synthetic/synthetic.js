var async = require('async');
var Client = require('./client');
var _ = require('underscore');

/**
 * Creates an instance of Synthetic
 *
 * @constructor
 * @this {Synthetic}
 * @param		{object} options - 
 * @param		{string} options.username - 
 * @param		{string} options.password - 
 */
var Synthetic = function(options) {
	
	options = options || {};
	
	this.username = options.username;
	this.password = options.password;
	
	this._client = new Client();
	
};

/**
 * Synthetic.autheticate
 *
 * @desc Verifies if user has access to the account.
 *
 *
 * @param  {callback} callback - The callback that handles the response.
 * @return {object} Request object
 */
Synthetic.prototype.authenticate = function(callback) {
	
	var options = {
		url: 'http://gpn.webservice.gomez.com/accountmanagementws_20/AccountManagementWS.asmx',
		soapBody: {
			GSRAuthenticate: {
				'$': { xmlns: 'http://gomeznetworks.com/webservices/' },
				sUsername: this.username,
				sPassword: this.password
			}
		}
	};
	
	return this._client.request(options, callback);
	
};

/**
 * Synthetic.accountsShow
 *
 * @desc Shows account summary information.
 *
 *
 * @param  {callback} callback - The callback that handles the response.
 * @return {object} Request object
 */
Synthetic.prototype.accountsShow = function(callback) {
	
	var options = {
		url: 'http://gpn.webservice.gomez.com/accountmanagementws_20/AccountManagementWS.asmx',
		soapBody: {
			GetAccountSummary: {
				'$': { xmlns: 'http://gomeznetworks.com/webservices/' },
				sUsername: this.username,
				sPassword: this.password
			}
		}
	};
	
	return this._client.request(options, callback);
	
};

/**
 * Synthetic.accountsShowDetails
 *
 * @desc Shows account detail information.
 *
 *
 * @param  {callback} callback - The callback that handles the response.
 * @return {object} Request object
 */
Synthetic.prototype.accountsShowDetails = function(callback) {
	
	var options = {
		url: 'http://gpn.webservice.gomez.com/AccountManagementService40/AccountManagementWS.svc',
		headers: {
			'SOAPAction': 'http://gomeznetworks.com/webservices/Retrieve',
			'Content-type': 'text/xml;charset=UTF-8'
		},
		bodyType: 'soap',
		body: {
			'soapenv:Envelope': {
				'$': {
					'xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
					'xmlns:web': 'http://gomeznetworks.com/webservices'
				},
				'soapenv:Header': {},
				'soapenv:Body': {
					'web:Retrieve': {
						'web:request': {
							'web:user': {
								'web:username': this.username,
								'web:password': this.password
							}
						}
					}
				}
			}
		},
		response: {
			parse: true,
			statusPath: 's:Envelope/s:Body/RetrieveResponse/RetrieveResult/StatusType',
			contentPath: 's:Envelope/s:Body/RetrieveResponse/RetrieveResult/GPNData/Accounts' 
		}
	};
	
	return this._client.request(options, callback);
	
};

/**
 * Synthetic.nodesList
 *
 * @desc List backbone nodes available for an account.
 *
 *
 * @param  {callback} callback - The callback that handles the response.
 * @return {object} Request object
 */
Synthetic.prototype.nodesList = function(callback) {
	
	var options = {
		url: 'http://gpn.webservice.gomez.com/AccountManagementWS_20/AccountManagementWS.asmx',
		soapBody: {
			GetAccountSites: {
				'$': {
					xmlns: 'http://gomeznetworks.com/webservices/'
				},
				sUsername: this.username,
				sPassword: this.password
			}
		}
	};
	
	return this._client.request(options, callback);
};

/**
 * Synthetic.testsList
 *
 * @desc List tests for to which the user has access.
 *
 *
 * @param  {object} params - Parameters for API request
 * @param  {string} params.AgentType - 
 * @param  {string} params.QueryByCreateDate -
 * @param  {string} params.QueryByModifyDate -
 * @param  {integer} params.MonitorId -
 * @param  {integer} params.QueryByExpirationDate -
 * @param	 {string} params.MonitorStatus - 
 * @param	 {array} params.Group - 
 * @param  {callback} callback - The callback that handles the response.
 * @return {object} Request object
 */
Synthetic.prototype.testsList = function(params, callback) {
	
	params = params || {};
	var monitorClass = params.MonitorClass || 'uta';
	
	// Remove monitorClass from params object
	if (params.MonitorClass) delete params.MonitorClass;

	var options = {
		url: 'http://gpn.webservice.gomez.com/TestManagementWS_30/TestManagementService.asmx',
		soapBody: {
			GetTestsExRequest: {
				'$': {
					xmlns: 'http://www.gomeznetworks.com/schemas/provisioning'
				},
				GetTestsRequest: {
					Credentials: {
						UserName: this.username,
						Password: this.password
					},
					MonitorFilter: params
				},
				MonitorClass: monitorClass
			}
		}
	};
	
	return this._client.request(options, callback);
};

/**
 * Synthetic.testsShow
 *
 * 
 *
 *
 * @param  {integer} id - 
 * @param  {callback} callback - The callback that handles the response.
 * @return {object} Request object
 */
Synthetic.prototype.testsShow = function(id, callback) {
	
	return this.testsList({ MonitorId: id }, callback);
	
};

/**
 * Synthetic.scriptsList
 *
 * @desc List scripts for to which the user has access.
 *
 *
 * @param		{object} params - Parameters for API request
 * @param		{string} params.AgentType -
 * @param		{integer} params.QueryByCreateDate - 
 * @param		{integer} params.QueryByModifyDate - 
 * @param		{integer} params.ScriptId -
 * @param		{callback} callback - The callback that handles the response.
 * @return	{object} Request object
 */
Synthetic.prototype.scriptsList = function(params, callback) {
	
	var options = {
		url: 'http://gpn.webservice.gomez.com/TestManagementWS_30/TestManagementService.asmx',
		soapBody: {
			GetScriptsRequest: {
				'$': {
					xmlns: 'http://www.gomeznetworks.com/schemas/provisioning'
				},
				Credentials: {
					UserName: this.username,
					Password: this.password
				},
				ScriptFilter: params
			}
		}
	};
	
	return this._client.request(options, callback);
	
};

/**
 * Synthetic.scriptsShow
 *
 * @desc		sd
 *
 *
 * @param		{integer} params.ScriptId -
 * @param		{callback} callback - The callback that handles the response.
 * @return	{object} Request object
 */
Synthetic.prototype.scriptsShow = function(id, callback) {
	
	return this.scriptsList({ ScriptId: id }, callback);
	
};

/**
 * Synthetic.scriptsDownload
 *
 * @desc List scripts for to which the user has access.
 *
 *
 * @param		{object} params - Parameters for API request
 * @param		{string} params.iMonitorId -  The script/monitor ID of the script to download
 * @param		{callback} callback - The callback that handles the response.
 * @return	{object} Request object
 */
Synthetic.prototype.scriptsDownload = function(params, callback) {
	
	var options = {
		url: 'https://gpn.webservice.gomez.com/UtaScriptService/UtaScriptService.asmx',
		soapBody: {
			GetScript: {
				'$': {
					xmlns: 'http://gomeznetworks.com/webservices/'
				},
				sUsername: this.username,
				sPassword: this.password
			}
		}
	};
	
	options.soapBody.GetScript = _.extend(options.soapBody.GetScript, params);
	
	return this._client.request(options, callback);
	
};

/**
 * Synthetic.scriptsDestroy
 *
 * @desc		sd
 *
 *
 * @param		{integer} params.ScriptId -
 * @param		{callback} callback - The callback that handles the response.
 * @return	{object} Request object
 */
Synthetic.prototype.scriptsDestroy = function(id, callback) {
	
	var options = {
		url: 'https://gpn.webservice.gomez.com/UtaScriptService/UtaScriptService.asmx',
		soapBody: {
			DeleteScript: {
				'$': {
					xmlns: 'http://gomeznetworks.com/webservices/'
				},
				sUsername: this.username,
				sPassword: this.password,
				iMonitorId: id
			}
		}
	};
	
	return this._client.request(options, callback);
	
};

/**
 * Synthetic.data
 *
 * @desc List scripts for to which the user has access.
 *
 *
 * @param		{object} params - Parameters for API request
 * @param		{array} params.iMonitorIdSet - Requested set of the Dynatrace Synthetic platform Monitor/Test reference Identifiers.
 * @param		{array} params.iSiteIdSet - Requested set of the Dynatrace Synthetic platform Site reference Identifiers.
 * @param		{string} params.sMonitorClassDesignator - Specifies the type of data to be exported in the dataset based on the common class of tests.
 * @param		{string} params.sDataDesignator - Specifies the levels of data in the dataset returned to the client for the type of data specified.
 * @param		{string} params.sLastN - Indicates a window based on the last N test samples relative to the current time.
 * @param		{string} params.sStartTime - Specifies the starting time boundary for the dataset. The format is: YYYY-MM-DD HH:MM:SS
 * @param		{string} params.sEndTime - Specifies the ending time boundary for the dataset. The format is: YYYY-MM-DD HH:MM:SS
 * @param		{string} params.sOrderDesignator - Specifies how the dataset will be ordered.
 * @param		{string} params.sTimeDesignator - Designation indicating how the time filters and modes are to be applied.
 * @param		{callback} callback - The callback that handles the response.
 * @return	{object} Request object
 */
Synthetic.prototype.data = function(params, callback) {
	
	var self = this;
	var request;
	
	async.waterfall([
		// openDataFeed
		function(cb) {
			request = self._openDataFeed(params, function(err, body) {
				if (err || !body) return cb(err);
				console.log(body);
				
				self._client._xmlParser(body, { explicitArray: false, mergeAttrs: true }, function(err, result) {	
					if (err) return cb(err);
			
					// remove SOAP headers from body
					try {
						sessionToken = result['soap:Envelope']['soap:Body'].OpenDataFeed3Response.GpnOpenUtaDataFeedResponse.SessionToken;
		
						return cb(null, sessionToken);
					} catch(e) {
						console.log('abab: ' + err);
						return cb(err);
					}
				});
			});
		},
		// getResponseData
		function(sessionToken, cb) {
			if (!sessionToken || typeof(sessionToken) == "undefined") cb(new Error('Session Token not found.'), null);

			self._getResponseData(sessionToken, function(err, body) {
				if (err) return cb(err, sessionToken);
				
				self._client._xmlParser(body, { explicitArray: false, mergeAttrs: true }, function(err, result) {	
					if (err) return cb(err, sessionToken);
					
					try {
						var data = result['soap:Envelope']['soap:Body'].GetResponseDataResponse.GpnResponseData.XmlDocument.GpnResponseData;
					
						return cb(null, sessionToken, data);
					} catch(error) {
						return cb(error, sessionToken);
					}
				});
			});
		}
	],
	function(err, sessionToken, result) {
		// closeDataFeed
		if (sessionToken) self._closeDataFeed(sessionToken);
		
		if (err) return callback(err);
		
		return callback(null, result);
	});
	
	return request;
	
};

/**
 * Synthetic._openDataFeed
 *
 * @desc		aldjfladf
 * @private
 *
 * @param		{object} params - 
 * @param		{callback} callback - The callback that handles the response.
 * @return	{object} Request object
 */
Synthetic.prototype._openDataFeed = function(params, callback) {
	
	params = params || {};
	
	if (params.iMonitorIdSet) {
		params.iMonitorIdSet = {
			int: params.iMonitorIdSet
		};
	}
	
	if (params.iSiteIdSet) {
		params.iSiteIdSet = {
			int: params.iSiteIdSet
		};
	}
	
	var soapBody = {
		OpenDataFeed3: {
			'$': {
				xmlns: 'http://gomeznetworks.com/webservices/'
			},
			sUsername: this.username,
			sPassword: this.password
		}
	};
	
	// merge params with soap body
	soapBody.OpenDataFeed3 = _.extend(soapBody.OpenDataFeed3, params);
	
	var options = {
		url: 'http://gpn.webservice.gomez.com/DataExportService60/GPNDataExportService.asmx',
		soapBody: soapBody,
		parseSOAP: false
	};
	
	return this._client.request(options, callback);
};

/**
 * Synthetic._getResponseData
 *
 * @desc adfadf
 * @private
 *
 * @param		{string} sessionToken - 
 * @param		{callback} callback - The callback that handles the response.
 * @return	{object} Request object
 */
Synthetic.prototype._getResponseData = function(sessionToken, callback) {

	if (!sessionToken) return callback(new Error('No session token was provided.'));

	var options = {
		url: 'http://gpn.webservice.gomez.com/DataExportService60/GPNDataExportService.asmx',
		soapBody: {
			GetResponseData: {
				'$': {
					xmlns: 'http://gomeznetworks.com/webservices/'
				},
				sSessionToken: sessionToken
			}
		},
		parseSOAP: false
	};
	
	return this._client.request(options, callback);
	
};

/**
 * Synthetic._closeDataFeed
 *
 * @desc adfadsf
 * @private
 *
 * @param		{object} sessionToken - 
 * @param		{callback} callback - The callback that handles the response.
 * @return	{object} Request object
 */
Synthetic.prototype._closeDataFeed = function(sessionToken, callback) {
	
	if (!sessionToken) {
		return callback(new Error('No session token was provided.'));
	}
	
	var options = {
		url: 'http://gpn.webservice.gomez.com/DataExportService60/GPNDataExportService.asmx',
		soapBody: {
			CloseDataFeed: {
				'$': {
					xmlns: 'http://gomeznetworks.com/webservices/'
				},
				sSessionToken: sessionToken
			}
		},
		parseSOAP: false
	};
	
	return this._client.request(options, callback);
	
};

/**
 * Synthetic.alertsList
 *
 * @desc Retrieves the alert history for all Backbone monitors of a specific type within a specified time range.
 *
 * @param		{object} params - Parameters for API request
 * @param		{string} param.monitorType - Specifies the class of Backbone monitor data to retrieve
 * @param		{string} param.startTime - Start time for the request window in format: YYYY-MM-DD hh:mm:ss
 * @param		{string} param.endTime - End time for the request window in format: YYYY-MM-DD hh:mm:ss
 * @param		{callback} callback - The callback that handles the response.
 * @return	{object} Request object
 */
Synthetic.prototype.alertsList = function(params, callback) {
	
	params = params || {};
	params.endTime = (params.endTime) ? new Date(params.endTime) : new Date();
	
	if (params.startTime) {
		params.startTime = new Date(params.startTime);
	} else {
		params.startTime = new Date();
		params.startTime.setDate(params.endTime.getDate() - 1);
	}

	var options = {
		url: 'https://gpn.webservice.gomez.com/AlertManagementService20/AlertManagementWS.asmx',
		soapBody: {
			GetAlertHistory: {
				'$': {
					xmlns: 'http://www.gomeznetworks.com/webservices/'
				},
				username: this.username,
				password: this.password,
				monitorType: params.monitorType || 'ALL',
				startTime: params.startTime.toISOString(),
				endTime: params.endTime.toISOString()
			}
		}
	};
	
	return this._client.request(options, callback);
	
};

module.exports = Synthetic;