require('./sourcemap-register.js');/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 778:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const core = __importStar(__nccwpck_require__(859));
const requests_1 = __nccwpck_require__(725);
const tool_1 = __nccwpck_require__(425);
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const githubToken = (0, tool_1.loadInput)('githubToken');
            const githubOrg = (0, tool_1.loadInput)('githubOrg');
            const githubRepository = (0, tool_1.loadInput)('githubRepository');
            const githubRunId = (0, tool_1.loadInput)('githubRunId');
            const elasticApiKeyId = (0, tool_1.loadInput)('elasticApiKeyId');
            const elasticApiKey = (0, tool_1.loadInput)('elasticApiKey');
            const elasticHost = (0, tool_1.loadInput)('elasticHost');
            const elasticIndex = (0, tool_1.loadInput)('elasticIndex');
            const elasticUser = (0, tool_1.loadInput)('elasticUser');
            const elasticPassword = (0, tool_1.loadInput)('elasticPassword');
            const elasticCloudId = (0, tool_1.loadInput)('elasticCloudId');
            const elasticCloudUser = (0, tool_1.loadInput)('elasticCloudUser');
            const elasticCloudPassword = (0, tool_1.loadInput)('elasticCloudPassword');
            core.info(`Initializing Github Connection Instance`);
            const githubInstance = (0, requests_1.createAxiosGithubInstance)(githubToken);
            core.info(`Initializing Elastic Instance`);
            const elasticInstance = (0, requests_1.createElasticInstance)(elasticHost, elasticApiKeyId, elasticApiKey, elasticUser, elasticPassword, elasticCloudId, elasticCloudUser, elasticCloudPassword);
            const metadataUrl = `/repos/${githubOrg}/${githubRepository}/actions/runs/${githubRunId}`;
            core.info(`Retrieving metadata from Github Pipeline ${githubRunId}`);
            const metadata = yield (0, requests_1.sendRequestToGithub)(githubInstance, metadataUrl);
            const jobsUrl = metadata.jobs_url;
            core.info(`Retrieving jobs list from Github Pipeline ${githubRunId}`);
            const jobs = yield (0, requests_1.sendRequestToGithub)(githubInstance, jobsUrl);
            for (const job of jobs.jobs) {
                core.info(`Parsing Job... '${job.name}'`);
                if (/elastic/.test(job.name)) {
                    core.info('Skipping this job');
                    continue;
                }
                const achievedJob = {
                    id: job.id,
                    name: job.name,
                    metadata,
                    status: job.status,
                    conclusion: job.conclusion,
                    steps: job.steps,
                    details: job,
                    logs: yield (0, requests_1.sendRequestToGithub)(githubInstance, `/repos/${githubOrg}/${githubRepository}/actions/jobs/${job.id}/logs`)
                };
                core.info(`Getting job '${achievedJob.name}'`);
                yield (0, requests_1.sendMessagesToElastic)(elasticInstance, achievedJob, elasticIndex);
            }
        }
        catch (e) {
            if (e instanceof Error) {
                core.setFailed(e.message);
            }
        }
    });
}
// eslint-disable-next-line @typescript-eslint/no-floating-prom
run();


/***/ }),

/***/ 725:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createElasticInstance = exports.createAxiosGithubInstance = exports.sendMessagesToElastic = exports.sendRequestToGithub = void 0;
const core = __importStar(__nccwpck_require__(859));
const axios_1 = __importDefault(__nccwpck_require__(160));
const elasticsearch_1 = __nccwpck_require__(267);
function sendRequestToGithub(client, path, retries = 10, initialDelay = 2000, maxDelay = 30000) {
    return __awaiter(this, void 0, void 0, function* () {
        let delay = initialDelay;
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                const response = yield client.get(path);
                core.debug(response.data);
                return response.data;
            }
            catch (e) {
                const error = e;
                // if (attempt === retries || (error.response && error.response.status !== 404 && error.response.status !== 429 && error.response.status < 500)) {
                //   throw new Error(`Cannot send request to Github after ${retries} attempts: ${e}`)
                // }
                core.warning(`Attempt ${attempt} failed: ${e}. Retrying in ${delay}ms...`);
                yield new Promise(resolve => setTimeout(resolve, delay));
                delay = Math.min(delay * 2, maxDelay); // Exponential backoff with a cap
            }
        }
    });
}
exports.sendRequestToGithub = sendRequestToGithub;
function sendMessagesToElastic(client, messages, elasticIndex) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            core.debug(`Push to elasticIndex`);
            yield client.index({ body: messages, index: elasticIndex });
            core.debug(`Successfully pushed to elasticIndex`);
        }
        catch (e) {
            core.error(`Failed to send to Elastic: ${e}`);
            throw new Error(`Cannot send request to Elastic : ${e}`);
        }
    });
}
exports.sendMessagesToElastic = sendMessagesToElastic;
function createAxiosGithubInstance(token) {
    return __awaiter(this, void 0, void 0, function* () {
        return axios_1.default.create({
            baseURL: 'https://api.github.com',
            timeout: 10000,
            headers: { Authorization: `token ${token}` }
        });
    });
}
exports.createAxiosGithubInstance = createAxiosGithubInstance;
function createElasticInstance(elasticHost, elasticApiKeyId, elasticApiKey, elasticUser, elasticPassword, elasticCloudId, elasticCloudUser, elasticCloudPassword) {
    return !elasticCloudId
        ? new elasticsearch_1.Client({
            node: elasticHost,
            apiKey: {
                id: elasticApiKeyId,
                api_key: elasticApiKey
            }
        })
        : new elasticsearch_1.Client({
            node: elasticHost,
            cloud: { id: elasticCloudId },
            auth: {
                username: elasticCloudUser,
                password: elasticCloudPassword
            }
        });
}
exports.createElasticInstance = createElasticInstance;


/***/ }),

/***/ 425:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.loadInput = void 0;
const core = __importStar(__nccwpck_require__(859));
function loadInput(inputName) {
    try {
        return core.getInput(inputName);
    }
    catch (e) {
        throw new Error(`Cannot retrieve parameters ${inputName}`);
    }
}
exports.loadInput = loadInput;


/***/ }),

/***/ 859:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 267:
/***/ ((module) => {

module.exports = eval("require")("@elastic/elasticsearch");


/***/ }),

/***/ 160:
/***/ ((module) => {

module.exports = eval("require")("axios");


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __nccwpck_require__(778);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map