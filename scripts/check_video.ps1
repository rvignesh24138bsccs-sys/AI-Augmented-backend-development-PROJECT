$shell = New-Object -ComObject Shell.Application
$folder = $shell.NameSpace("C:\Users\WIN\Videos\Screen Recordings")
$file = $folder.ParseName("Screen Recording 2026-09-27 115707.mp4")

for ($i = 0; $i -lt 320; $i++) {
    $name = $folder.GetDetailsOf($null, $i)
    $val = $folder.GetDetailsOf($file, $i)
    if ($val) {
        Write-Output "${i}: ${name} = ${val}"
    }
}
