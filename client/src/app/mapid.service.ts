import { Injectable } from '@angular/core';

@Injectable()
export class MapidService {

  /**
   * The current id
   */

  private id: string;

  constructor() { }

  /**
   * Get Id of the map, default 'map'
   */

  getId(): string {
    return this.id;
  }

  /**
   * Set Id
   */

  setId(id: string= null) {
    this.id = id;
  }

}
