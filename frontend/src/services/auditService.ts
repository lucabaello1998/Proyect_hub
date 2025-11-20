import type { AuditLog } from '../types/audit';

export const auditService = {
    async getAll(): Promise<AuditLog[]> {
        const token = localStorage.getItem('jwt');
        const response = await fetch('/api/audit', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Error al obtener logs de auditoría');
        return await response.json();
    },
    async getById(id: number): Promise<AuditLog> {
        const token = localStorage.getItem('jwt');
        const response = await fetch(`/api/audit/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Error al obtener detalle de auditoría');
        return await response.json();
    },
    async restore(id: number): Promise<AuditLog> {
        const token = localStorage.getItem('jwt');
        const response = await fetch(`/api/audit/revoke/${id}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Error al restaurar desde auditoría');
        return await response.json();
    }
};
