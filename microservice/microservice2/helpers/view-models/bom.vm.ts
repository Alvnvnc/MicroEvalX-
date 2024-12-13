import {
  BomHeaderCreateDTO,
  BomHeaderUpdateDTO,
  BomHeaderResultDTO,
  BomDetailResultDTO,
  getAllAttributes,
  getAllAttributesForDetail,
  BomAvailabilityDetailDTO,
  BomAvailabilityResultDTO,
} from '../dto/bom.dto';
import { BomHeaderAttributes } from '../../infrastructure/models/bomHeader.model';
import { BomDetailAttributes } from '../../infrastructure/models/bomDetail.model';
import { ItemDTO } from '../dto/item.dto';

export class BomHeaderCreateVM {
  bomHeaderData: BomHeaderCreateDTO;

  constructor(bomHeaderData: BomHeaderCreateDTO) {
    this.bomHeaderData = bomHeaderData;
  }
}

export class BomHeaderUpdateVM {
  bomHeaderData: BomHeaderUpdateDTO;

  constructor(bomHeaderData: BomHeaderUpdateDTO) {
    this.bomHeaderData = bomHeaderData;
  }
}

export class BomHeaderResultVM {
  result: BomHeaderResultDTO;

  constructor(result: BomHeaderResultDTO) {
    this.result = result;
  }
}

export class BomDetailResultVM {
  result: BomDetailResultDTO;

  constructor(result: BomDetailResultDTO) {
    this.result = result;
  }
}

export const getAllAttributesVM = (
  bomHeader: BomHeaderAttributes,
  bomDetails?: BomDetailResultDTO[],
  itemHeader?: ItemDTO,
): BomHeaderResultDTO => {
  return getAllAttributes(bomHeader, bomDetails, itemHeader);
};

export const getAllAttributesForDetailVM = (
  bomDetail: BomDetailAttributes,
  item?: ItemDTO,
  childBomDetails?: BomDetailResultDTO[],
): BomDetailResultDTO => {
  return getAllAttributesForDetail(bomDetail, item, childBomDetails);
};

export const mapToBomAvailabilityDetailVM = (
  dto: BomAvailabilityDetailDTO,
): BomAvailabilityDetailDTO => {
  return {
    itemId: dto.itemId,
    statusQuantity: dto.statusQuantity,
    requiredQuantity: dto.requiredQuantity,
    currentQuantity: dto.currentQuantity,
    childBom: dto.childBom.map(mapToBomAvailabilityDetailVM),
  };
};

export const mapToBomAvailabilityResultVM = (
  dto: BomAvailabilityResultDTO,
): BomAvailabilityResultDTO => {
  return {
    endProduct: {
      itemId: dto.endProduct.itemId,
      statusQuantity: dto.endProduct.statusQuantity,
      requiredQuantity: dto.endProduct.requiredQuantity,
      currentQuantity: dto.endProduct.currentQuantity,
    },
    childItems: dto.childItems.map(mapToBomAvailabilityDetailVM),
  };
};
