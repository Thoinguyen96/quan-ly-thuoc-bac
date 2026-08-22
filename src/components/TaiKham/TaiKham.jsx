import "./TaiKham.css";

function TaiKham({ toaDangXem, setToaThuoc, setDanhSachViThuoc, setTrang }) {
    if (!toaDangXem) {
        return <p>Không có thông tin bệnh nhân.</p>;
    }

    return (
        <div>
            <div className="tai-kham-container">
                <div className="tai-kham-header">
                    <h1>🔄 TÁI KHÁM</h1>

                    <button onClick={() => setTrang("chitietbenhnhan")}>← Quay lại</button>
                </div>

                <div className="tai-kham-thong-tin">
                    <h2>THÔNG TIN BỆNH NHÂN</h2>

                    <p>
                        <strong>Họ và tên:</strong> {toaDangXem.ho_ten || "---"}
                    </p>

                    <p>
                        <strong>Năm sinh:</strong> {toaDangXem.nam_sinh || "---"}
                    </p>

                    <p>
                        <strong>Giới tính:</strong>{" "}
                        {toaDangXem.gioi_tinh === "nam" ? "Nam" : toaDangXem.gioi_tinh === "nu" ? "Nữ" : "---"}
                    </p>

                    <p>
                        <strong>Số điện thoại:</strong> {toaDangXem.so_dien_thoai || "---"}
                    </p>

                    <p>
                        <strong>Địa chỉ:</strong> {toaDangXem.dia_chi || "---"}
                    </p>
                </div>

                <div className="tai-kham-actions">
                    <button
                        onClick={() => {
                            setToaThuoc({
                                ho_ten: toaDangXem.ho_ten || "",
                                nam_sinh: toaDangXem.nam_sinh || "",
                                gioi_tinh: toaDangXem.gioi_tinh || "",
                                so_dien_thoai: toaDangXem.so_dien_thoai || "",
                                dia_chi: toaDangXem.dia_chi || "",
                                trieu_chung: "",
                                tien_su_benh: toaDangXem.tien_su_benh || "",
                                chan_doan: "",
                                chan_doan_yhct: "",
                                phap_dieu_tri: "",
                                cach_dung: "",
                                loi_dan: "",
                                so_thang: "",
                            });

                            setDanhSachViThuoc([]);
                            setTrang("toathuoc");
                        }}
                    >
                        📝 Tạo toa tái khám
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TaiKham;
