# Medir la app en un teléfono por DevTools (CDP)

Con estos scripts se midió `E.2` (plan del Bloque E). En el teléfono de `DEC-13` (HONOR) **ni
`logcat` ni `screencap` sirven**: el primero da 0 líneas en total y el segundo una imagen negra.
La única vía que funcionó fue el protocolo de DevTools (CDP) contra el WebView del APK de debug.

## Conectar

```powershell
$adb = "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe"
$p = (& $adb -s <serial> shell pidof com.elaris.pictolink).Trim()
& $adb -s <serial> forward tcp:9333 "localabstract:webview_devtools_remote_$p"
$ws = ((Invoke-WebRequest -UseBasicParsing http://127.0.0.1:9333/json).Content | ConvertFrom-Json)[0].webSocketDebuggerUrl
```

El pid cambia cada vez que la app se reinicia: hay que rehacer el `forward`. Al terminar:
`forward --remove-all`. Chrome del teléfono se inspecciona igual con `localabstract:chrome_devtools_remote`.

## Scripts

| Script | Para qué |
|---|---|
| `cdp-eval.mjs <ws> <expr \| @archivo>` | Evalúa JS en la página y devuelve el valor. **Con comillas dobles, pasalo en un archivo (`@ruta`)**: PowerShell 5.1 las rompe en los argumentos |
| `cdp-call.mjs <ws> <Metodo> [json]` | Un método CDP suelto (`Page.reload`, `Network.clearBrowserCache`) |
| `cdp-shot.mjs <ws> <salida.png>` | Captura. **Necesita la pantalla despierta** (`shell svc power stayon usb`, y `false` al terminar) |
| `pictos-sin-red.mts` | Genera la prueba de E.2.2: imágenes con anti-caché de `root` y 5 de control |
| `medicion-blancos.mts` | Celdas de `root` que hablan, con su centro en px de pantalla, para `adb shell input tap` |
| `medicion-instalar.js` | Listeners: `pointerdown`, `speak` saliendo por el puente (envuelve `androidBridge`), primer `onRangeStart` |
| `medicion-analizar.mjs <crudo.json> <orden.txt>` | Empareja toque → puente → voz y saca mediana, p90 y máximo por tramo |
| `tts-motor.js` / `tts-puente.js` | Controles de E.2.3: `speak()` sin toque, y una ida y vuelta por el puente sin sintetizar |
| `sesion-romper.js` / `sesion-restaurar.js` | Control negativo de sesión: respalda la cookie **en el teléfono**, la rompe y la restaura |

## Trampas medidas

- `medicion-instalar.js` se niega a correr dos veces en la misma página: instalado dos veces,
  cada toque y cada voz quedan duplicados. Para empezar de cero, `Page.reload` antes.
- `navigator.onLine` dice `true` en modo avión. La falta de red se verifica con
  `adb shell ping -c 1 -W 2 static.arasaac.org`.
- `>` de PowerShell agrega BOM: `medicion-analizar.mjs` lo quita al leer.
- Los `.mts` corren con `node --experimental-strip-types` e importan `data/aac-grid-layout.ts` tal cual.
