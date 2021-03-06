"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WSSocket = exports.BaseSocket = void 0;
const protocol = __importStar(require("voxelsrv-protocol"));
class BaseSocket {
    constructor(ip) {
        this.listeners = {};
        this.debugListener = (sender, type, data) => { };
        this.ip = '0.0.0.0';
        this.ip = ip;
    }
    send(type, data) {
        const packet = protocol.parseToMessage('server', type, data);
        if (packet != null) {
            this.socket.send(packet);
            this.debugListener('server', type, data);
        }
    }
    close() {
        this.emit('close', true);
        this.listeners = {};
    }
    emit(type, data) {
        this.debugListener('client', type, data);
        if (this.listeners[type] != undefined) {
            this.listeners[type] = this.listeners[type].filter((event) => {
                event.callback(data);
                return !event.remove;
            });
        }
    }
    on(type, func) {
        if (this.listeners[type] != undefined) {
            this.listeners[type].push({ callback: func, remove: false });
        }
        else {
            this.listeners[type] = new Array();
            this.listeners[type].push({ callback: func, remove: false });
        }
    }
    once(type, func) {
        if (this.listeners[type] != undefined) {
            this.listeners[type].push({ callback: func, remove: true });
        }
        else {
            this.listeners[type] = new Array();
            this.listeners[type].push({ callback: func, remove: true });
        }
    }
}
exports.BaseSocket = BaseSocket;
class WSSocket extends BaseSocket {
    constructor(socket, ip) {
        super(ip);
        this.socket = socket;
        this.socket.binaryType = 'arraybuffer';
        this.socket.onopen = () => {
            this.emit('connection', {});
        };
        this.socket.on('error', () => {
            this.emit('error', { reason: `Connection error!` });
        });
        this.socket.on('close', () => {
            this.emit('close', { reason: `Connection closed!` });
        });
        this.socket.on('message', (m) => {
            try {
                const packet = protocol.parseToObject('client', new Uint8Array(m));
                if (packet != null)
                    this.emit(packet.type, packet.data);
            }
            catch (e) {
                console.error('Invalid message', e);
                socket.close();
            }
        });
    }
    close() {
        this.emit('close', true);
        this.listeners = {};
        this.socket.close();
    }
}
exports.WSSocket = WSSocket;
//# sourceMappingURL=socket.js.map