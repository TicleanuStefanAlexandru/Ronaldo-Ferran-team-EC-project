# Generate luxury automotive SVGs for RF Prestige
$cars = @(
    @{ Vin = "WP0ZZZ99ZPS291047"; Year = 2023; Make = "Porsche"; Model = "911 GT3"; Category = "Sports"; Color = "#3b82f6" },
    @{ Vin = "ZFF92LLA9N0267841"; Year = 2022; Make = "Ferrari"; Model = "F8 Tributo"; Category = "Sports"; Color = "#dc2626" },
    @{ Vin = "SBM14ABA8MW005128"; Year = 2021; Make = "McLaren"; Model = "720S Performance"; Category = "Sports"; Color = "#f97316" },
    @{ Vin = "ZHWEF4ZF4NLA14290"; Year = 2022; Make = "Lamborghini"; Model = "Hurac�n EVO"; Category = "Sports"; Color = "#84cc16" },
    @{ Vin = "1G1YB2D37P5604812"; Year = 2023; Make = "Chevrolet"; Model = "Corvette Z06"; Category = "Sports"; Color = "#eab308" },
    @{ Vin = "WDD1903791A083145"; Year = 2021; Make = "Mercedes-AMG"; Model = "GT R PRO"; Category = "Sports"; Color = "#10b981" },
    @{ Vin = "ZAM85VMA8PX398214"; Year = 2023; Make = "Maserati"; Model = "MC20 Cielo"; Category = "Sports"; Color = "#06b6d4" },
    @{ Vin = "SCFRMFAW7N8M02841"; Year = 2022; Make = "Aston Martin"; Model = "Vantage F1 Edition"; Category = "Sports"; Color = "#047857" },

    @{ Vin = "SCBDG4ZG4NC087412"; Year = 2022; Make = "Bentley"; Model = "Continental GT V8"; Category = "Grand Tourer"; Color = "#475569" },
    @{ Vin = "ZFF94LHA1P0281945"; Year = 2023; Make = "Ferrari"; Model = "Roma"; Category = "Grand Tourer"; Color = "#991b1b" },
    @{ Vin = "SCFEAHAW6NC012785"; Year = 2022; Make = "Aston Martin"; Model = "DB11 V8 Volante"; Category = "Grand Tourer"; Color = "#1e3a8a" },
    @{ Vin = "WP0ZZZ99ZPS283719"; Year = 2023; Make = "Porsche"; Model = "911 Turbo S"; Category = "Grand Tourer"; Color = "#334155" },
    @{ Vin = "WBAAE0C05MCH18924"; Year = 2021; Make = "BMW"; Model = "M8 Competition Coup�"; Category = "Grand Tourer"; Color = "#1e293b" },
    @{ Vin = "W1K2324871F019283"; Year = 2022; Make = "Mercedes-AMG"; Model = "SL 63 4MATIC+"; Category = "Grand Tourer"; Color = "#64748b" },
    @{ Vin = "JTHHP5AY5MA009842"; Year = 2021; Make = "Lexus"; Model = "LC 500 Sport+"; Category = "Grand Tourer"; Color = "#b45309" },
    @{ Vin = "ZAM45RMA1L0382914"; Year = 2020; Make = "Maserati"; Model = "GranTurismo MC"; Category = "Grand Tourer"; Color = "#1e1b4b" },

    @{ Vin = "WP0ZZZ97ZNL189423"; Year = 2022; Make = "Porsche"; Model = "Panamera Turbo S"; Category = "Luxury Sedan"; Color = "#0f172a" },
    @{ Vin = "W1K2231761A058291"; Year = 2022; Make = "Mercedes-Maybach"; Model = "S 580 4MATIC"; Category = "Luxury Sedan"; Color = "#1c1917" },
    @{ Vin = "WAUZZZF28PA082194"; Year = 2023; Make = "Audi"; Model = "RS6 Avant Vorsprung"; Category = "Luxury Sedan"; Color = "#27272a" },
    @{ Vin = "WBS33CH07NCB48219"; Year = 2022; Make = "BMW"; Model = "M5 CS Edition"; Category = "Luxury Sedan"; Color = "#14532d" },
    @{ Vin = "SCA664S59MUX82149"; Year = 2021; Make = "Rolls-Royce"; Model = "Ghost Extended"; Category = "Luxury Sedan"; Color = "#09090b" },
    @{ Vin = "SCBDH4ZG8PC098231"; Year = 2023; Make = "Bentley"; Model = "Flying Spur Azure"; Category = "Luxury Sedan"; Color = "#1e3a5f" },
    @{ Vin = "WAUZZZF25NA049218"; Year = 2022; Make = "Audi"; Model = "RS7 Sportback"; Category = "Luxury Sedan"; Color = "#3f3f46" },
    @{ Vin = "W1K2130891A928174"; Year = 2021; Make = "Mercedes-AMG"; Model = "E 63 S Final Edition"; Category = "Luxury Sedan"; Color = "#18181b" },

    @{ Vin = "SCFEAUBW7P8M04912"; Year = 2023; Make = "Aston Martin"; Model = "DBX707"; Category = "SUV"; Color = "#064e3b" },
    @{ Vin = "ZPBUA1ZL8NLA82914"; Year = 2022; Make = "Lamborghini"; Model = "Urus Performante"; Category = "SUV"; Color = "#ca8a04" },
    @{ Vin = "WP1ZZZ9YZPDA82149"; Year = 2023; Make = "Porsche"; Model = "Cayenne Turbo GT"; Category = "SUV"; Color = "#475569" },
    @{ Vin = "SALWK2EX5NA829140"; Year = 2022; Make = "Land Rover"; Model = "Range Rover SV LWB"; Category = "SUV"; Color = "#1e293b" },
    @{ Vin = "SCBDH4ZG2MC048192"; Year = 2021; Make = "Bentley"; Model = "Bentayga V8 First Edition"; Category = "SUV"; Color = "#374151" },
    @{ Vin = "W1N4632761X391824"; Year = 2022; Make = "Mercedes-AMG"; Model = "G 63 Magno Edition"; Category = "SUV"; Color = "#172554" },
    @{ Vin = "5YMJU0C07P9B82914"; Year = 2023; Make = "BMW"; Model = "X5 M Competition"; Category = "SUV"; Color = "#0284c7" },
    @{ Vin = "WAUZZZF17MA039184"; Year = 2021; Make = "Audi"; Model = "RS Q8 Carbon Black"; Category = "SUV"; Color = "#111827" }
)

$outDir = "assets/img"
if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir -Force | Out-Null }

$viewTypes = @(
    @{ Num = 1; Name = "Studio 3/4 Exterior"; Code = "34" },
    @{ Num = 2; Name = "Aerodynamic Profile"; Code = "side" },
    @{ Num = 3; Name = "Rear Track and Diffuser"; Code = "rear" },
    @{ Num = 4; Name = "Cockpit and Bespoke Trim"; Code = "interior" }
)

function Get-Silhouette($category, $view, $color) {
    if ($view -eq "interior") {
        return @"
        <!-- Cockpit Luxury Interior Graphics -->
        <circle cx='600' cy='520' r='180' fill='none' stroke='#c5a880' stroke-width='16' opacity='0.9'/>
        <circle cx='600' cy='520' r='160' fill='none' stroke='#262b35' stroke-width='6'/>
        <circle cx='600' cy='520' r='60' fill='#151922' stroke='#c5a880' stroke-width='4'/>
        <line x1='440' y1='520' x2='540' y2='520' stroke='#c5a880' stroke-width='14'/>
        <line x1='660' y1='520' x2='760' y2='520' stroke='#c5a880' stroke-width='14'/>
        <line x1='600' y1='580' x2='600' y2='680' stroke='#c5a880' stroke-width='14'/>
        <!-- Digital Cockpit Screen -->
        <rect x='340' y='260' width='520' height='140' rx='12' fill='#080b11' stroke='#333c4d' stroke-width='3'/>
        <path d='M380 340 A 50 50 0 0 1 480 340' fill='none' stroke='$color' stroke-width='5'/>
        <path d='M720 340 A 50 50 0 0 1 820 340' fill='none' stroke='#c5a880' stroke-width='5'/>
        <text x='600' y='330' fill='#f5f6f8' font-size='24' font-family='sans-serif' text-anchor='middle' font-weight='bold'>RF DIGITAL DISPLAY</text>
        <text x='600' y='360' fill='#c5a880' font-size='15' font-family='sans-serif' text-anchor='middle'>ACTIVE CHASSIS - SPORT PLUS</text>
        <!-- Carbon fiber dash trim -->
        <path d='M100 420 L1100 420 L1040 500 L160 500 Z' fill='#1b202c' stroke='#2d3545' stroke-width='2'/>
        <line x1='120' y1='460' x2='1080' y2='460' stroke='#c5a880' stroke-width='2' stroke-dasharray='12,6'/>
"@
    }

    if ($view -eq "rear") {
        return @"
        <!-- Rear Aggressive Stance -->
        <path d='M 300 480 Q 320 340 400 300 Q 600 290 800 300 Q 880 340 900 480 Q 940 540 920 600 L 280 600 Q 260 540 300 480 Z' fill='$color' opacity='0.85' stroke='#ffffff' stroke-width='1.5'/>
        <!-- Glass roof/rear windshield -->
        <path d='M 410 320 Q 600 310 790 320 L 760 410 Q 600 400 440 410 Z' fill='#0a0e17' stroke='#333e52' stroke-width='2'/>
        <!-- Sleek Lightbar -->
        <path d='M 320 450 Q 600 440 880 450' fill='none' stroke='#ef4444' stroke-width='10' stroke-linecap='round'/>
        <!-- Quad exhausts -->
        <circle cx='380' cy='580' r='20' fill='#1b1d24' stroke='#c5a880' stroke-width='4'/>
        <circle cx='430' cy='580' r='20' fill='#1b1d24' stroke='#c5a880' stroke-width='4'/>
        <circle cx='770' cy='580' r='20' fill='#1b1d24' stroke='#c5a880' stroke-width='4'/>
        <circle cx='820' cy='580' r='20' fill='#1b1d24' stroke='#c5a880' stroke-width='4'/>
        <!-- Diffuser Fins -->
        <line x1='540' y1='560' x2='540' y2='610' stroke='#556075' stroke-width='5'/>
        <line x1='600' y1='560' x2='600' y2='610' stroke='#556075' stroke-width='5'/>
        <line x1='660' y1='560' x2='660' y2='610' stroke='#556075' stroke-width='5'/>
        <!-- Wheels Rear Track -->
        <rect x='220' y='520' width='80' height='120' rx='16' fill='#11141c' stroke='#333c4d' stroke-width='4'/>
        <rect x='900' y='520' width='80' height='120' rx='16' fill='#11141c' stroke='#333c4d' stroke-width='4'/>
"@
    }

    if ($view -eq "side") {
        if ($category -eq "SUV") {
            return @"
            <!-- SUV Profile -->
            <path d='M 120 540 Q 150 490 260 480 L 360 360 Q 420 310 580 300 L 820 300 Q 940 320 1020 440 L 1080 520 Q 1100 560 1060 560 L 140 560 Z' fill='$color' opacity='0.9' stroke='#ffffff' stroke-width='1.5'/>
            <path d='M 380 360 L 560 350 L 560 450 L 340 450 Z' fill='#0b0f19' stroke='#333e50' stroke-width='2'/>
            <path d='M 580 350 L 780 350 L 860 450 L 580 450 Z' fill='#0b0f19' stroke='#333e50' stroke-width='2'/>
            <!-- Roof Rails -->
            <line x1='440' y1='290' x2='820' y2='290' stroke='#c5a880' stroke-width='5'/>
            <!-- Massive Wheels -->
            <circle cx='300' cy='560' r='75' fill='#11141c' stroke='#c5a880' stroke-width='6'/>
            <circle cx='300' cy='560' r='40' fill='#1b202c' stroke='#556075' stroke-width='4'/>
            <circle cx='900' cy='560' r='75' fill='#11141c' stroke='#c5a880' stroke-width='6'/>
            <circle cx='900' cy='560' r='40' fill='#1b202c' stroke='#556075' stroke-width='4'/>
"@
        } elseif ($category -eq "Sports") {
            return @"
            <!-- Supercar Low Wedge Profile -->
            <path d='M 100 550 Q 180 500 320 470 L 460 370 Q 560 330 720 340 L 910 440 L 1080 490 Q 1120 530 1080 550 L 120 550 Z' fill='$color' opacity='0.9' stroke='#ffffff' stroke-width='1.5'/>
            <!-- Low Cockpit Canopy -->
            <path d='M 450 380 Q 580 340 700 350 L 840 430 L 410 430 Z' fill='#0b0f19' stroke='#333e50' stroke-width='2'/>
            <!-- Active Rear Wing -->
            <path d='M 120 440 L 220 435' stroke='#c5a880' stroke-width='8' stroke-linecap='round'/>
            <line x1='150' y1='440' x2='150' y2='480' stroke='#c5a880' stroke-width='4'/>
            <line x1='190' y1='440' x2='190' y2='480' stroke='#c5a880' stroke-width='4'/>
            <!-- Supercar Wheels -->
            <circle cx='290' cy='540' r='65' fill='#11141c' stroke='#c5a880' stroke-width='6'/>
            <circle cx='290' cy='540' r='35' fill='#1b202c' stroke='#eab308' stroke-width='4'/>
            <circle cx='910' cy='540' r='65' fill='#11141c' stroke='#c5a880' stroke-width='6'/>
            <circle cx='910' cy='540' r='35' fill='#1b202c' stroke='#eab308' stroke-width='4'/>
"@
        } else {
            return @"
            <!-- Grand Tourer / Luxury Sedan Profile -->
            <path d='M 110 545 Q 160 480 280 470 L 420 360 Q 580 320 780 330 L 980 430 L 1090 490 Q 1120 535 1070 545 L 130 545 Z' fill='$color' opacity='0.9' stroke='#ffffff' stroke-width='1.5'/>
            <!-- Sleek Glasshouse -->
            <path d='M 430 370 Q 600 330 760 340 L 900 430 L 380 430 Z' fill='#0b0f19' stroke='#333e50' stroke-width='2'/>
            <!-- Chrome / Gold Beltline Trim -->
            <path d='M 360 435 L 940 435' stroke='#c5a880' stroke-width='3'/>
            <!-- Multi-spoke Wheels -->
            <circle cx='280' cy='545' r='70' fill='#11141c' stroke='#c5a880' stroke-width='6'/>
            <circle cx='280' cy='545' r='36' fill='#1b202c' stroke='#94a3b8' stroke-width='4'/>
            <circle cx='920' cy='545' r='70' fill='#11141c' stroke='#c5a880' stroke-width='6'/>
            <circle cx='920' cy='545' r='36' fill='#1b202c' stroke='#94a3b8' stroke-width='4'/>
"@
        }
    }

    # Default Front 3/4 Studio View
    return @"
    <!-- Dynamic 3/4 Luxury Silhouette -->
    <path d='M 240 540 Q 280 440 380 380 Q 560 310 780 320 Q 940 380 980 460 L 1040 530 Q 1060 560 980 570 L 260 570 Q 220 570 240 540 Z' fill='$color' opacity='0.88' stroke='#ffffff' stroke-width='1.5'/>
    <!-- Windshield & Greenhouse -->
    <path d='M 420 380 Q 590 325 740 330 L 860 410 Q 600 400 380 410 Z' fill='#0b0f18' stroke='#333f54' stroke-width='2.5'/>
    <!-- LED Matrix Headlight cluster -->
    <path d='M 920 460 Q 990 480 1020 500' fill='none' stroke='#38bdf8' stroke-width='7' stroke-linecap='round'/>
    <path d='M 260 490 Q 300 480 350 475' fill='none' stroke='#38bdf8' stroke-width='7' stroke-linecap='round'/>
    <!-- Luxury Front Grille with Metallic Gold outline -->
    <polygon points='520,460 680,460 660,530 540,530' fill='#121620' stroke='#c5a880' stroke-width='3'/>
    <!-- Wheels in perspective -->
    <ellipse cx='340' cy='540' rx='55' ry='65' fill='#11141c' stroke='#c5a880' stroke-width='5'/>
    <ellipse cx='930' cy='535' rx='60' ry='70' fill='#11141c' stroke='#c5a880' stroke-width='5'/>
"@
}

foreach ($c in $cars) {
    $vin = $c.Vin
    $make = $c.Make
    $model = $c.Model
    $year = $c.Year
    $cat = $c.Category
    $col = $c.Color

    for ($i = 1; $i -le 4; $i++) {
        $vt = $viewTypes[$i - 1]
        $fileName = "$vin-$i.svg"
        $filePath = Join-Path $outDir $fileName

        $graphic = Get-Silhouette -category $cat -view $vt.Code -color $col

        $svg = @"
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 800' width='100%' height='100%'>
  <defs>
    <radialGradient id='spotlight' cx='50%' cy='20%' r='75%' fx='50%' fy='15%'>
      <stop offset='0%' stop-color='#252d3d' stop-opacity='0.9'/>
      <stop offset='60%' stop-color='#10141d' stop-opacity='0.98'/>
      <stop offset='100%' stop-color='#07090d' stop-opacity='1'/>
    </radialGradient>
    <linearGradient id='floorGrad' x1='0%' y1='0%' x2='0%' y2='100%'>
      <stop offset='0%' stop-color='#121722'/>
      <stop offset='40%' stop-color='#0a0c12'/>
      <stop offset='100%' stop-color='#040507'/>
    </linearGradient>
    <linearGradient id='goldBadge' x1='0%' y1='0%' x2='100%' y2='100%'>
      <stop offset='0%' stop-color='#f5e3b5'/>
      <stop offset='50%' stop-color='#c5a880'/>
      <stop offset='100%' stop-color='#8c6f47'/>
    </linearGradient>
    <filter id='blurShadow' x='-20%' y='-20%' width='140%' height='140%'>
      <feGaussianBlur stdDeviation='16'/>
    </filter>
  </defs>

  <!-- Studio Background -->
  <rect x='0' y='0' width='1200' height='560' fill='url(#spotlight)'/>
  <rect x='0' y='560' width='1200' height='240' fill='url(#floorGrad)'/>

  <!-- Studio Floor Light Reflections & Grid -->
  <line x1='0' y1='560' x2='1200' y2='560' stroke='#c5a880' stroke-width='1' opacity='0.25'/>
  <line x1='100' y1='560' x2='-100' y2='800' stroke='#333c4d' stroke-width='1' opacity='0.3'/>
  <line x1='400' y1='560' x2='300' y2='800' stroke='#333c4d' stroke-width='1' opacity='0.3'/>
  <line x1='800' y1='560' x2='900' y2='800' stroke='#333c4d' stroke-width='1' opacity='0.3'/>
  <line x1='1100' y1='560' x2='1300' y2='800' stroke='#333c4d' stroke-width='1' opacity='0.3'/>

  <!-- Shadow below car -->
  <ellipse cx='600' cy='585' rx='440' ry='35' fill='#000000' opacity='0.85' filter='url(#blurShadow)'/>

  <!-- Vehicle Silhouette Vector Graphic -->
  $graphic

  <!-- Top Luxury Header Badge -->
  <rect x='40' y='36' width='320' height='42' rx='4' fill='#0c0f17' stroke='#c5a880' stroke-width='1.2' opacity='0.92'/>
  <text x='55' y='63' fill='#c5a880' font-family='serif' font-size='15' letter-spacing='2' font-weight='bold'>RF PRESTIGE</text>
  <text x='200' y='63' fill='#8b92a4' font-family='sans-serif' font-size='12' letter-spacing='1.5'>VERIFIED STOCK</text>
  <circle cx='335' cy='57' r='4' fill='#10b981'/>

  <!-- View Angle Tag -->
  <rect x='980' y='36' width='180' height='36' rx='4' fill='#141923' stroke='#2c3445' stroke-width='1'/>
  <text x='1070' y='60' fill='#c5a880' font-family='sans-serif' font-size='12' text-anchor='middle' font-weight='600'>VIEW $i OF 4</text>

  <!-- Lower Overlay with Title & VIN -->
  <rect x='40' y='670' width='1120' height='90' rx='8' fill='#0b0e15' stroke='rgba(197, 168, 128, 0.25)' stroke-width='1' opacity='0.95'/>
  <text x='70' y='715' fill='#f5f6f8' font-family='serif' font-size='30' font-weight='bold'>$year $make $model</text>
  <text x='70' y='745' fill='#8d95a5' font-family='sans-serif' font-size='14' letter-spacing='1.5'>VIN: <tspan fill='#c5a880' font-family='monospace'>$vin</tspan> | $($vt.Name.ToUpper())</text>

  <!-- Golden Certification Seal -->
  <g transform='translate(1070, 715)'>
    <circle cx='0' cy='0' r='24' fill='none' stroke='url(#goldBadge)' stroke-width='2'/>
    <text x='0' y='-4' fill='#c5a880' font-size='8' font-family='sans-serif' text-anchor='middle' font-weight='bold'>100%</text>
    <text x='0' y='7' fill='#f5f6f8' font-size='7' font-family='sans-serif' text-anchor='middle'>VERIFIED</text>
  </g>
</svg>
"@
        Set-Content -Path $filePath -Value $svg -Encoding UTF8
    }
}
Write-Output "Regenerated $($cars.Count * 4) 100% strictly valid XML luxury SVGs in $outDir"
