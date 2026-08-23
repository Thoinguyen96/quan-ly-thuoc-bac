import "./DanhSachNhanVien.css";

function DanhSachNhanVien({
    danhSachNhanVien,
    setTrang,
    setNhanVienCanSua,
    nhanVienCanSua,

    tenDangNhapSua,
    setTenDangNhapSua,
    hoTenSua,
    setHoTenSua,
    matKhauSua,
    setMatKhauSua,

    quyenKhoThuocSua,
    setQuyenKhoThuocSua,
    quyenBanThuocSua,
    setQuyenBanThuocSua,
    quyenXemBenhNhanSua,
    setQuyenXemBenhNhanSua,
    quyenThemThuocSua,
    setQuyenThemThuocSua,
    quyenSuaThuocSua,
    setQuyenSuaThuocSua,
    quyenXoaThuocSua,
    setQuyenXoaThuocSua,
    quyenSuaGiaSua,
    setQuyenSuaGiaSua,

    luuSuaNhanVien,

    nhanVienCanXoa,
    setNhanVienCanXoa,
    xoaNhanVien,
    PopupXacNhan,
}) {
    return (
        <div className="danh-sach-nhan-vien">
            <button onClick={() => setTrang("quanlynhanvien")}>← Quay lại</button>

            <h1>📋 Danh sách tài khoản nhân viên</h1>

            {danhSachNhanVien
                .filter((nv) => nv.vai_tro !== "admin")
                .map((nv) => (
                    <div className="dong-tai-khoan" key={nv.id}>
                        <div className="ten-tai-khoan">👤 {nv.ten_dang_nhap}</div>

                        <div className="nhom-nut-tai-khoan">
                            <button onClick={() => setNhanVienCanSua(nv)}>✏️ Sửa</button>

                            <button className="nut-xoa-tai-khoan" onClick={() => setNhanVienCanXoa(nv)}>
                                🗑️ Xóa
                            </button>
                        </div>
                    </div>
                ))}

            {/* POPUP SỬA */}
            {nhanVienCanSua && (
                <div className="popup-sua-nhan-vien">
                    <h2>✏️ Sửa tài khoản nhân viên</h2>

                    <input
                        className="input_chuan"
                        type="text"
                        placeholder="Tên đăng nhập"
                        value={tenDangNhapSua}
                        onChange={(e) => setTenDangNhapSua(e.target.value)}
                    />

                    <input
                        className="input_chuan"
                        type="text"
                        placeholder="Họ tên nhân viên"
                        value={hoTenSua}
                        onChange={(e) => setHoTenSua(e.target.value)}
                    />

                    <input
                        className="input_chuan"
                        type="password"
                        placeholder="Mật khẩu mới (để trống nếu không đổi)"
                        value={matKhauSua}
                        onChange={(e) => setMatKhauSua(e.target.value)}
                    />

                    <h3>Quyền nhân viên</h3>

                    <div className="quyen-nhan-vien">
                        <label>
                            <input
                                type="checkbox"
                                checked={quyenKhoThuocSua}
                                onChange={(e) => setQuyenKhoThuocSua(e.target.checked)}
                            />
                            Cho phép vào kho thuốc
                        </label>

                        <label>
                            <input
                                type="checkbox"
                                checked={quyenBanThuocSua}
                                onChange={(e) => setQuyenBanThuocSua(e.target.checked)}
                            />
                            Bán hàng
                        </label>

                        <label>
                            <input
                                type="checkbox"
                                checked={quyenXemBenhNhanSua}
                                onChange={(e) => setQuyenXemBenhNhanSua(e.target.checked)}
                            />
                            Xem bệnh nhân
                        </label>

                        <label>
                            <input
                                type="checkbox"
                                checked={quyenThemThuocSua}
                                onChange={(e) => setQuyenThemThuocSua(e.target.checked)}
                            />
                            Thêm thuốc
                        </label>

                        <label>
                            <input
                                type="checkbox"
                                checked={quyenSuaThuocSua}
                                onChange={(e) => setQuyenSuaThuocSua(e.target.checked)}
                            />
                            Sửa thuốc
                        </label>

                        <label>
                            <input
                                type="checkbox"
                                checked={quyenXoaThuocSua}
                                onChange={(e) => setQuyenXoaThuocSua(e.target.checked)}
                            />
                            Xóa thuốc
                        </label>

                        <label>
                            <input
                                type="checkbox"
                                checked={quyenSuaGiaSua}
                                onChange={(e) => setQuyenSuaGiaSua(e.target.checked)}
                            />
                            Sửa giá thuốc
                        </label>
                    </div>

                    <div className="nut-sua-nhan-vien">
                        <button onClick={() => setNhanVienCanSua(null)}>Hủy</button>

                        <button onClick={luuSuaNhanVien}>Lưu thay đổi</button>
                    </div>
                </div>
            )}

            <PopupXacNhan
                mo={!!nhanVienCanXoa}
                tieuDe="Xóa tài khoản nhân viên"
                noiDung={`Anh có chắc muốn xóa tài khoản "${nhanVienCanXoa?.ten_dang_nhap}" không?`}
                chuNutXacNhan="Xóa"
                onHuy={() => setNhanVienCanXoa(null)}
                onXacNhan={xoaNhanVien}
            />
        </div>
    );
}

export default DanhSachNhanVien;
