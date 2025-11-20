import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { auditService } from '../services/auditService';
import type { AuditLog } from '../types/audit';
import { Box, Typography, Button, Paper, Divider } from '@mui/material';

export default function AuditDetail() {
    const { id } = useParams<{ id: string }>();
    const [log, setLog] = useState<AuditLog | null>(null);
    const [restoring, setRestoring] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            auditService.getById(Number(id)).then(setLog);
        }
    }, [id]);

    const handleRestore = async () => {
        if (!id) return;
        setRestoring(true);
        try {
            await auditService.restore(Number(id));
            alert('Restaurado correctamente');
            navigate('/admin');
        } catch (e) {
            alert('Error al restaurar: ' + (e as Error).message);
        } finally {
            setRestoring(false);
        }
    };

    if (!log) return <Typography>Cargando...</Typography>;

    let auditData: any = {};
    try {
        auditData = log.data ? JSON.parse(log.data) : {};
    } catch {
        auditData = {};
    }

    return (
        <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4 }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>Detalle de Auditoría #{log.id}</Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    Acción: <b>{log.action}</b> | Entidad: <b>{log.entity}</b> | ID Entidad: <b>{log.entityId}</b>
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    Fecha: {new Date(log.timestamp).toLocaleString()} | Usuario: {log.performedByEmail ? log.performedByEmail : (log.userId ? `ID ${log.userId}` : '—')}
                </Typography>
                {log.restoredAt && (
                    <Typography variant="body2" color="success.main" gutterBottom>
                        Restaurado el {new Date(log.restoredAt).toLocaleString()}
                    </Typography>
                )}
                <Divider sx={{ my: 2 }} />
                {log.action === 'update' && auditData.previous && auditData.current ? (
                    <Box>
                        <Typography variant="h6">Cambios</Typography>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography variant="subtitle2">Anterior</Typography>
                                <pre style={{ background: '#f5f5f5', padding: 8, borderRadius: 4, maxWidth: '100%', maxHeight: 300, overflow: 'auto', wordBreak: 'break-all', fontSize: 13 }}>{JSON.stringify(JSON.parse(auditData.previous), null, 2)}</pre>
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography variant="subtitle2">Actual</Typography>
                                <pre style={{ background: '#f5f5f5', padding: 8, borderRadius: 4, maxWidth: '100%', maxHeight: 300, overflow: 'auto', wordBreak: 'break-all', fontSize: 13 }}>{JSON.stringify(JSON.parse(auditData.current), null, 2)}</pre>
                            </Box>
                        </Box>
                    </Box>
                ) : (
                    <Box>
                        <Typography variant="h6">Snapshot</Typography>
                        <pre style={{ background: '#f5f5f5', padding: 8, borderRadius: 4, maxWidth: '100%', overflowX: 'auto', wordBreak: 'break-all' }}>{log.data}</pre>
                    </Box>
                )}
                {!log.restoredAt && (log.action === 'delete' || log.action === 'create') && (
                    <Button variant="contained" color="warning" sx={{ mt: 2 }} onClick={handleRestore} disabled={restoring}>
                        {restoring ? 'Restaurando...' : 'Restaurar/Revertir'}
                    </Button>
                )}
            </Paper>
        </Box>
    );
}
