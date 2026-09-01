# Assembles belentani-portal build parts into a single index.html
$ErrorActionPreference = "Stop"
$dir = Split-Path -Parent $MyInvocation.MyCommand.Path
$out = Join-Path $dir "..\index.html"
$parts = @("head.html", "styles.css", "body.html", "app.js")
$sb = New-Object System.Text.StringBuilder
foreach ($p in $parts) {
  $content = [System.IO.File]::ReadAllText((Join-Path $dir $p))
  [void]$sb.Append($content)
  [void]$sb.AppendLine()
}
[void]$sb.Append("</script>`n</body>`n</html>")
[System.IO.File]::WriteAllText($out, $sb.ToString(), [System.Text.UTF8Encoding]::new($false))
Write-Host ("OK: " + $out + " (" + (Get-Item $out).Length + " bytes)")
