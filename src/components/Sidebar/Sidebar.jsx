import "./Sidebar.css";
import LogoAnThoiDuong from "../LogoAnThoiDuong/LogoAnThoiDuong";

function Sidebar({ trang, setTrang, user, taiLichSuBenhNhan, taiThongKe, taiDuLieuBieuDo, setKieuThongKe, setUser }) {
    const laAdmin = user?.vai_tro === "admin";

    const vaoTrang = (tenTrang) => {
        setTrang(tenTrang);
    };

    return (
        <aside className="sidebar">
            {/* Tiêu đề */}
            <div className="sidebar-title">
                <div className="sidebar-title-icon">
                    <LogoAnThoiDuong />
                </div>
                <div>
                    <div className="sidebar-title-main">QUẢN LÝ THUỐC BẮC</div>
                    <div className="sidebar-title-sub">AN THỜI ĐƯỜNG</div>
                </div>
            </div>

            <div className="sidebar-menu">
                {/* Bán hàng */}
                {(laAdmin || user?.quyen_ban_thuoc) && (
                    <button
                        className={trang === "banhang" ? "sidebar-item active" : "sidebar-item"}
                        onClick={() => vaoTrang("banhang")}
                    >
                        <span>💰</span>
                        <span>Bán hàng</span>
                    </button>
                )}

                {/* Kho thuốc */}
                {(laAdmin || user?.quyen_kho_thuoc) && (
                    <button
                        className={trang === "khothuoc" ? "sidebar-item active" : "sidebar-item"}
                        onClick={() => vaoTrang("khothuoc")}
                    >
                        <span>📦</span>
                        <span>Kho thuốc</span>
                    </button>
                )}

                {/* Bệnh nhân */}
                {(laAdmin || user?.quyen_xem_benh_nhan) && (
                    <button
                        className={trang === "benhnhan" ? "sidebar-item active" : "sidebar-item"}
                        onClick={async () => {
                            vaoTrang("benhnhan");

                            if (taiLichSuBenhNhan) {
                                await taiLichSuBenhNhan();
                            }
                        }}
                    >
                        <span>👨‍⚕️</span>
                        <span>Bệnh nhân</span>
                    </button>
                )}

                {/* Toa thuốc */}
                {laAdmin && (
                    <button
                        className={trang === "toathuoc" ? "sidebar-item active" : "sidebar-item"}
                        onClick={() => vaoTrang("toathuoc")}
                    >
                        <span>📄</span>
                        <span>Toa thuốc</span>
                    </button>
                )}

                {/* Thống kê */}
                {laAdmin && (
                    <button
                        className={trang === "thongke" ? "sidebar-item active" : "sidebar-item"}
                        onClick={async () => {
                            if (taiThongKe) {
                                await taiThongKe();
                            }

                            if (taiDuLieuBieuDo) {
                                await taiDuLieuBieuDo("tuan");
                            }

                            if (setKieuThongKe) {
                                setKieuThongKe("tuan");
                            }

                            vaoTrang("thongke");
                        }}
                    >
                        <span>📊</span>
                        <span>Thống kê</span>
                    </button>
                )}

                {/* Quản lý nhân viên */}
                {laAdmin && (
                    <button
                        className={trang === "quanlynhanvien" ? "sidebar-item active" : "sidebar-item"}
                        onClick={() => vaoTrang("quanlynhanvien")}
                    >
                        <span>👥</span>
                        <span>Quản lý nhân viên</span>
                    </button>
                )}
            </div>

            {/* Thông tin tài khoản */}
            <div className="sidebar-user">
                <div className="sidebar-user-icon">👤</div>

                <div className="sidebar-user-info">
                    <div className="sidebar-user-role">{laAdmin ? "Chủ phòng" : "Nhân viên"}</div>
                    <div className="sidebar-user-name">{user?.ten_dang_nhap || "Tài khoản"}</div>
                </div>
            </div>

            {/* Đăng xuất */}
            <button
                className="sidebar-logout"
                onClick={() => {
                    if (setUser) {
                        setUser(null);
                    }
                }}
            >
                🚪 Đăng xuất
            </button>
        </aside>
    );
}

export default Sidebar;
