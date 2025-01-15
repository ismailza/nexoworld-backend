import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CoinsService } from './coins.service';
import { Location } from 'src/interfaces/location.interface';
import { TokenService } from 'src/auth/token.service';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  namespace: '/',
  transports: ['websocket', 'polling'],
})
export class CoinsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(CoinsGateway.name);
  private connectedClients: Map<string, Socket> = new Map();
  private userLocations: Map<string, Location> = new Map();

  constructor(
    private readonly tokenService: TokenService,
    private readonly coinsService: CoinsService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      // Get token from handshake auth
      this.logger.log(`Client connected: ${client.id}`);
      const token = client.handshake.auth.token?.split(' ')[1];
      if (!token) {
        client.disconnect();
        return;
      }

      try {
        // Verify token
        const payload = await this.tokenService.verifyToken(token);
        const userId = payload.sub;

        // Store client connection
        this.connectedClients.set(userId, client);
        client.data = { ...client.data, userId };

        this.logger.log(`Client connected: ${userId}`);
      } catch (error) {
        if (error instanceof TokenExpiredError) {
          client.emit('auth_error', { message: 'jwt expired', code: 401 });
        } else if (error instanceof JsonWebTokenError) {
          client.emit('auth_error', { message: 'Invalid token', code: 401 });
        } else {
          client.emit('auth_error', {
            message: 'Authentication failed',
            code: 401,
          });
        }
        client.disconnect();
      }
    } catch (error) {
      client.disconnect();
      this.logger.error(`Connection error: ${error.message}`);
    }
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    const userId = client.data.userId;
    if (userId) {
      this.connectedClients.delete(userId);
      this.logger.log(`Client disconnected: ${userId}`);
    }
  }

  @SubscribeMessage('nearbyCoins')
  async handleLocationUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() location: Location,
  ) {
    this.logger.log(
      `Location update: ${location.latitude}, ${location.longitude}`,
    );

    const userId = client.data.userId;
    if (!userId) return;

    // Store user's location
    this.userLocations.set(userId, location);

    // Get nearby coins for the user's location
    const nearbyCoins = await this.coinsService.findNearbyCoins(
      location.latitude,
      location.longitude,
    );

    // Send nearby coins to the user
    client.emit('nearbyCoins', nearbyCoins);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string): void {
    this.server.emit('message', message);
  }
}
