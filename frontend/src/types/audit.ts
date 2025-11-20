export interface AuditLog {
    id: number;
    userId: number;
    entity: string;
    action: string;
    entityId?: number;
    timestamp: string;
    data?: string;
    performedByEmail?: string;
    restoredAt?: string;
    details?: string;
    revoked?: boolean;
    revokedBy?: number;
    revokedAt?: string;
}
