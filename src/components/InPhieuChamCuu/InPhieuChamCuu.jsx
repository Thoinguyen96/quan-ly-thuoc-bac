import "./InPhieuChamCuu.css";
import { useState } from "react";
import { createPortal } from "react-dom";
function InPhieuChamCuu() {
    const [khoGiay, setKhoGiay] = useState("50x80");
    const [soLuong, setSoLuong] = useState(1);
    const [loaiPhieu, setLoaiPhieu] = useState("cham-cuu");
    const [soThuTu, setSoThuTu] = useState(() => {
        const ngayHomNay = new Date().toLocaleDateString("vi-VN");

        const duLieu = localStorage.getItem("so_phieu_cham_cuu");

        if (!duLieu) {
            return 1;
        }

        try {
            const data = JSON.parse(duLieu);

            if (data.ngay !== ngayHomNay) {
                return 1;
            }

            return Number(data.soThuTu) || 1;
        } catch {
            return 1;
        }
    });
    const inPhieu = () => {
        const soLuongIn = Number(soLuong) || 1;

        const ngayHomNay = new Date().toLocaleDateString("vi-VN");

        const soBatDau = soThuTu;
        const soKetThuc = soBatDau + soLuongIn - 1;

        // Lưu số tiếp theo cho lần in sau
        localStorage.setItem(
            "so_phieu_cham_cuu",
            JSON.stringify({
                ngay: ngayHomNay,
                soThuTu: soKetThuc + 1,
            }),
        );

        // Cập nhật số trên giao diện
        setSoThuTu(soKetThuc + 1);

        // Tạo các phiếu cần in
        const khuVucIn = document.getElementById("khu-vuc-in");

        khuVucIn.innerHTML = "";

        for (let i = 0; i < soLuongIn; i++) {
            const soPhieu = soBatDau + i;

            const phieu = document.createElement("div");
            phieu.className = "phieu-in";

            phieu.innerHTML = `
            <div class="mini-header">
                <strong>AN THỜI ĐƯỜNG</strong>
                <span>PHÒNG CHẨN TRỊ Y HỌC CỔ TRUYỀN</span>
                <span>Khám bệnh – Châm cứu – Bốc thuốc</span>
            </div>

            <div class="mini-duong-ke"></div>

            <div class="mini-tieu-de">
                PHIẾU CHÂM CỨU
            </div>

            <div class="mini-so-label">
                SỐ
            </div>

            <div class="mini-so">
                ${soPhieu}
            </div>

            <div class="mini-thoi-gian">
                <div>Ngày in: ${ngayHomNay}</div>
                <div>Giờ in: ${new Date().toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                })}</div>
            </div>

            <div class="mini-hieu-luc">
                CHỈ CÓ HIỆU LỰC TRONG NGÀY
                <br />
                ${ngayHomNay}
            </div>
        `;

            khuVucIn.appendChild(phieu);
        }

        setTimeout(() => {
            window.print();
        }, 100);
    };

    return (
        <div className="phieu-cham-cuu">
            {/* PHẦN ĐẦU */}
            <div className="phieu-cham-cuu-header">
                <h2>AN THỜI ĐƯỜNG</h2>

                <p>PHÒNG CHẨN TRỊ Y HỌC CỔ TRUYỀN</p>

                <p>Khám bệnh – Châm cứu – Bốc thuốc</p>
            </div>
            <div className="duong-ke"></div>
            <h1 className="tieu-de-phieu">PHIẾU CHÂM CỨU</h1>
            {/* 1. KHỔ GIẤY */}
            <div className="cai-dat-in">
                <div className="cai-dat-tieu-de">
                    <span className="so-muc">1</span>
                    <strong>Khổ giấy in</strong>
                </div>

                <select value={khoGiay} onChange={(e) => setKhoGiay(e.target.value)}>
                    <option value="50x80">50 × 80 mm</option>
                    <option value="60x90">60 × 90 mm</option>
                    <option value="70x100">70 × 100 mm</option>
                    <option value="A6">A6</option>
                    <option value="custom">Tùy chỉnh</option>
                </select>
            </div>
            {/* 2. SỐ LƯỢNG */}
            <div className="cai-dat-in">
                <div className="cai-dat-tieu-de">
                    <span className="so-muc">2</span>
                    <strong>Số lượng phiếu in</strong>
                </div>

                <div className="so-luong-in">
                    <input
                        type="number"
                        min="1"
                        value={soLuong}
                        onChange={(e) => setSoLuong(Math.max(1, Number(e.target.value) || 1))}
                    />
                    <span>phiếu</span>
                </div>
            </div>
            {/* 3. LOẠI PHIẾU */}
            <div className="cai-dat-in">
                <div className="cai-dat-tieu-de">
                    <span className="so-muc">3</span>
                    <strong>Loại phiếu in</strong>
                </div>

                <select value={loaiPhieu} onChange={(e) => setLoaiPhieu(e.target.value)}>
                    <option value="cham-cuu">Phiếu châm cứu</option>
                    <option value="boc-thuoc">Phiếu bốc thuốc</option>
                    <option value="kham-benh">Phiếu khám bệnh</option>
                </select>
            </div>
            {/* XEM TRƯỚC */}
            <div className="xem-truoc-phieu">
                <div className="xem-truoc-header">
                    <span>XEM TRƯỚC PHIẾU</span>
                </div>

                <div className="phieu-mini">
                    <div className="mini-header">
                        <strong>AN THỜI ĐƯỜNG</strong>
                        <span>PHÒNG CHẨN TRỊ Y HỌC CỔ TRUYỀN</span>
                        <span>Khám bệnh – Châm cứu – Bốc thuốc</span>
                    </div>

                    <div className="mini-duong-ke"></div>

                    <div className="mini-tieu-de">PHIẾU CHÂM CỨU</div>

                    <div className="mini-so-label">SỐ</div>

                    <div className="mini-so">{soThuTu}</div>
                    <div className="mini-thoi-gian">
                        <div>Ngày in: 29/08/2026</div>
                        <div>Giờ in: 14:35</div>
                    </div>

                    <div className="mini-hieu-luc">
                        CHỈ CÓ HIỆU LỰC TRONG NGÀY
                        <br />
                        29/08/2026
                    </div>
                </div>
            </div>
            {createPortal(<div id="khu-vuc-in"></div>, document.body)} {/* NÚT */}
            <div className="nut-in-phieu">
                <button className="btn-in-phieu" onClick={inPhieu}>
                    🖨️ In phiếu
                </button>{" "}
            </div>
        </div>
    );
}

export default InPhieuChamCuu;
