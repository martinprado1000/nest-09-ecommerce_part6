// Versiones Websockets compatible con "@nestjs/core": "^10.0.0"
// npm install @nestjs/websockets@10.4.15
// npm install @nestjs/platform-socket.io@10.4.15
// npm install socket.io  
// http://localhost:3000/socket.io/socket.io.js
// En Websockets en namespace es la sala a la que un cliente esta conectado, se pueden crear mas de una sala: ej: /chat
// Y cuando un cliente se conecta a esa sala se le asigna un namespace segun la sala, ej; /chat/f3s2df65sdf321

import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Socket } from 'socket.io';

@WebSocketGateway({ cors: true }) // Permitor cors para Websockets.
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect{
  constructor(private readonly messagesWsService: MessagesWsService) {}
  
  
  handleConnection(client: Socket) {
    console.log(`Cliente conectado ${client.id}`)
  }
  
  
  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado ${client.id}`)
  }
}
