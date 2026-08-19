import { useState } from "react";
import { supabase } from "../../supabase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./TaoNhanVien.css";
function TaoNhanVien() {
    const [tenDangNhap, setTenDangNhap] = useState("");
    const [matKhau, setMatKhau] = useState("");
    const [hoTen, setHoTen] = useState("");
    const [quyenKhoThuoc, setQuyenKhoThuoc] = useState(false);
    const [quyenBanThuoc, setQuyenBanThuoc] = useState(true);
    const [quyenXemBenhNhan, setQuyenXemBenhNhan] = useState(true);
    const [quyenThemThuoc, setQuyenThemThuoc] = useState(false);
    const [quyenSuaThuoc, setQuyenSuaThuoc] = useState(false);
    const [quyenXoaThuoc, setQuyenXoaThuoc] = useState(false);
    const [quyenSuaGia, setQuyenSuaGia] = useState(false);
    const [dangTao, setDangTao] = useState(false);

    const taoNhanVien = async () => {
        if (!tenDangNhap.trim() || !matKhau || !hoTen.trim()) {
            toast.warning("Vui lòng nhập đầy đủ tên đăng nhập, mật khẩu và họ tên!");
            return;
        }

        if (matKhau.length < 6) {
            toast.error("Mật khẩu phải có ít nhất 6 ký tự!");
            return;
        }

        setDangTao(true);
        console.log("QUYỀN GỬI LÊN:", {
            quyen_kho_thuoc: quyenKhoThuoc,
            quyen_ban_thuoc: quyenBanThuoc,
            quyen_xem_benh_nhan: quyenXemBenhNhan,
            quyen_them_thuoc: quyenThemThuoc,
            quyen_sua_thuoc: quyenSuaThuoc,
            quyen_xoa_thuoc: quyenXoaThuoc,
            quyen_sua_gia: quyenSuaGia,
        });
        try {
            const { data, error } = await supabase.functions.invoke("tao-nhan-vien", {
                body: {
                    ten_dang_nhap: tenDangNhap.trim().toLowerCase(),
                    mat_khau: matKhau,
                    ho_ten: hoTen.trim(),

                    quyen_kho_thuoc: quyenKhoThuoc,
                    quyen_ban_thuoc: quyenBanThuoc,
                    quyen_xem_benh_nhan: quyenXemBenhNhan,
                    quyen_them_thuoc: quyenThemThuoc,
                    quyen_sua_thuoc: quyenSuaThuoc,
                    quyen_xoa_thuoc: quyenXoaThuoc,
                    quyen_sua_gia: quyenSuaGia,
                },
            });

            if (error) {
                console.error("Lỗi Edge Function:", error);
                toast.error("Không thể tạo nhân viên!");
                return;
            }

            if (data?.error) {
                toast.error(data.error);
                return;
            }

            toast.success("Tạo tài khoản nhân viên thành công!");

            setTenDangNhap("");
            setMatKhau("");
            setHoTen("");
            setQuyenKhoThuoc(false);
            setQuyenBanThuoc(true);
            setQuyenXemBenhNhan(true);
            setQuyenThemThuoc(false);
            setQuyenSuaThuoc(false);
            setQuyenXoaThuoc(false);
            setQuyenSuaGia(false);
        } catch (error) {
            console.error(error);
            toast.error("Có lỗi xảy ra khi tạo tài khoản!");
        } finally {
            setDangTao(false);
        }
    };

    return (
        <div className="tao-nhan-vien">
            <h2>Tạo tài khoản nhân viên</h2>

            <input
                type="text"
                placeholder="Tên đăng nhập"
                value={tenDangNhap}
                onChange={(e) => setTenDangNhap(e.target.value)}
            />

            <input
                type="text"
                placeholder="Họ tên nhân viên"
                value={hoTen}
                onChange={(e) => setHoTen(e.target.value)}
            />

            <input
                type="password"
                placeholder="Mật khẩu"
                value={matKhau}
                onChange={(e) => setMatKhau(e.target.value)}
            />

            <h3>Quyền nhân viên</h3>

            <div className="quyen-nhan-vien">
                <label>
                    <input
                        type="checkbox"
                        checked={quyenKhoThuoc}
                        onChange={(e) => setQuyenKhoThuoc(e.target.checked)}
                    />
                    Cho phép vào kho thuốc
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={quyenBanThuoc}
                        onChange={(e) => setQuyenBanThuoc(e.target.checked)}
                    />
                    Bán thuốc
                </label>

                <label>
                    <input
                        type="checkbox"
                        checked={quyenXemBenhNhan}
                        onChange={(e) => setQuyenXemBenhNhan(e.target.checked)}
                    />
                    Xem bệnh nhân
                </label>

                <label>
                    <input
                        type="checkbox"
                        checked={quyenThemThuoc}
                        onChange={(e) => setQuyenThemThuoc(e.target.checked)}
                    />
                    Thêm thuốc
                </label>

                <label>
                    <input
                        type="checkbox"
                        checked={quyenSuaThuoc}
                        onChange={(e) => setQuyenSuaThuoc(e.target.checked)}
                    />
                    Sửa thuốc
                </label>

                <label>
                    <input
                        type="checkbox"
                        checked={quyenXoaThuoc}
                        onChange={(e) => setQuyenXoaThuoc(e.target.checked)}
                    />
                    Xóa thuốc
                </label>

                <label>
                    <input type="checkbox" checked={quyenSuaGia} onChange={(e) => setQuyenSuaGia(e.target.checked)} />
                    Sửa giá thuốc
                </label>
            </div>

            <button className="nut-tao-nhan-vien" onClick={taoNhanVien} disabled={dangTao}>
                {dangTao ? "Đang tạo..." : "Tạo tài khoản"}
            </button>
        </div>
    );
}

export default TaoNhanVien;
