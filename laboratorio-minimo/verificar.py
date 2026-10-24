"""Observa las brechas del laboratorio con una base temporal; no aplica controles."""
import json
from contextlib import closing
from pathlib import Path
import sqlite3
from tempfile import TemporaryDirectory
from app import create_app

EXAMPLES = [
    dict(nombres="Ana", apellidos="Ejemplo", correo="ana@example.com", telefono="000000001"),
    dict(nombres="Luis", apellidos="Prueba", correo="luis@example.com", telefono="000000002"),
    dict(nombres="Eva", apellidos="Muestra", correo="eva@example.com", telefono="000000003"),
    dict(nombres="Leo", apellidos="Ensayo", correo="leo@example.com"),
]


def verify():
    with TemporaryDirectory() as temporary:
        database = Path(temporary) / "observacion.db"
        app = create_app(database)
        first, second = app.test_client(), app.test_client()
        for person in EXAMPLES:
            assert first.post("/registro", json=person).status_code == 201
        records = second.get("/registros")
        assert records.status_code == 200 and len(records.json) == 4
        assert records.json[0]["telefono"] == "000000001"
        assert records.json[3]["telefono"] is None
        assert first.post("/registro", json=EXAMPLES[0]).status_code == 201
        assert first.post("/registro", json={**EXAMPLES[0], "correo": "sin-formato"}).status_code == 201
        payload = {**EXAMPLES[0], "nombres": "O'Prueba'); DROP TABLE registro; --"}
        assert first.post("/registro", json=payload).status_code == 201
        assert len(second.get("/registros").json) == 7
        assert second.get("/registros").json[-1]["nombres"] == payload["nombres"]
        assert first.delete("/registros/1").status_code == 404
        assert first.patch("/registros/1", json={"nombres": "Cambio"}).status_code == 404
        with closing(sqlite3.connect(database)) as connection:
            assert connection.execute("SELECT correo FROM registro WHERE id=1").fetchone()[0] == "ana@example.com"
            columns = [row[1] for row in connection.execute("PRAGMA table_info(registro)")]
        assert columns == ["id", "nombres", "apellidos", "correo", "telefono", "creado_en"]
        assert b"ana@example.com" in database.read_bytes()
        return {
            "four_synthetic_records_created": True,
            "anonymous_second_client_reads_all_contacts": True,
            "telephone_returned_unmasked": True,
            "telephone_optional": True,
            "duplicate_email_accepted": True,
            "malformed_email_accepted": True,
            "sqlite_contact_values_readable": True,
            "deletion_and_rectification_routes_absent": True,
            "schema_has_no_expiry_or_consent_fields": True,
            "bound_sql_keeps_injection_like_input_literal": True,
        }


if __name__ == "__main__":
    print(json.dumps(verify(), indent=2))
