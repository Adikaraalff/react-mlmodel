import { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const response = await axios.post(
        "https://web-production-822e0.up.railway.app/predict",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setPrediction(response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <div
        className="shadow-lg rounded overflow-hidden"
        style={{
          backgroundColor: "white",
          maxWidth: "800px",
          width: "100%",
          display: "flex",
          flexDirection: "row",
          height: "500px",
        }}
      >
        {/* Bagian Kiri: Gambar Pratinjau */}
        <div
          className="d-flex justify-content-center align-items-center"
          style={{
            backgroundColor: "#e9ecef",
            flex: "1",
            padding: "20px",
          }}
        >
          {file ? (
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              className="img-fluid rounded"
              style={{
                maxWidth: "100%",
                maxHeight: "90%",
                objectFit: "contain",
              }}
            />
          ) : (
            <p className="text-secondary text-center">
              Pratinjau gambar akan muncul di sini
            </p>
          )}
        </div>

        {/* Bagian Kanan: Form */}
        <div className="p-4" style={{ flex: "1.2" }}>
          <h2 className="text-center text-primary mb-4">
            Upload dan Dapatkan Prediksi
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Input File */}
            <div className="mb-4">
              <label htmlFor="file" className="form-label">
                Pilih Gambar (JPG, PNG, JPEG)
              </label>
              <input
                type="file"
                className="form-control"
                id="file"
                onChange={handleFileChange}
                accept="image/*"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading || !file}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  Mengunggah...
                </>
              ) : (
                "Unggah"
              )}
            </button>
          </form>

          {/* Loading Spinner */}
          {loading && (
            <div className="text-center mt-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p>Memproses gambar, harap tunggu...</p>
            </div>
          )}

          {/* Hasil Prediksi */}
          {prediction && !loading && (
            <div className="alert alert-success mt-4">
              <h4 className="alert-heading">Hasil Prediksi</h4>
              <p>
                <strong>Prediksi:</strong> {prediction.prediction}
              </p>
              <p>
                <strong>Kepercayaan:</strong>{" "}
                {Math.round(prediction.confidence * 100)}%
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
