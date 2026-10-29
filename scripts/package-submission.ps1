param([Parameter(Mandatory=$true)][ValidatePattern('^[A-Za-z]{2}[0-9]{6}$')][string]$StudentCode)
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
Set-Location -LiteralPath $root
if (git status --porcelain --untracked-files=normal) { throw 'Commit all final source changes before packaging.' }
$paths = @(git ls-files)
$required = @('package.json','package-lock.json','components.json','.env.example','prisma/schema.prisma','prisma/migrations/migration_lock.toml')
foreach ($p in $required) { if ($paths -notcontains $p) { throw "Missing tracked file: $p" } }
if (-not ($paths -match '^prisma/migrations/[^/]+/migration.sql$')) { throw 'No application migration yet. Complete the real schema and migration before submission.' }
$allowed = @($paths | Where-Object {
  ($_ -match '^(src/|components/|public/|prisma/|scripts/)') -or
  ($_ -match '^(package(-lock)?\.json|components\.json|tsconfig\.json|next-env\.d\.ts|next\.config\.ts|postcss\.config\.mjs|eslint\.config\.mjs|prisma\.config\.ts|vercel\.json|README\.md|\.env\.example|\.gitignore)$')
} | Where-Object { $_ -notmatch '(^|/)(\.env($|\.(?!example$))|node_modules/|\.next/|\.git/|\.vercel/|generated/)' })
New-Item -ItemType Directory -Force -Path (Join-Path $root 'submission') | Out-Null
$zip = Join-Path $root "submission/$StudentCode.zip"
git archive --format=zip --output=$zip HEAD -- @allowed
if ($LASTEXITCODE -ne 0) { throw 'Packaging failed.' }
Write-Output "Created $zip from committed source. Add the final real Word document in the same folder."
