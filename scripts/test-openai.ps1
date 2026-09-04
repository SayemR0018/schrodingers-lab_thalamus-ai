# GPT-5.6-safe OpenAI smoke test.
# Usage (from Thalamus_DeployReady):
#   powershell -File .\scripts\test-openai.ps1
#
# gpt-5.6-luna/terra reject `max_tokens` and custom `temperature`.
# This script lists models, then sends max_completion_tokens and omits temperature.

$ErrorActionPreference = "Stop"
$scriptDir = if ($PSScriptRoot) { $PSScriptRoot } else { Join-Path (Get-Location) "scripts" }
$root = Split-Path -Parent $scriptDir
$envPath = Join-Path $root ".env.local"

if (-not (Test-Path $envPath)) {
  Write-Host "Missing $envPath" -ForegroundColor Red
  exit 1
}

function Read-EnvValue([string]$raw) {
  $value = $raw.Trim().Trim('"').Trim("'")
  $commentIdx = $value.IndexOf(" #")
  if ($commentIdx -ge 0) { $value = $value.Substring(0, $commentIdx).Trim() }
  return $value
}

$apiKey = $null
$model = "gpt-5.6-luna"
Get-Content $envPath | ForEach-Object {
  if ($_ -match '^\s*OPENAI_API_KEY\s*=\s*(.+)\s*$') {
    $apiKey = Read-EnvValue $Matches[1]
  }
  if ($_ -match '^\s*OPENAI_MODEL_DEFAULT\s*=\s*(.+)\s*$') {
    $model = Read-EnvValue $Matches[1]
  }
}

if (-not $apiKey -or $apiKey -notmatch '^sk-') {
  Write-Host "OPENAI_API_KEY is missing or a placeholder in .env.local" -ForegroundColor Red
  exit 1
}

$headers = @{
  Authorization = "Bearer $apiKey"
  "Content-Type" = "application/json"
}

Write-Host "`n[1/2] GET /v1/models" -ForegroundColor Cyan
try {
  $models = Invoke-RestMethod -Uri "https://api.openai.com/v1/models" -Headers @{ Authorization = "Bearer $apiKey" } -Method Get
  Write-Host "SUCCESS: API key is valid. Models on account: $($models.data.Count)" -ForegroundColor Green
} catch {
  Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
  if ($_.ErrorDetails) { Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor DarkRed }
  exit 1
}

$bodyObj = @{
  model = $model
  messages = @(
    @{ role = "user"; content = "Respond with the single word: READY" }
  )
  max_completion_tokens = 16
}
$body = $bodyObj | ConvertTo-Json -Compress -Depth 5

Write-Host "`n[2/2] POST /v1/chat/completions  model=$model" -ForegroundColor Cyan
Write-Host "Payload keys: model, messages, max_completion_tokens (temperature omitted)" -ForegroundColor DarkGray
try {
  $res = Invoke-RestMethod -Uri "https://api.openai.com/v1/chat/completions" -Headers $headers -Method Post -Body $body
  Write-Host "SUCCESS" -ForegroundColor Green
  Write-Host "Model Used: $($res.model)" -ForegroundColor Cyan
  Write-Host "Response:   $($res.choices[0].message.content)" -ForegroundColor Yellow
} catch {
  Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
  if ($_.ErrorDetails) {
    Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor DarkRed
  }
  exit 1
}
