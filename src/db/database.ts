import Dexie, { type Table } from 'dexie';

// ─── Enums ────────────────────────────────────────────────────────────────────

export type Role = 'dev' | 'crisis_manager' | 'shelter_manager';
export type RoleScope = 'global' | 'organization' | 'crisis' | 'shelter';
export type OrganizationType = 'crisis_manager' | 'shelter_operator' | 'donor' | 'mixed' | 'other';
export type BrazilianState =
  | 'AC' | 'AL' | 'AP' | 'AM' | 'BA' | 'CE' | 'DF' | 'ES' | 'GO'
  | 'MA' | 'MT' | 'MS' | 'MG' | 'PA' | 'PB' | 'PR' | 'PE' | 'PI'
  | 'RJ' | 'RN' | 'RS' | 'RO' | 'RR' | 'SC' | 'SP' | 'SE' | 'TO';
export type CrisisType = 'flood' | 'fire' | 'landslide' | 'drought' | 'storm' | 'epidemic' | 'other';
export type CrisisStatus = 'draft' | 'active' | 'closed' | 'archived';
export type ShelterType = 'institutional' | 'community_home' | 'improvised_public';
export type ShelterStatus = 'preparing' | 'active' | 'full' | 'closed';
export type VulnerabilityType = 'child' | 'elderly' | 'pregnant' | 'disabled' | 'chronic_illness' | 'none' | 'other';
export type ResourceUnit = 'kg' | 'g' | 'L' | 'mL' | 'unidade' | 'real';
export type LotCategory = 'essenciais' | 'saude' | 'infantil_e_idosos' | 'animais' | 'infraestrutura' | 'operacao';
export type SupplyStatus = 'Sufficient' | 'Low' | 'Critical';
export type MovementDirection = 'in' | 'out';
export type MovementReason = 'donation' | 'distribution' | 'transfer_in' | 'transfer_out' | 'adjustment' | 'expired' | 'other';
export type AuditAction = 'create' | 'update' | 'close' | 'reopen' | 'delete' | 'verify' | 'pledge' | 'confirm' | 'deliver' | 'cancel' | 'login' | 'logout';
export type AuditEntityType = 'ORGANIZATION' | 'USER' | 'ROLE' | 'CRISIS' | 'SHELTER' | 'BENEFICIARY' | 'SHELTER_NEED' | 'INVENTORY_ITEM' | 'DONATION' | 'DISTRIBUTION' | 'NOTIFICATION';

// ─── Models ───────────────────────────────────────────────────────────────────

export interface DBUser {
  id: string;
  organization_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  verified: boolean;
  created_at: string;
  last_login_at: string | null;
}

export interface DBOrganization {
  id: string;
  name: string;
  cnpj: string | null;
  type: OrganizationType;
  contact_email: string | null;
  created_at: string;
}

export interface DBCrisis {
  id: string;
  name: string;
  organization_id: string | null;
  type: CrisisType;
  description: string | null;
  status: CrisisStatus;
  state: BrazilianState;
  city: string;
  latitude: number | null;
  longitude: number | null;
  start_date: string | null;
  severity_initial: number | null;
  severity_calculated: number | null;
  severity_calculated_at: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  closed_by: string | null;
  close_reason: string | null;
}

export interface DBShelter {
  id: string;
  organization_id: string | null;
  responsible_user_id: string;
  created_by: string;
  verified_by: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  address: string;
  neighborhood: string | null;
  city: string;
  state: BrazilianState;
  cep: string | null;
  latitude: number | null;
  longitude: number | null;
  capacity: number;
  entry_requirements: string | null;
  attended_special_needs: string | null;
  occupation: number;
  shelter_type: ShelterType;
  status: ShelterStatus;
  bio: string | null;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface DBBeneficiary {
  id: string;
  user_id: string | null;
  cpf: string | null;
  name: string;
  age: number | null;
  birth_date: string | null;
  phone: string | null;
  vulnerability: VulnerabilityType | null;
  notes: string | null;
}

export interface DBShelterStay {
  id: string;
  beneficiary_id: string;
  shelter_id: string;
  checked_in_at: string;
  checked_out_at: string | null;
}

export interface DBResourceCategory {
  id: string;
  name: string;
  unit: ResourceUnit;
  lot_category: LotCategory;
  description: string | null;
}

export interface DBInventoryItem {
  id: string;
  shelter_id: string;
  category_id: string;
  quantity_current: number;
  quantity_max: number | null;
  updated_at: string;
}

export interface DBInventoryMovement {
  id: string;
  shelter_id: string;
  category_id: string;
  direction: MovementDirection;
  quantity: number;
  reason: MovementReason;
  source: string | null;
  notes: string | null;
  destination_shelter_id: string | null;
  created_by: string;
  created_at: string;
}

export interface DBRegistrationRequest {
  id: string;
  status: string;
  request_type: string;
  name: string;
  email: string;
  phone: string | null;
  roles: string[];
  organization_id: string | null;
  new_organization_name: string | null;
  new_organization_cnpj: string | null;
  new_organization_type: string | null;
  new_organization_contact_email: string | null;
  user_id: string | null;
  created_organization_id: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
}

export interface DBAuditLog {
  id: string;
  entity_type: AuditEntityType;
  entity_id: string;
  action: AuditAction;
  author_id: string;
  payload: Record<string, unknown> | null;
  created_at: string;
}

// ─── Junction tables ──────────────────────────────────────────────────────────

export interface DBUserRole {
  user_id: string;
  role: Role;
  granted_at: string;
}

export interface DBUsersShelters {
  user_id: string;
  shelter_id: string;
  granted_at: string;
  granted_by: string | null;
}

export interface DBUsersCrises {
  user_id: string;
  crisis_id: string;
  granted_at: string;
  granted_by: string | null;
}

export interface DBCrisesShelters {
  crisis_id: string;
  shelter_id: string;
  joined_at: string;
}

// ─── Operations cache (mega-payload) ─────────────────────────────────────────

export interface DBCrisisOperationsCache {
  crisis_id: string;           // PK
  payload: unknown;            // raw CrisisOperations response
  cached_at: string;           // ISO timestamp
}

// ─── Sync queue ───────────────────────────────────────────────────────────────

export type SyncStatus = 'pending' | 'retrying' | 'failed';

export interface PendingRequest {
  id?: number; // auto-increment
  url: string;
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body: string; // JSON.stringify'd payload
  headers: Record<string, string>;
  created_at: string;
  attempts: number;
  status: SyncStatus;
  last_error: string | null;
}

// ─── Database class ───────────────────────────────────────────────────────────

export class HSDatabase extends Dexie {
  users!: Table<DBUser, string>;
  organizations!: Table<DBOrganization, string>;
  crises!: Table<DBCrisis, string>;
  shelters!: Table<DBShelter, string>;
  beneficiaries!: Table<DBBeneficiary, string>;
  shelterStays!: Table<DBShelterStay, string>;
  resourceCategories!: Table<DBResourceCategory, string>;
  inventoryItems!: Table<DBInventoryItem, string>;
  inventoryMovements!: Table<DBInventoryMovement, string>;
  registrationRequests!: Table<DBRegistrationRequest, string>;
  auditLogs!: Table<DBAuditLog, string>;

  // Junction tables
  userRoles!: Table<DBUserRole, [string, string]>;
  usersShelters!: Table<DBUsersShelters, [string, string]>;
  usersCrises!: Table<DBUsersCrises, [string, string]>;
  crisesShelters!: Table<DBCrisesShelters, [string, string]>;

  // Operations cache
  operationsCache!: Table<DBCrisisOperationsCache, string>;

  // Sync queue (auto-increment PK)
  pendingRequests!: Table<PendingRequest, number>;

  constructor() {
    super('hs_database');

    this.version(1).stores({
      users:                'id, organization_id, email',
      organizations:        'id, type',
      crises:               'id, status, state, organization_id, created_by',
      shelters:             'id, status, state, organization_id, responsible_user_id',
      beneficiaries:        'id, cpf',
      shelterStays:         'id, beneficiary_id, shelter_id, checked_out_at',
      resourceCategories:   'id, lot_category',
      inventoryItems:       'id, shelter_id, category_id',
      inventoryMovements:   'id, shelter_id, category_id, direction, created_at',
      registrationRequests: 'id, status, email',
      auditLogs:            'id, entity_type, entity_id, author_id, created_at',

      // Junction tables — composite PKs
      userRoles:      '[user_id+role], user_id, role',
      usersShelters:  '[user_id+shelter_id], user_id, shelter_id',
      usersCrises:    '[user_id+crisis_id], user_id, crisis_id',
      crisesShelters: '[crisis_id+shelter_id], crisis_id, shelter_id',

      // Operations cache
      operationsCache: 'crisis_id, cached_at',

      // Sync queue
      pendingRequests: '++id, status, created_at',
    });
  }
}

export const db = new HSDatabase();
