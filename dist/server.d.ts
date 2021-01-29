/// <reference types="node" />
import { EventEmitter } from 'events';
import { Registry } from './lib/registry';
import { WorldManager, EntityManager } from './lib/world/manager';
import { PermissionManager } from './lib/permissions';
import { PlayerManager } from './lib/player/player';
import { IServerConfig } from './values';
import { BaseSocket } from './socket';
import { Logging } from './lib/console';
import type { ICoreServer } from 'voxelservercore/interfaces/server';
import type { ICorePlugin, ICorePluginManager } from 'voxelservercore/interfaces/plugin';
export declare class Server extends EventEmitter implements ICoreServer {
    name: string;
    version: string;
    playerCount: number;
    registry: Registry;
    worlds: WorldManager;
    players: PlayerManager;
    entities: EntityManager;
    permissions: PermissionManager;
    log: Logging;
    plugins: PluginManager;
    console: Console;
    config: IServerConfig;
    heartbeatID: number;
    status: string;
    constructor();
    private initDefaults;
    private initDefWorld;
    private startServer;
    heartbeatPing(): void;
    connectPlayer(socket: BaseSocket): Promise<void>;
    stopServer(): void;
    loadConfig(namespace: string, config: string): any;
    saveConfig(namespace: string, config: string, data: any): void;
}
declare class Console {
    s: Server;
    constructor(s: Server);
    executor: any;
    executorchat: any;
}
declare class PluginManager implements ICorePluginManager {
    _plugins: {
        [i: string]: ICorePlugin;
    };
    _server: Server;
    constructor(server: Server);
    get(name: string): ICorePlugin;
    getAll(): {
        [i: string]: ICorePlugin;
    };
    load(path: string): boolean;
    loadAllNotLoaded(): boolean;
    _loadPlugins(list: string[]): void;
}
export {};
//# sourceMappingURL=server.d.ts.map