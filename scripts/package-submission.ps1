param([Parameter(Mandatory=$true)][ValidatePattern('^[A-Za-z]{2}[0-9]{6}$')][string]$StudentCode)
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
Set-Location -LiteralPath $root
if (git status --porcelain --untracked-files=normal) { throw 'Commit all final source changes before packaging.' }
$paths = @(git ls-files)
$required = @('package.json','package-lock.json','components.json','.env.example','prisma/schema.prisma','prisma/migrations/migration_lock.toml','README.md')
foreach ($p in $required) { if ($paths -notcontains $p) { throw "Missing tracked file: $p" } }
if (-not ($paths -match '^prisma/migrations/[^/]+/migration.sql$')) { throw 'No committed application migrations.' }
$forbidden = @($paths | Where-Object {
  $_ -match '(^|/)(node_modules|\.next|\.git|\.vercel|generated|\.submission-work|QE[0-9]{6})(/|$)' -or
  ((Split-Path $_ -Leaf) -like '.env*' -and (Split-Path $_ -Leaf) -ne '.env.example')
})
if ($forbidden.Count) { throw 'Excluded or private files are tracked. Remove them from Git before packaging.' }
$example = (Get-Content -LiteralPath '.env.example' | Where-Object { $_.Trim() -ne '' }) -join "`n"
if ($example -ne "DATABASE_URL=`nDIRECT_URL=`nAUTH_SECRET=") { throw '.env.example must contain only the three empty variables.' }
$outputDirectory = Join-Path $root $StudentCode
New-Item -ItemType Directory -Force -Path $outputDirectory | Out-Null
$zip = Join-Path $outputDirectory "$StudentCode.zip"
git archive --format=zip --output=$zip HEAD
if ($LASTEXITCODE -ne 0) { throw 'Packaging failed.' }
Add-Type -AssemblyName System.IO.Compression.FileSystem
$archive = [IO.Compression.ZipFile]::OpenRead($zip)
try {
  foreach ($p in $required) { if (-not $archive.GetEntry($p)) { throw "ZIP missing root path: $p" } }
} finally { $archive.Dispose() }
Write-Output "Created $zip from the complete committed source, with package.json directly at the ZIP root."
