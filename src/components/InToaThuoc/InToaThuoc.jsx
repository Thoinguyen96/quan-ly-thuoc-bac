import "./InToaThuoc.css";

function InToaThuoc({ toaThuoc, danhSachViThuoc }) {
    return (
        <div className="phieu-in-toa">
            <div className="phieu-in-header">
                <h2>PHÒNG CHẨN TRỊ Y HỌC CỔ TRUYỀN</h2>
                <h2 className="ten-phong-kham">AN THỜI ĐƯỜNG</h2>

                <div className="dich-vu-phong-kham">Châm cứu – Xoa bóp – Bấm huyệt – Bốc thuốc</div>

                <div className="dia-chi-phong-kham">
                    Địa chỉ: ........................................................
                </div>

                <div className="sdt-phong-kham">SĐT: .............................................................</div>
            </div>
            <h2>📄 TOA THUỐC Y HỌC CỔ TRUYỀN</h2>

            <h3>THÔNG TIN BỆNH NHÂN</h3>

            <div className="thong-tin-benh-nhan">
                <p>
                    <strong>Họ và tên:</strong> {toaThuoc.ho_ten?.toUpperCase()}
                </p>

                <p>
                    <strong>Ngày sinh:</strong> {toaThuoc.nam_sinh || toaThuoc.ngay_sinh || "---"}
                </p>

                <p>
                    <strong>Giới tính:</strong> {toaThuoc.gioi_tinh}
                </p>

                <p>
                    <strong>Số điện thoại:</strong> {toaThuoc.so_dien_thoai}
                </p>

                <p>
                    <strong>Địa chỉ:</strong> {toaThuoc.dia_chi}
                </p>
            </div>

            <h3>THÔNG TIN KHÁM BỆNH</h3>

            <div className="thong-tin-kham">
                <p>
                    <strong>Triệu chứng / Lý do khám:</strong>
                </p>
                <p>{toaThuoc.trieu_chung}</p>

                <p>
                    <strong>Tiền sử bệnh:</strong>
                </p>
                <p>{toaThuoc.tien_su_benh}</p>

                <p>
                    <strong>Chẩn đoán:</strong>
                </p>
                <p>{toaThuoc.chan_doan}</p>

                <p>
                    <strong>Chẩn đoán YHCT / Thể bệnh:</strong>
                </p>
                <p>{toaThuoc.chan_doan_yhct}</p>

                <p>
                    <strong>Pháp điều trị:</strong>
                </p>
                <p>{toaThuoc.phap_dieu_tri}</p>
            </div>

            <h3>ĐƠN THUỐC</h3>

            <div className="bang-don-thuoc">
                <div className="hang-thuoc hang-tieu-de">
                    <span>STT</span>
                    <span>Tên vị thuốc</span>
                    <span>Số lượng</span>
                </div>

                {danhSachViThuoc?.map((thuoc, index) => (
                    <div className="hang-thuoc" key={index}>
                        <span>{index + 1}</span>
                        <span>{thuoc.ten}</span>
                        <span>{thuoc.soLuong}g</span>
                    </div>
                ))}
            </div>
            <h3>CÁCH DÙNG VÀ LỜI DẶN</h3>

            <div className="cach-dung-loi-dan">
                <p>
                    <strong>Cách sắc / Cách dùng:</strong> {toaThuoc.cach_dung}
                </p>

                <p>
                    <strong>Lời dặn:</strong> {toaThuoc.loi_dan}
                </p>
            </div>

            <div className="chu-ky">
                <p>
                    Quảng Ngãi, ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm{" "}
                    {new Date().getFullYear()}
                </p>

                <strong>Người kê toa</strong>

                <div className="khoang-ky"></div>

                <strong>NGUYỄN VĂN THỜI</strong>
            </div>

            <div className="ten-phong">AN THỜI ĐƯỜNG</div>
        </div>
    );
}

export default InToaThuoc;
