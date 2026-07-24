import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.InputStream;
import java.net.InetSocketAddress;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Petit serveur web "maison" pour le jeu Familles en Or.
 * - Sert les fichiers statiques du dossier /web (HTML, CSS, JS)
 * - Expose une API très simple pour lire/écrire les questions (data/questions.json)
 *
 * Aucune librairie externe requise : uniquement le JDK (com.sun.net.httpserver).
 */
public class Main {

    static final Path WEB_DIR = Paths.get("web");
    static final Path DATA_FILE = Paths.get("data", "questions.json");

    public static void main(String[] args) throws IOException {
        int port = 8000;
        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);

        server.createContext("/api/questions", new QuestionsHandler());
        server.createContext("/", new StaticHandler());

        server.setExecutor(null); // exécuteur par défaut, suffisant pour un usage local
        server.start();

        System.out.println("======================================");
        System.out.println(" Familles en Or - serveur demarre");
        System.out.println(" Ouvre ton navigateur sur : http://localhost:" + port);
        System.out.println("======================================");
    }

    /** Sert les fichiers statiques du dossier web/ (index.html, jouer.html, etc.) */
    static class StaticHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String path = exchange.getRequestURI().getPath();
            if (path.equals("/")) {
                path = "/index.html";
            }

            Path file = WEB_DIR.resolve(path.substring(1)).normalize();

            // Sécurité basique : on reste dans le dossier web/
            if (!file.startsWith(WEB_DIR) || !Files.exists(file) || Files.isDirectory(file)) {
                byte[] msg = "404 - Fichier non trouve".getBytes();
                exchange.sendResponseHeaders(404, msg.length);
                exchange.getResponseBody().write(msg);
                exchange.close();
                return;
            }

            byte[] bytes = Files.readAllBytes(file);
            exchange.getResponseHeaders().set("Content-Type", contentType(file.toString()));
            exchange.sendResponseHeaders(200, bytes.length);
            exchange.getResponseBody().write(bytes);
            exchange.close();
        }

        private String contentType(String path) {
            if (path.endsWith(".html")) return "text/html; charset=utf-8";
            if (path.endsWith(".css")) return "text/css; charset=utf-8";
            if (path.endsWith(".js")) return "application/javascript; charset=utf-8";
            if (path.endsWith(".json")) return "application/json; charset=utf-8";
            if (path.endsWith(".svg")) return "image/svg+xml";
            return "application/octet-stream";
        }
    }

    /**
     * API des questions.
     * GET  /api/questions  -> renvoie le contenu de data/questions.json
     * POST /api/questions  -> remplace le contenu de data/questions.json par le corps recu
     *
     * On ne parse pas le JSON cote serveur : c'est le navigateur (JavaScript) qui
     * construit et lit le JSON. Le serveur se contente de lire/ecrire le fichier.
     */
    static class QuestionsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            exchange.getResponseHeaders().set("Content-Type", "application/json; charset=utf-8");
            String method = exchange.getRequestMethod();

            if (method.equalsIgnoreCase("GET")) {
                byte[] bytes = Files.exists(DATA_FILE) ? Files.readAllBytes(DATA_FILE) : "[]".getBytes();
                exchange.sendResponseHeaders(200, bytes.length);
                exchange.getResponseBody().write(bytes);
                exchange.close();

            } else if (method.equalsIgnoreCase("POST")) {
                try (InputStream is = exchange.getRequestBody()) {
                    byte[] body = is.readAllBytes();
                    Files.createDirectories(DATA_FILE.getParent());
                    Files.write(DATA_FILE, body);
                }
                byte[] resp = "{\"status\":\"ok\"}".getBytes();
                exchange.sendResponseHeaders(200, resp.length);
                exchange.getResponseBody().write(resp);
                exchange.close();

            } else {
                exchange.sendResponseHeaders(405, -1);
                exchange.close();
            }
        }
    }
}
