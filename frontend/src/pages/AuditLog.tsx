import { useEffect, useState } from "react";

interface AuditLog {
    id: number;
    userId: number;
    action: string;
    entity: string;
    entityId?: number;
    timestamp: string;
    details?: string;
    revoked: boolean;
    revokedBy?: number;
    revokedAt?: string;
}

export default function AuditLogPage() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/audit")
            .then((res) => res.json())
            .then((data) => {
                setLogs(data);
                setLoading(false);
            });
    }, []);

    const handleRevoke = async (id: number) => {
        await fetch(`/api/audit/revoke/${id}`, { method: "POST" });
        setLogs((logs) =>
            logs.map((log) =>
                log.id === id ? { ...log, revoked: true, revokedAt: new Date().toISOString() } : log
            )
        );
    };

    if (loading) return <div>Cargando registro...</div>;

    return (
        <div>
            <h2>Registro de Auditoría</h2>
            {logs.length === 0 ? (
                <div style={{ marginTop: 32, textAlign: 'center', color: '#888' }}>
                    No hay registros de auditoría para mostrar.
                </div>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Usuario</th>
                            <th>Acción</th>
                            <th>Entidad</th>
                            <th>Fecha</th>
                            <th>Detalles</th>
                            <th>Revocada</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log) => (
                            <tr key={log.id}>
                                <td>{log.userId}</td>
                                <td>{log.action}</td>
                                <td>{log.entity} {log.entityId ?? ""}</td>
                                <td>{new Date(log.timestamp).toLocaleString()}</td>
                                <td>{log.details}</td>
                                <td>{log.revoked ? `Sí (${log.revokedAt ? new Date(log.revokedAt).toLocaleString() : ""})` : "No"}</td>
                                <td>
                                    {!log.revoked && (
                                        <button onClick={() => handleRevoke(log.id)}>Revocar</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
