
import { BaseEntity } from './baseEntity.model';

export interface ItemWarehouseAttributes extends BaseEntity {
  pkid: number;
  item_pkid: number;
  warehouse_pkid: number;
  quantity: number;
  reorder_level?: number;
  reorder_quantity?: number;
  last_restocked?: Date;
  expiry_date?: Date;
}