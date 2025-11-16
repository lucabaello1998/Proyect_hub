param(
    [Parameter(Mandatory = $true)]
    [string]$Profile
)

$envDir = "config/environments"
$secretsDir = "config/secrets/$Profile"
$backendConfig = "$secretsDir/ProyectHub.Api.appsettings.json"
$frontendEnv = "$secretsDir/frontend.env"

# Importar variables de entorno desde el perfil
$profileScript = "$envDir/$Profile.ps1"
if (Test-Path $profileScript) {
    Write-Host "Importando perfil de entorno: $profileScript"
    . $profileScript
}
else {
    Write-Host "No se encontro el script de perfil: $profileScript"
}

# Copiar secretos al backend
if (Test-Path $backendConfig) {
    Copy-Item $backendConfig backend/ProyectHub.Api/appsettings.json -Force
    Write-Host "Config backend copiada a backend/ProyectHub.Api/appsettings.json"
}
else {
    Write-Host "No se encontro la config del backend: $backendConfig"
}

# Copiar secretos al frontend
if (Test-Path $frontendEnv) {
    Copy-Item $frontendEnv frontend/.env -Force
    Write-Host "Variables de entorno frontend copiadas a frontend/.env"
}
else {
    Write-Host "No se encontraron las variables de entorno frontend: $frontendEnv"
}
