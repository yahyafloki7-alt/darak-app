"use client";

import { useState } from "react";

const STYLES = [
  { id: "traditional", name: "مغربي تقليدي" },
  { id: "modern", name: "عصري بسيط" },
  { id: "mediterranean", name: "متوسطي دافئ" },
  { id: "industrial", name: "صناعي (Loft)" },
];

export default function Home() {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [detection, setDetection] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState("traditional");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleFileSelected(selectedFile) {
    setFile(selectedFile);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("plan", selectedFile);
      const res = await fetch("/api/process-plan", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setDetection(data);
      setStep(2);
    } catch (err) {
      console.error("خطأ فتحليل المخطط:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerate() {
    setLoading(true);
    try {
      const res = await fetch("/api/generate-render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ detection, style: selectedStyle }),
      });
      const data = await res.json();
      setResult(data);
      setStep(4);
    } catch (err) {
      console.error("خطأ فتوليد التصور:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <header className="app-header">
        <div className="top-row">
          <div className="logo">
            <span className="dot"></span> دارك
          </div>
          <div className="progress-dots">
            {[1, 2, 3, 4].map((s) => (
              <span key={s} className={s <= step ? "active" : ""}></span>
            ))}
          </div>
        </div>
      </header>

      <div className="screen">
        {step === 1 && (
          <>
            <div className="capture-zone">
              <div className="capture-icon">📷</div>
              <h3>حمّل أو صوّر مخطط بيتك</h3>
              <p style={{ fontSize: "0.82rem", color: "#8a8580" }}>
                PDF، صورة، أو رسم يدوي مصوّر
              </p>
            </div>

            <label className="btn-full btn-camera" style={{ display: "block", textAlign: "center" }}>
              📷 فتح الكاميرا
              <input
                type="file"
                accept="image/*"
                capture="environment"
                hidden
                onChange={(e) => e.target.files[0] && handleFileSelected(e.target.files[0])}
              />
            </label>

            <label className="btn-full btn-file" style={{ display: "block", textAlign: "center" }}>
              📁 اختيار ملف (PDF/صورة)
              <input
                type="file"
                accept="application/pdf,image/*"
                hidden
                onChange={(e) => e.target.files[0] && handleFileSelected(e.target.files[0])}
              />
            </label>

            {loading && <p style={{ textAlign: "center", marginTop: 16 }}>⏳ جاري تحليل المخطط...</p>}
          </>
        )}

        {step === 2 && detection && (
          <>
            <div className="summary-card">
              <h4 style={{ marginBottom: 10, color: "var(--cuivre)", fontWeight: 700 }}>
                📐 عناصر مكتشفة
              </h4>
              <div className="detected-row">
                <span>المساحة</span>
                <span>{detection.area} م²</span>
              </div>
              <div className="detected-row">
                <span>عدد الغرف</span>
                <span>{detection.rooms?.length}</span>
              </div>
              <div className="detected-row">
                <span>دقة الكشف</span>
                <span>{detection.confidence}</span>
              </div>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h3 style={{ marginBottom: 14 }}>اختر طابع بيتك</h3>
            <div className="style-scroll">
              {STYLES.map((s) => (
                <div
                  key={s.id}
                  className={`style-card ${selectedStyle === s.id ? "selected" : ""}`}
                  onClick={() => setSelectedStyle(s.id)}
                >
                  <div className="style-media" style={{ background: "#ccc" }}></div>
                  <div className="style-name">{s.name}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {step === 4 && result && (
          <>
            <model-viewer
              src={result.modelUrl}
              ar
              camera-controls
              auto-rotate
              alt="تصور 3D لبيتك"
            ></model-viewer>

            <a href={result.pdfUrl} className="btn-full btn-file" style={{ display: "block", textAlign: "center" }}>
              📄 تحميل المخطط التقني (PDF)
            </a>

            <div className="warn">
              ⚠️ المخطط التقني معد للتخطيط الأولي فقط. لأي بناء فعلي، راجع مهندس معماري مرخّص.
            </div>
          </>
        )}
      </div>

      <div className="bottom-bar">
        <button className="btn btn-back" disabled={step === 1} onClick={() => setStep(step - 1)}>
          رجوع
        </button>
        {step < 3 && (
          <button className="btn btn-next" disabled={step === 1 && !detection} onClick={() => setStep(step + 1)}>
            التالي ←
          </button>
        )}
        {step === 3 && (
          <button className="btn btn-next" onClick={handleGenerate} disabled={loading}>
            {loading ? "⏳ جاري التوليد..." : "توليد التصور"}
          </button>
        )}
      </div>
    </>
  );
}
