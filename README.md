# MicroEvalX-

### 1. **Authentication Service**

#### **Fungsi**: 
- Mengelola otentikasi pengguna (login, registrasi, logout) dengan dukungan JWT.

#### **Layanan Utama**:
- **API Login** (`POST /auth/login`): Menerima email dan password pengguna, menghasilkan token JWT.
- **API Register** (`POST /auth/register`): Menerima data pengguna dan menyimpan data pengguna baru di database.
- **API Logout** (`POST /auth/logout`): Invalidasi token JWT.

#### **Skema Database** (PostgreSQL via **Supabase**):
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  username VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```
- **Koneksi Database**: PostgreSQL di-host oleh Supabase untuk penyimpanan pengguna dan pengelolaan data login.
- **Autentikasi**: Menggunakan **JWT** untuk mengelola sesi pengguna.

#### **Layanan Pengujian**:
- **Postman** atau **JMeter**: Untuk menguji waktu respons API login dan register.
- **OWASP ZAP**: Untuk menguji keamanan autentikasi dan melindungi dari serangan brute force atau SQL injection.

---

### 2. **User Profile Service**

#### **Fungsi**:
- Mengelola profil pengguna, seperti nama lengkap, email, alamat, nomor telepon, dan gambar profil.

#### **Layanan Utama**:
- **API Get Profile** (`GET /profile/{user_id}`): Mendapatkan data profil pengguna.
- **API Update Profile** (`PUT /profile/{user_id}`): Memperbarui data profil pengguna.
- **API Delete Profile** (`DELETE /profile/{user_id}`): Menghapus data profil pengguna.

#### **Skema Database** (PostgreSQL via **Supabase**):
```sql
CREATE TABLE profiles (
  user_id UUID REFERENCES users(id),
  full_name VARCHAR(255),
  email VARCHAR(255),
  address TEXT,
  phone_number VARCHAR(20),
  profile_picture_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```
- **Koneksi Database**: PostgreSQL di-host oleh Supabase, untuk penyimpanan data profil pengguna.

#### **Layanan Pengujian**:
- **Postman** atau **JMeter**: Untuk menguji performa endpoint `GET` dan `PUT` dari User Profile Service.
- **SonarQube**: Untuk menganalisis kualitas kode dari API dan maintainability.

---

### 3. **Encryption Service**

#### **Fungsi**:
- Mengenkripsi dan mendekripsi file yang diunggah oleh pengguna.

#### **Layanan Utama**:
- **API Encrypt** (`POST /encrypt`): Mengunggah file untuk dienkripsi menggunakan AES, DES, atau RC4.
- **API Decrypt** (`POST /decrypt`): Mengunggah file terenkripsi untuk didekripsi.

#### **Skema Database** (MongoDB atau Firebase):
- **MongoDB**: Untuk menyimpan metadata file yang telah dienkripsi.
```json
{
  "file_id": "UUID",
  "user_id": "UUID",
  "encryption_type": "AES",
  "original_filename": "file.txt",
  "encrypted_filename": "file_encrypted.aes",
  "created_at": "timestamp",
  "file_size": 1024
}
```
- **Penyimpanan File**: File terenkripsi dapat disimpan di **Supabase Storage** atau penyimpanan eksternal seperti **AWS S3** atau **Google Cloud Storage**.

#### **Layanan Pengujian**:
- **Gatling** atau **JMeter**: Untuk menguji throughput enkripsi dan dekripsi file.
- **Chaos Monkey**: Untuk mensimulasikan kegagalan layanan dan menguji fault tolerance serta recovery time.

---

### 4. **File Management Service**

#### **Fungsi**:
- Mengelola unggahan dan pengunduhan file yang terenkripsi atau tidak terenkripsi.

#### **Layanan Utama**:
- **API Upload File** (`POST /upload`): Mengunggah file ke penyimpanan.
- **API Download File** (`GET /download/{file_id}`): Mengunduh file yang sudah diunggah sebelumnya.
- **API Delete File** (`DELETE /file/{file_id}`): Menghapus file berdasarkan ID.

#### **Skema Database** (PostgreSQL via **Supabase**):
```sql
CREATE TABLE files (
  file_id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  file_name VARCHAR(255),
  file_size INTEGER,
  file_type VARCHAR(50),
  file_url TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT now()
);
```
- **Penyimpanan File**: File bisa disimpan di **Supabase Storage**, **AWS S3**, atau **Google Cloud Storage** untuk skalabilitas tinggi.

#### **Layanan Pengujian**:
- **Locust**: Untuk menguji throughput unggahan dan pengunduhan file, serta seberapa baik layanan dapat menangani permintaan bersamaan.
- **Grafana + Prometheus**: Untuk memantau throughput dan waktu respons dari microservice ini.

---

### 5. **API Gateway**

#### **Fungsi**:
- Meneruskan permintaan klien ke microservice yang relevan dan mengelola autentikasi serta routing.

#### **Layanan Utama**:
- **Routing**: Rute API ke layanan yang sesuai (misalnya, permintaan `/auth/login` diteruskan ke Authentication Service).
- **Load Balancing**: Membagi beban permintaan antara replika layanan yang berbeda.
- **Autentikasi**: Validasi token JWT yang dihasilkan oleh Authentication Service.

#### **Layanan Pengujian**:
- **Postman**: Untuk menguji bagaimana permintaan dirutekan oleh API Gateway.
- **Gremlin**: Untuk menguji ketersediaan dan fault tolerance dari API Gateway.

---

### 6. **Logging Service (Opsional)**

#### **Fungsi**:
- Merekam aktivitas yang terjadi di setiap microservice (request, error, dll.).

#### **Skema Database** (Elasticsearch atau Supabase PostgreSQL):
- **Elasticsearch**: Untuk menyimpan dan melakukan kueri terhadap log yang dihasilkan oleh berbagai layanan.
```json
{
  "log_id": "UUID",
  "service_name": "auth_service",
  "log_level": "ERROR",
  "message": "User not found",
  "timestamp": "timestamp"
}
```

#### **Layanan Pengujian**:
- **Kibana**: Untuk memvisualisasikan dan melakukan kueri log.
- **Grafana + Loki**: Alternatif untuk visualisasi log dan analisis performa.

---

### 7. **Monitoring Service (Opsional)**

#### **Fungsi**:
- Memantau performa dan kesehatan layanan, serta memberikan alert jika terjadi kegagalan.

#### **Layanan Utama**:
- **Prometheus**: Untuk mengumpulkan metrik dari setiap microservice.
- **Grafana**: Untuk memvisualisasikan metrik, termasuk response time, throughput, dan availability.

#### **Layanan Pengujian**:
- **Grafana**: Untuk memantau metrik secara real-time dan melihat skala layanan selama pengujian.
- **Prometheus**: Untuk memonitor status dan kesehatan dari layanan yang aktif.

---

### Rangkuman:

| Microservice             | Database               | Pengujian Utama                  | Tool Pengujian                    |
|--------------------------|------------------------|----------------------------------|-----------------------------------|
| Authentication Service    | PostgreSQL (Supabase)  | Waktu respons, keamanan          | Postman, OWASP ZAP                |
| User Profile Service      | PostgreSQL (Supabase)  | Waktu respons, maintainability   | Postman, SonarQube                |
| Encryption Service        | MongoDB/Firebase       | Throughput, fault tolerance      | Gatling, Chaos Monkey             |
| File Management Service   | PostgreSQL (Supabase)  | Throughput, availability         | Locust, Grafana + Prometheus      |
| API Gateway               | N/A                    | Routing, load balancing          | Postman, Gremlin                  |
| Logging Service (Opsional)| Elasticsearch          | Log tracking                     | Kibana, Grafana + Loki            |
| Monitoring Service (Opsional) | Prometheus        | Monitoring performa              | Grafana, Prometheus               |
