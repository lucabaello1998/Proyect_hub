export interface AuditLog {
    id: number;
    userId: number;
    entity: string;
    action: string;
    entityId?: number;
    timestamp: string;
    data?: string;
    performedByEmail?: string;
    details?: string;
}
