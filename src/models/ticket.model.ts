import {Entity, model, property} from '@loopback/repository';

@model()
export class Ticket extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
  })
  atencion?: number;

  @property({
    type: 'number',
  })
  tramite?: number;

  @property({
    type: 'number',
  })
  estado?: number;

  @property({
    type: 'string',
  })
  identidad?: string;

  @property({
    type: 'date',
  })
  fechai?: string;

  @property({
    type: 'date',
  })
  fechaf?: string;


  constructor(data?: Partial<Ticket>) {
    super(data);
  }
}

export interface TicketRelations {
  // describe navigational properties here
}

export type TicketWithRelations = Ticket & TicketRelations;
