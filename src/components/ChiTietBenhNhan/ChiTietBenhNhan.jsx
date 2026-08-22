function ChiTietBenhNhan({ toaDangXem, setTrang, setToaThuoc, setDanhSachViThuoc }) {
    if (!toaDangXem) {
        return null;
    }

    return (
        <div className="chi-tiet-benh-nhan">
            <div className="chi-tiet-header">
                <h1 className="tieu-de-xem">📋 CHI TIẾT LẦN KHÁM</h1>

                <h1 className="tieu-de-in">TOA THUỐC Y HỌC CỔ TRUYỀN</h1>

                <button className="nut-quay-lai-lich-su" onClick={() => setTrang("benhnhan")}>
                    ← Quay lại
                </button>
            </div>

            <div className="chi-tiet-khoi">
                <h2>THÔNG TIN BỆNH NHÂN</h2>

                <div className="thong-tin-benh-nhan-grid">
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

                    <p>
                        <strong>Ngày khám:</strong>{" "}
                        {new Date(toaDangXem.created_at).toLocaleString("vi-VN", {
                            timeZone: "Asia/Ho_Chi_Minh",
                        })}
                    </p>
                </div>
            </div>

            <div className="chi-tiet-khoi">
                <h2>THÔNG TIN KHÁM BỆNH</h2>

                <p>
                    <strong>Triệu chứng / Lý do khám:</strong>
                    <br />
                    {toaDangXem.trieu_chung || "---"}
                </p>

                <p>
                    <strong>Tiền sử bệnh:</strong>
                    <br />
                    {toaDangXem.tien_su_benh || "---"}
                </p>

                <p>
                    <strong>Chẩn đoán:</strong>
                    <br />
                    {toaDangXem.chan_doan || "---"}
                </p>

                <p>
                    <strong>Chẩn đoán YHCT / Thể bệnh:</strong>
                    <br />
                    {toaDangXem.chan_doan_yhct || "---"}
                </p>

                <p>
                    <strong>Pháp điều trị:</strong>
                    <br />
                    {toaDangXem.phap_dieu_tri || "---"}
                </p>
            </div>

            <div className="chi-tiet-khoi">
                <h2>ĐƠN THUỐC</h2>

                {!toaDangXem.danh_sach_thuoc || toaDangXem.danh_sach_thuoc.length === 0 ? (
                    <p>Không có vị thuốc.</p>
                ) : (
                    toaDangXem.danh_sach_thuoc.map((thuoc, index) => (
                        <div className="chi-tiet-vi-thuoc" key={index}>
                            <span>
                                {index + 1}. {thuoc.ten}
                            </span>

                            <strong>{thuoc.soLuong}g</strong>
                        </div>
                    ))
                )}

                <p className="chi-tiet-so-thang">
                    <strong>Số thang:</strong> {toaDangXem.so_thang || "---"}
                </p>
            </div>

            <div className="chi-tiet-khoi">
                <h2>CÁCH DÙNG VÀ LỜI DẶN</h2>

                <p>
                    <strong>Cách sắc / Cách dùng:</strong>
                    <br />
                    {toaDangXem.cach_dung || "---"}
                </p>

                <p>
                    <strong>Lời dặn:</strong>
                    <br />
                    {toaDangXem.loi_dan || "---"}
                </p>
            </div>

            <div className="chu-ky-toa">
                <p>
                    Quảng Ngãi, ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm{" "}
                    {new Date().getFullYear()}
                </p>

                <strong>Người kê toa</strong>

                <p className="ghi-chu-ky">(Ký và ghi rõ họ tên)</p>

                <div className="khoang-ky"></div>

                <strong>AN THỜI ĐƯỜNG</strong>
            </div>

            <div className="chi-tiet-nut">
                <button onClick={() => window.print()}>🖨️ In toa thuốc</button>

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
                    🔄 Tái khám
                </button>

                <button onClick={() => setTrang("benhnhan")}>← Quay lại bệnh nhân</button>
            </div>
        </div>
    );
}

export default ChiTietBenhNhan;
