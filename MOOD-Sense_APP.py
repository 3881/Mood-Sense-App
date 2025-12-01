import time
import sqlite3
import socket
from flask import Flask, request, render_template, jsonify

app = Flask(__name__)
DB_PATH = "data/annotations.db"


# --- Database setup ----------------------------------------------------------
def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute( """
    CREATE TABLE IF NOT EXISTS "annotations" (
        "id"	INTEGER,
        "ip"	TEXT,
        "timestamp"	INTEGER,
        "value"	TEXT,
        "action"	INTEGER,
        "type"	TEXT,
        PRIMARY KEY("id" AUTOINCREMENT)
    )""")


   
    conn.commit()
    conn.close()

init_db()

# --- Utility: determine local IP --------------------------------------------
def get_local_ip():
    """Return the LAN IP address of the current host."""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
    except Exception:
        ip = "127.0.0.1"
    return ip

# --- Routes -----------------------------------------------------------------
@app.route('/')
def annotate():
    host_url = f"http://{get_local_ip()}:8100/"
    return render_template("annotate.html", hostname=host_url)

@app.route('/en')
def annotate_en():
    host_url = f"http://{get_local_ip()}:8100/"
    return render_template("annotate-en.html", hostname=host_url)

@app.route('/dashboard')
def dashboard():
    host_url = f"http://{get_local_ip()}:8100/"
    return render_template("dashboard.html", hostname=host_url)

def dict_factory(cursor, row):
    fields = [column[0] for column in cursor.description]
    return {key: value for key, value in zip(fields, row)}

@app.route('/post')
def post():
    value = request.args.get('button')
    action = request.args.get('action')
    type = request.args.get('type')
    timestamp = int(time.time() * 1_000_000_000)
    ip_addr = request.remote_addr

    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute(
        "INSERT INTO annotations (ip, timestamp, value, action, type) VALUES (?, ?, ?, ?, ?)",
        (ip_addr, timestamp, value, action, type),
    )
    conn.commit()
    conn.close()

    print("Annotation received:", ip_addr, value)
    return "Recorded successfully."

@app.route('/groups', methods=['GET'])
def groups():
    conn = sqlite3.connect(DB_PATH)
    c = conn.execute("SELECT DISTINCT ip FROM annotations;")
    data = c.fetchall()
    response = jsonify(data)
    conn.close()
    return response

@app.route('/annotations', methods=['GET'])
def annotations():
    ip = request.args.get('ip')
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT id, ip,  strftime(\"%d-%m-%Y %H:%M:%S\", datetime(timestamp / 1000000000, \'unixepoch\')) as time, value, action, type from annotations WHERE ip = ?;",(ip,))
    data = c.fetchall()
    response = jsonify(data)
    conn.close()
    return response

@app.route('/test')
def test():
    return "Hello WOrld"


@app.route('/recording', methods=['POST'])
def record():
    filename = f"./data/recordings/{int(time.time())}-assessment.wav"
    with open(filename, 'wb') as f:
        f.write(request.data)
    print("Audio saved:", filename)
    return "Audio saved successfully."


if __name__ == '__main__':
    #app.run(host='0.0.0.0', port=8100, debug=True, ssl_context='adhoc')
    app.run(host='0.0.0.0', port=8100, debug=True, ssl_context=('keys/host.cert', 'keys/host.key'))
