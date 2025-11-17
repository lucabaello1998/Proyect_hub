param(
    [Parameter(Mandatory = $true)]
    [string]$Profile
)

$projectRoot = Split-Path -Parent $PSScriptRoot
$envDir = Join-Path $projectRoot "config/environments"
$secretsDir = Join-Path $projectRoot "config/secrets/$Profile"
$backendConfig = Join-Path $secretsDir "ProyectHub.Api.appsettings.json"
$frontendEnv = Join-Path $secretsDir "frontend.env"


# Importar variables de entorno desde el perfil
$profileScript = Join-Path $envDir "$Profile.ps1"
if (Test-Path $profileScript) {
    Write-Host "Importando perfil de entorno: $profileScript"
    . $profileScript
}
else {
    Write-Host "No se encontro el script de perfil: $profileScript"
}


# Copiar secretos al backend
$backendTarget = Join-Path $projectRoot "backend/ProyectHub.Api/appsettings.json"
if (Test-Path $backendConfig) {
    Copy-Item $backendConfig $backendTarget -Force
    Write-Host "Config backend copiada a $backendTarget"
}
else {
    Write-Host "No se encontro la config del backend: $backendConfig"
}

# Copiar secretos al frontend
$frontendTarget = Join-Path $projectRoot "frontend/.env"
if (Test-Path $frontendEnv) {
    Copy-Item $frontendEnv $frontendTarget -Force
    Write-Host "Variables de entorno frontend copiadas a $frontendTarget"
}
else {
    Write-Host "No se encontraron las variables de entorno frontend: $frontendEnv"
}
