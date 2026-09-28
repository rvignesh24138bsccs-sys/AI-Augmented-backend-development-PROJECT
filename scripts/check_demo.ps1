$shell = New-Object -ComObject Shell.Application
$folderPath = "C:\Users\WIN\OneDrive\Pictures"
$fileName = "demo.mp4"

if (Test-Path "$folderPath\$fileName") {
    $folder = $shell.NameSpace($folderPath)
    $file = $folder.ParseName($fileName)

    Write-Output "File Found: $folderPath\$fileName"
    for ($i = 0; $i -lt 320; $i++) {
        $name = $folder.GetDetailsOf($null, $i)
        $val = $folder.GetDetailsOf($file, $i)
        if ($val) {
            Write-Output "${i}: ${name} = ${val}"
        }
    }
} else {
    Write-Output "File NOT found: $folderPath\$fileName"
}
