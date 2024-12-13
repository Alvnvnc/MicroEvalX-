import { UnitCreateDTO } from '../../helpers/dto/unitCreate.dto';
import { UnitDropdownDTO } from '../../helpers/dto/unitDropdown.dto';
import { UnitResultDTO } from '../../helpers/dto/unitResult.dto';
import { UnitRepository } from '../../data-access/repositories/unit/unit.repository';
import { UnitCreateRepository } from '../../data-access/repositories/unit/unit.create.repository';
import { UnitDeleteRepository } from '../../data-access/repositories/unit/unit.delete.repository';
import { UnitFindRepository } from '../../data-access/repositories/unit/unit.find.repository';

export class UnitService {
    private unitRepository: UnitRepository;
    private unitCreateRepository: UnitCreateRepository;
    private unitDeleteRepository: UnitDeleteRepository;
    private unitFindRepository: UnitFindRepository;

    constructor() {
        this.unitRepository = new UnitRepository();
        this.unitCreateRepository = new UnitCreateRepository();
        this.unitDeleteRepository = new UnitDeleteRepository();
        this.unitFindRepository = new UnitFindRepository();
    }

    /**
     * Create a new unit with validation
     * @param data - UnitCreateDTO containing name and description
     * @returns UnitResultDTO - the created unit details
     */
    async createUnit(data: UnitCreateDTO): Promise<UnitResultDTO> {
        if (!data.name || data.name.trim() === '') {
            throw new Error('Name is required for creating a unit.');
        }

        const createdUnit = await this.unitCreateRepository.create(data);
        return new UnitResultDTO(createdUnit.id, createdUnit.name, createdUnit.description);
    }

    /**
     * Fetch a unit by ID with error handling
     * @param id - ID of the unit to fetch
     * @returns UnitResultDTO - details of the unit
     */
    async getUnitById(id: string): Promise<UnitResultDTO> {
        const unit = await this.unitFindRepository.findById(id);
        if (!unit) {
            throw new Error(`Unit with ID ${id} not found.`);
        }
        return new UnitResultDTO(unit.id, unit.name, unit.description);
    }

    /**
     * Update a unit's information with validation
     * @param id - ID of the unit to update
     * @param data - UnitCreateDTO with updated information
     * @returns UnitResultDTO - updated unit details
     */
    async updateUnit(id: string, data: UnitCreateDTO): Promise<UnitResultDTO> {
        if (!data.name || data.name.trim() === '') {
            throw new Error('Name is required for updating a unit.');
        }

        const updatedUnit = await this.unitRepository.update(id, data);
        if (!updatedUnit) {
            throw new Error(`Failed to update unit with ID ${id}`);
        }
        return new UnitResultDTO(updatedUnit.id, updatedUnit.name, updatedUnit.description);
    }

    /**
     * Delete a unit by ID with error handling
     * @param id - ID of the unit to delete
     * @returns void
     */
    async deleteUnit(id: string): Promise<void> {
        const success = await this.unitDeleteRepository.delete(id);
        if (!success) {
            throw new Error(`Failed to delete unit with ID ${id}`);
        }
    }

    /**
     * Get dropdown data for units
     * @returns UnitDropdownDTO[] - Array of dropdown items
     */
    async getDropdownData(): Promise<UnitDropdownDTO[]> {
        const units = await this.unitFindRepository.findAll();
        return units.map(unit => new UnitDropdownDTO(unit.id, unit.name));
    }

    /**
     * Search units with filters, pagination, and sorting
     * @param filters - Key-value pairs to filter units
     * @param page - Page number for pagination
     * @param limit - Number of items per page
     * @param sortField - Field to sort by
     * @param sortOrder - Sort order ('asc' or 'desc')
     * @returns UnitResultDTO[] - Array of matching units
     */
    async searchUnits(
        filters: Record<string, any>,
        page: number = 1,
        limit: number = 10,
        sortField: string = 'name',
        sortOrder: 'asc' | 'desc' = 'asc'
    ): Promise<UnitResultDTO[]> {
        const offset = (page - 1) * limit;
        const units = await this.unitFindRepository.findWithFiltersAndPagination(
            filters,
            offset,
            limit,
            sortField,
            sortOrder
        );
        return units.map(unit => new UnitResultDTO(unit.id, unit.name, unit.description));
    }
}
