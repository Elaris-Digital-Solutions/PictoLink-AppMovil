package com.elaris.pictolink;

import android.net.Uri;
import android.os.Bundle;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.BridgeWebViewClient;
import com.getcapacitor.Logger;
import java.io.IOException;
import java.io.InputStream;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // E.2.2: el tablero sigue pidiendo la URL de ARASAAC (0 líneas del tablero tocadas);
        // aquí se responde con el PNG precargado si existe. Ver scripts/precargar-pictos.mjs.
        bridge.setWebViewClient(new PictosLocales());
    }

    /** El PNG precargado de ese id, o null si no está en assets/arasaac/ (caso esperado). */
    private InputStream pictoLocal(String id) {
        try {
            return getAssets().open("arasaac/" + id + ".png");
        } catch (IOException noEsta) {
            return null;
        }
    }

    private class PictosLocales extends BridgeWebViewClient {

        PictosLocales() {
            super(bridge);
        }

        @Override
        public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
            Uri url = request.getUrl();
            // Las URL del tablero son https://static.arasaac.org/pictograms/{id}/{id}_500.png
            if ("static.arasaac.org".equals(url.getHost()) && url.getPathSegments().size() >= 2) {
                String id = url.getPathSegments().get(1);
                InputStream stream = pictoLocal(id);
                if (stream != null) {
                    Logger.debug("PictosLocales", "local " + id);
                    return new WebResourceResponse("image/png", null, stream);
                }
            }
            // Lo que no está precargado sigue por red, como hoy (decisión 2026-11-11).
            return super.shouldInterceptRequest(view, request);
        }
    }
}
