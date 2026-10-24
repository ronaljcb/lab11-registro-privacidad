"""Backend del ejercicio de la diapositiva 21. Ejecutar solo con datos ficticios."""
from pathlib import Path
from contextlib import closing
import sqlite3

from flask import Flask, jsonify, request


def create_app(database_path=None):
    app = Flask(__name__)
    database = Path(database_path or Path(__file__).with_name("lab.db"))
    with closing(sqlite3.connect(database)) as connection, connection:
        connection.execute("""CREATE TABLE IF NOT EXISTS registro (
            id INTEGER PRIMARY KEY,
            nombres TEXT NOT NULL,
            apellidos TEXT NOT NULL,
            correo TEXT NOT NULL,
            telefono TEXT,
            creado_en TEXT DEFAULT CURRENT_TIMESTAMP
        )""")

    @app.post("/registro")
    def register():
        data = request.get_json(silent=True)
        if not isinstance(data, dict) or any(key not in data for key in ("nombres", "apellidos", "correo")):
            return jsonify(error="Se requieren nombres, apellidos y correo en JSON"), 400
        with closing(sqlite3.connect(database)) as connection, connection:
            cursor = connection.execute(
                "INSERT INTO registro (nombres, apellidos, correo, telefono) VALUES (?, ?, ?, ?)",
                (data["nombres"], data["apellidos"], data["correo"], data.get("telefono")),
            )
            identifier = cursor.lastrowid
        return jsonify(id=identifier), 201

    @app.get("/registros")
    def records():
        with closing(sqlite3.connect(database)) as connection:
            connection.row_factory = sqlite3.Row
            rows = connection.execute("SELECT * FROM registro ORDER BY id").fetchall()
        return jsonify([dict(row) for row in rows])

    return app


if __name__ == "__main__":
    create_app().run(host="127.0.0.1", port=5111, debug=False)
