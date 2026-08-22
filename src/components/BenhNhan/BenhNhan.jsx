import "./BenhNhan.css";
function BenhNhan({ user, setTrang, lichSuBenhNhan, tuKhoaBenhNhan, setTuKhoaBenhNhan, setToaDangXem, coQuyen }) {
    console.log("BENH NHAN COMPONENT ĐÃ CHẠY");

    const danhSachLoc = (lichSuBenhNhan || []).filter((benhNhan) => {
        const tuKhoa = (tuKhoaBenhNhan || "").toLowerCase().trim();

        return (
            (benhNhan.ho_ten || "").toLowerCase().includes(tuKhoa) || (benhNhan.so_dien_thoai || "").includes(tuKhoa)
        );
    });
    return (
        <div>
            <div className="lich-su-benh-nhan-container">
                <div className="lich-su-benh-nhan-header">
                    <h1>📋 BỆNH NHÂN</h1>
                </div>

                <input
                    className="tim-benh-nhan"
                    type="text"
                    placeholder="🔍 Tìm theo tên hoặc số điện thoại..."
                    value={tuKhoaBenhNhan}
                    onChange={(e) => setTuKhoaBenhNhan(e.target.value)}
                />

                {danhSachLoc.length === 0 ? (
                    <p>Chưa có bệnh nhân nào.</p>
                ) : (
                    <div className="danh-sach-benh-nhan">
                        {danhSachLoc.map((benhNhan) => (
                            <div className="benh-nhan-card" key={benhNhan.id}>
                                <div className="benh-nhan-card-top">
                                    <div>
                                        <h2>{benhNhan.ho_ten || "Chưa nhập họ tên"}</h2>

                                        <p>📞 {benhNhan.so_dien_thoai || "Chưa có SĐT"}</p>
                                    </div>

                                    <div className="ngay-kham">
                                        {new Date(benhNhan.created_at).toLocaleString("vi-VN", {
                                            timeZone: "Asia/Ho_Chi_Minh",
                                        })}
                                    </div>
                                </div>

                                <div className="benh-nhan-thong-tin">
                                    <p>
                                        <strong>Năm sinh:</strong> {benhNhan.nam_sinh || "---"}
                                    </p>

                                    <p>
                                        <strong>Giới tính:</strong>{" "}
                                        {benhNhan.gioi_tinh === "nam"
                                            ? "Nam"
                                            : benhNhan.gioi_tinh === "nu"
                                              ? "Nữ"
                                              : "---"}
                                    </p>

                                    <p>
                                        <strong>Chẩn đoán:</strong> {benhNhan.chan_doan || "---"}
                                    </p>

                                    <p>
                                        <strong>Chẩn đoán YHCT:</strong> {benhNhan.chan_doan_yhct || "---"}
                                    </p>

                                    <p>
                                        <strong>Số thang:</strong> {benhNhan.so_thang || 0}
                                    </p>
                                </div>

                                <button
                                    className="nut-xem-benh-nhan"
                                    onClick={() => {
                                        setToaDangXem(benhNhan);
                                        setTrang("chitietbenhnhan");
                                    }}
                                >
                                    Xem chi tiết →
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default BenhNhan;
