import { useEffect, useState } from "react";
import { Table, TableHead, TableRow, TableCell, TableBody, Paper, Typography, Box, Button } from '@mui/material';
import { auditService } from '../services/auditService';
import type { AuditLog } from '../types/audit';
import { useNavigate } from 'react-router-dom';

export default function AuditLogPage() {
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [loadingAudit, setLoadingAudit] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setLoadingAudit(true);
        auditService.getAll().then(setAuditLogs).finally(() => setLoadingAudit(false));
    }, []);

    return (
        <Paper sx={{ p: 3, mt: 2 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>Registro de Auditoría</Typography>
            <Box sx={{ overflowX: 'auto' }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Acción</TableCell>
                            <TableCell>Entidad</TableCell>
                            <TableCell>ID Entidad</TableCell>
                            <TableCell>Usuario</TableCell>
                            <TableCell>Fecha</TableCell>
                            <TableCell>Restaurado</TableCell>
                            <TableCell>Detalles</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loadingAudit ? (
                            <TableRow><TableCell colSpan={8}>Cargando...</TableCell></TableRow>
                        ) : auditLogs.length === 0 ? (
                            <TableRow><TableCell colSpan={8}>No hay registros de auditoría</TableCell></TableRow>
                        ) : auditLogs.map(log => (
                            <TableRow key={log.id}>
                                <TableCell>{log.id}</TableCell>
                                <TableCell>{log.action}</TableCell>
                                <TableCell>{log.entity}</TableCell>
                                <TableCell>{log.entityId}</TableCell>
                                <TableCell>{log.performedByEmail || '—'}</TableCell>
                                <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                                <TableCell>—</TableCell>
                                <TableCell>
                                    <Button variant="text" onClick={() => navigate(`/audit/${log.id}`)} size="small">
                                        Ver detalles
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
        </Paper>
    );
}
