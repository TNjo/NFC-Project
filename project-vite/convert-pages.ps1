# PowerShell script to convert Next.js pages to React Router pages

$sourcePath = "../project/pages"
$destPath = "./src/pages"

# Create destination directory
New-Item -ItemType Directory -Force -Path $destPath | Out-Null
New-Item -ItemType Directory -Force -Path "$destPath/admin" | Out-Null

Write-Host "Converting Next.js pages to React Router..." -ForegroundColor Green

# Function to convert file content
function Convert-NextJsToReact {
    param($content)
    
    # Replace Next.js imports
    $content = $content -replace "import Head from 'next/head';", ""
    $content = $content -replace "import \{ useRouter \} from 'next/router';", "import { useNavigate, useParams, useSearchParams } from 'react-router-dom';"
    
    # Replace router usage
    $content = $content -replace "const router = useRouter\(\);", "const navigate = useNavigate();`nconst params = useParams();`nconst [searchParams] = useSearchParams();"
    $content = $content -replace "router\.push\(", "navigate("
    $content = $content -replace "router\.replace\(", "navigate("
    $content = $content -replace "router\.query\.(\w+)", "params.`$1 || searchParams.get('`$1')"
    
    # Remove Head component wrapper
    $content = $content -replace "<Head>[\s\S]*?<\/Head>", ""
    $content = $content -replace "<>", "<div>"
    $content = $content -replace "<\/>", "</div>"
    
    # Fix imports paths (adjust relative paths)
    $content = $content -replace "from '\.\.\/", "from '@/"
    $content = $content -replace "from '\.\./\.\.\/", "from '@/"
    
    return $content
}

# Convert individual files
$files = @(
    @{src="index.tsx"; dest="Home.tsx"},
    @{src="login.tsx"; dest="Login.tsx"},
    @{src="admin-setup.tsx"; dest="AdminSetup.tsx"},
    @{src="profile.tsx"; dest="Profile.tsx"},
    @{src="404.tsx"; dest="NotFound.tsx"},
    @{src="card/[cardId].tsx"; dest="Card.tsx"},
    @{src="admin/index.tsx"; dest="admin/Dashboard.tsx"},
    @{src="admin/cardholders.tsx"; dest="admin/Cardholders.tsx"},
    @{src="admin/add.tsx"; dest="admin/Add.tsx"}
)

foreach ($file in $files) {
    $sourceFile = Join-Path $sourcePath $file.src
    $destFile = Join-Path $destPath $file.dest
    
    if (Test-Path $sourceFile) {
        Write-Host "Converting $($file.src) -> $($file.dest)" -ForegroundColor Cyan
        $content = Get-Content $sourceFile -Raw
        $converted = Convert-NextJsToReact $content
        Set-Content -Path $destFile -Value $converted
    } else {
        Write-Host "Warning: $sourceFile not found" -ForegroundColor Yellow
    }
}

Write-Host "`nConversion complete!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Review the converted files in src/pages/" -ForegroundColor White
Write-Host "2. Run: npm install" -ForegroundColor White
Write-Host "3. Run: npm run dev" -ForegroundColor White

