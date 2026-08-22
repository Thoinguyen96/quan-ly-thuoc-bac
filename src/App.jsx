import { useState, useEffect } from "react";
import "./App.css";
import { supabase } from "./supabase";
import logo from "./assets/Logo.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NutDangXuat from "./components/NutDangXuat";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import PopupXacNhan from "./components/PopupXacNhan/PopupXacNhan";
import TaoNhanVien from "./components/TaoNhanVien/TaoNhanVien.jsx";
import Sidebar from "./components/Sidebar/Sidebar";
import TrangChu from "./components/TrangChu/TrangChu";
import BanHang from "./components/BanHang/BanHang";
import KhoThuoc from "./components/KhoThuoc/KhoThuoc";
import BenhNhan from "./components/BenhNhan/BenhNhan.jsx";
import ChiTietBenhNhan from "./components/ChiTietBenhNhan/ChiTietBenhNhan";
import QuanLyNhanVien from "./components/QuanLyNhanVien/QuanLyNhanVien";
import ToaThuoc from "./components/ToaThuoc/ToaThuoc";
import TaiKham from "./components/TaiKham/TaiKham";
function Header() {
    return (
        <div className="header-thoi-an">
            <img src={logo} className="logo-thoi-an" />

            <div className="header-text">
                <p>PHÒNG CHẨN TRỊ Y HỌC CỔ TRUYỀN</p>
                <h1>AN THỜI ĐƯỜNG</h1>

                <p>Châm cứu – Xoa bóp – Bấm huyệt – Bốc thuốc</p>
            </div>
        </div>
    );
}

function App() {
    const [trang, setTrang] = useState("trangchu");
    const [tenDangNhap, setTenDangNhap] = useState("");
    const [matKhau, setMatKhau] = useState("");
    const [user, setUser] = useState(null);
    const [thuocChoXoa, setThuocChoXoa] = useState(null);
    const [tuKhoaKho, setTuKhoaKho] = useState("");
    const [danhSachThuoc, setDanhSachThuoc] = useState([]);
    const [danhSachNhanVien, setDanhSachNhanVien] = useState([]);

    // =========================
    // KIỂM TRA QUYỀN NHÂN VIÊN
    // =========================
    const xoaNhanVien = async () => {
        if (!nhanVienCanXoa) return;

        const { error } = await supabase.from("nhan_vien").delete().eq("id", nhanVienCanXoa.id);

        if (error) {
            console.error("Lỗi xóa nhân viên:", error);
            toast.error("Không thể xóa tài khoản nhân viên!");
            return;
        }

        toast.success("Đã xóa tài khoản nhân viên!");

        // Xóa ngay khỏi danh sách trên giao diện
        setDanhSachNhanVien((ds) => ds.filter((nv) => nv.id !== nhanVienCanXoa.id));

        setNhanVienCanXoa(null);
    };
    const laAdmin = user?.vai_tro === "admin";

    const coQuyen = (quyen) => {
        return laAdmin || user?.[quyen] === true;
    };

    const coQuyenKhoThuoc = laAdmin || user?.quyen_kho_thuoc === true;
    useEffect(() => {
        const layDanhSachThuoc = async () => {
            const { data, error } = await supabase.from("thuoc").select("*").order("id", { ascending: true });

            if (error) {
                console.error("Lỗi lấy danh sách thuốc:", error);
                return;
            }

            const danhSach = data.map((thuoc) => ({
                id: thuoc.id,
                ten: thuoc.ten,
                gia: thuoc.gia,
                tonKho: thuoc.ton_kho,
            }));

            setDanhSachThuoc(danhSach);
        };

        layDanhSachThuoc();
    }, []);

    const taiDanhSachNhanVien = async () => {
        const { data, error } = await supabase.from("nhan_vien").select("*").order("id", { ascending: true });

        if (error) {
            console.error("Lỗi lấy danh sách nhân viên:", error);
            toast.error("Không lấy được danh sách nhân viên");
            return;
        }

        setDanhSachNhanVien(data || []);
    };
    const [kieuThongKe, setKieuThongKe] = useState("tuan");
    const [duLieuBieuDo, setDuLieuBieuDo] = useState([]);
    const [thongKe, setThongKe] = useState({
        doanhThuHomNay: 0,
        doanhThuThangNay: 0,
        tongDoanhThu: 0,

        luotKhamHomNay: 0,
        luotKhamThangNay: 0,
        tongLuotKham: 0,

        tongLoaiThuoc: 0,
        thuocSapHet: 0,
    });
    const [thuocDangChon, setThuocDangChon] = useState(null);
    const [soLuong, setSoLuong] = useState("");
    const [soTienMua, setSoTienMua] = useState("");
    const [gioHang, setGioHang] = useState([]);
    const [soTien, setSoTien] = useState("");
    // Dữ liệu thêm thuốc mới vào kho
    const [tenThuocMoi, setTenThuocMoi] = useState("");
    const [giaThuocMoi, setGiaThuocMoi] = useState("");
    const [tonKhoMoi, setTonKhoMoi] = useState("");
    // Dữ liệu sửa thuốc
    const [thuocDangSua, setThuocDangSua] = useState(null);
    const [tenThuocSua, setTenThuocSua] = useState("");
    const [giaThuocSua, setGiaThuocSua] = useState("");
    const [tonKhoSua, setTonKhoSua] = useState("");
    // Dữ liệu ô tìm kiếm
    const [tuKhoa, setTuKhoa] = useState("");
    const [nhanVienCanXoa, setNhanVienCanXoa] = useState(null);
    const [nhanVienCanSua, setNhanVienCanSua] = useState(null);
    const [tenDangNhapSua, setTenDangNhapSua] = useState("");
    const [hoTenSua, setHoTenSua] = useState("");
    const [matKhauSua, setMatKhauSua] = useState("");
    const [quyenKhoThuocSua, setQuyenKhoThuocSua] = useState(false);
    const [quyenBanThuocSua, setQuyenBanThuocSua] = useState(false);
    const [quyenXemBenhNhanSua, setQuyenXemBenhNhanSua] = useState(false);
    const [quyenKhoThuoc, setQuyenKhoThuoc] = useState(false);
    const [quyenThemThuocSua, setQuyenThemThuocSua] = useState(false);
    const [quyenSuaThuocSua, setQuyenSuaThuocSua] = useState(false);
    const [quyenXoaThuocSua, setQuyenXoaThuocSua] = useState(false);
    const [quyenSuaGiaSua, setQuyenSuaGiaSua] = useState(false);
    const [lichSuBanHang, setLichSuBanHang] = useState([]);
    const [toaThuoc, setToaThuoc] = useState({
        ho_ten: "",
        nam_sinh: "",
        gioi_tinh: "",
        so_dien_thoai: "",
        dia_chi: "",
        trieu_chung: "",
        tien_su_benh: "",
        chan_doan: "",
        chan_doan_yhct: "",
        phap_dieu_tri: "",
        cach_dung: "",
        loi_dan: "",
        so_thang: "",
    });

    const [tenViThuoc, setTenViThuoc] = useState("");
    const [soLuongViThuoc, setSoLuongViThuoc] = useState("");
    const [danhSachViThuoc, setDanhSachViThuoc] = useState([]);
    const [lichSuBenhNhan, setLichSuBenhNhan] = useState([]);
    const [tuKhoaBenhNhan, setTuKhoaBenhNhan] = useState("");
    const [dangKhoiPhucMatKhau, setDangKhoiPhucMatKhau] = useState(false);
    const [matKhauMoi, setMatKhauMoi] = useState("");
    const [nhapLaiMatKhau, setNhapLaiMatKhau] = useState("");
    const [toaDangXem, setToaDangXem] = useState(null);
    // Hàm bỏ dấu tiếng Việt
    const boDau = (text) => {
        return text
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/Đ/g, "D")
            .toLowerCase();
    };
    useEffect(() => {
        if (!nhanVienCanSua) return;

        setTenDangNhapSua(nhanVienCanSua.ten_dang_nhap || "");
        setHoTenSua(nhanVienCanSua.ho_ten || "");
        setMatKhauSua("");
        setQuyenKhoThuocSua(!!nhanVienCanSua.quyen_kho_thuoc);
        setQuyenBanThuocSua(!!nhanVienCanSua.quyen_ban_thuoc);
        setQuyenXemBenhNhanSua(!!nhanVienCanSua.quyen_xem_benh_nhan);
        setQuyenThemThuocSua(!!nhanVienCanSua.quyen_them_thuoc);
        setQuyenSuaThuocSua(!!nhanVienCanSua.quyen_sua_thuoc);
        setQuyenXoaThuocSua(!!nhanVienCanSua.quyen_xoa_thuoc);
        setQuyenSuaGiaSua(!!nhanVienCanSua.quyen_sua_gia);
    }, [nhanVienCanSua]);
    const danhSachThuocTrongKho = danhSachThuoc.filter((thuoc) => boDau(thuoc.ten).includes(boDau(tuKhoaKho.trim())));
    // Đăng nhập tài khoản chủ
    const dangNhap = async () => {
        const username = tenDangNhap.trim().toLowerCase();

        if (!username) {
            toast.error("Vui lòng nhập tên đăng nhập!");
            return;
        }

        if (!matKhau) {
            toast.error("Vui lòng nhập mật khẩu!");
            return;
        }

        // Tài khoản chủ phòng
        const email = username === "thoi" ? "vanthoiqngcv@gmail.com" : `${username}@dongy.local`;

        // Đăng nhập Supabase Auth
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password: matKhau,
        });

        if (error) {
            console.error("Lỗi đăng nhập:", error);
            toast.error("Tên đăng nhập hoặc mật khẩu không đúng!");
            return;
        }

        console.log("UID đăng nhập:", data.user.id);

        // Lấy thông tin nhân viên theo UID
        const { data: nhanVien, error: nvError } = await supabase
            .from("nhan_vien")
            .select("*")
            .eq("id", data.user.id)
            .maybeSingle();

        console.log("Nhân viên:", nhanVien);
        console.log("Lỗi nhân viên:", nvError);

        if (nvError) {
            console.error("Lỗi lấy nhân viên:", nvError);
            toast.error("Không thể lấy thông tin tài khoản!");
            return;
        }

        if (!nhanVien) {
            console.error("Không có nhân viên với UID:", data.user.id);
            toast.error("Không tìm thấy thông tin tài khoản!");
            await supabase.auth.signOut();
            return;
        }

        // Kiểm tra tài khoản có đang hoạt động không
        if (!nhanVien.trang_thai) {
            toast.error("Tài khoản đã bị khóa!");
            await supabase.auth.signOut();
            return;
        }

        setUser(nhanVien);
        console.log("QUYỀN SAU ĐĂNG NHẬP:", {
            kho: nhanVien.quyen_kho_thuoc,
            ban: nhanVien.quyen_ban_thuoc,
            benhNhan: nhanVien.quyen_xem_benh_nhan,
            them: nhanVien.quyen_them_thuoc,
            sua: nhanVien.quyen_sua_thuoc,
            xoa: nhanVien.quyen_xoa_thuoc,
            suaGia: nhanVien.quyen_sua_gia,
        });
        toast.success("Đăng nhập thành công!");
    };
    const guiEmailDoiMatKhau = async () => {
        const { error } = await supabase.auth.resetPasswordForEmail("vanthoiqngcv@gmail.com", {
            redirectTo: window.location.origin,
        });

        if (error) {
            toast.error("Không thể gửi email đổi mật khẩu!");
            return;
        }

        toast.success("Đã gửi email đổi mật khẩu. Anh kiểm tra Gmail nhé!");
    };
    const doiMatKhauMoi = async () => {
        if (!matKhauMoi) {
            toast.warning("Vui lòng nhập mật khẩu mới!");
            return;
        }

        if (matKhauMoi !== nhapLaiMatKhau) {
            toast.warning("Hai mật khẩu không giống nhau!");
            return;
        }

        const { error } = await supabase.auth.updateUser({
            password: matKhauMoi,
        });

        if (error) {
            toast.error("Không thể đổi mật khẩu: " + error.message);
            return;
        }

        toast.success("Đổi mật khẩu thành công!");

        setMatKhauMoi("");
        setNhapLaiMatKhau("");
        setDangKhoiPhucMatKhau(false);

        // Đăng xuất để đăng nhập lại bằng mật khẩu mới
        await supabase.auth.signOut();
        setUser(null);
    };
    // Lọc thuốc theo từ khóa
    const thuocGoiY = danhSachThuoc.filter((thuoc) => boDau(thuoc.ten).includes(boDau(tuKhoa)));
    useEffect(() => {
        // Kiểm tra ngay URL khi mở app từ email reset mật khẩu
        const url = window.location.href;

        if (url.includes("type=recovery") || url.includes("code=")) {
            setDangKhoiPhucMatKhau(true);
        }

        // Đồng thời nghe sự kiện từ Supabase
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event) => {
            console.log("AUTH EVENT:", event);

            if (event === "PASSWORD_RECOVERY") {
                setDangKhoiPhucMatKhau(true);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);
    // Chọn thuốc từ danh sách gợi ý
    const chonThuoc = (thuoc) => {
        setThuocDangChon(thuoc);
        setTuKhoa(thuoc.ten);
    };
    // reset
    const resetBanHang = () => {
        setTuKhoa("");
        setThuocDangChon(null);
        setSoLuong("");
        setSoTienMua("");
    };
    // Thêm thuốc vào đơn
    // Thêm thuốc vào đơn
    const themVaoDon = () => {
        if (!thuocDangChon) {
            toast.warning("Vui lòng chọn thuốc!");
            return;
        }

        const gram = Number(soLuong);

        if (!gram || gram <= 0) {
            toast.warning("Vui lòng nhập số lượng gram!");
            return;
        }

        const thanhTien = (thuocDangChon.gia / 1000) * gram;

        const thuocMoi = {
            idDon: Date.now(),
            ten: thuocDangChon.ten,
            soLuong: gram,
            donGia: thuocDangChon.gia,
            thanhTien: thanhTien,
        };

        // Thêm thuốc mới vào đơn
        setGioHang((gioHangCu) => [...gioHangCu, thuocMoi]);

        // Chỉ xóa số lượng sau khi thêm
        // Tên thuốc và thuốc đang chọn vẫn được giữ nguyên
    };

    // Xóa thuốc khỏi đơn
    const xoaThuoc = (idDon) => {
        setGioHang(gioHang.filter((item) => item.idDon !== idDon));
    };
    const luuSuaNhanVien = async () => {
        if (!nhanVienCanSua) return;

        if (!tenDangNhapSua.trim() || !hoTenSua.trim()) {
            toast.warning("Vui lòng nhập đầy đủ tên đăng nhập và họ tên!");
            return;
        }

        if (matKhauSua && matKhauSua.length < 6) {
            toast.error("Mật khẩu mới phải có ít nhất 6 ký tự!");
            return;
        }

        try {
            const { data, error } = await supabase.functions.invoke("sua-nhan-vien", {
                body: {
                    id: nhanVienCanSua.id,
                    ten_dang_nhap: tenDangNhapSua.trim().toLowerCase(),
                    ho_ten: hoTenSua.trim(),

                    // Để trống = không đổi mật khẩu
                    mat_khau: matKhauSua || null,
                    quyen_kho_thuoc: quyenKhoThuocSua,
                    quyen_ban_thuoc: quyenBanThuocSua,
                    quyen_xem_benh_nhan: quyenXemBenhNhanSua,
                    quyen_them_thuoc: quyenThemThuocSua,
                    quyen_sua_thuoc: quyenSuaThuocSua,
                    quyen_xoa_thuoc: quyenXoaThuocSua,
                    quyen_sua_gia: quyenSuaGiaSua,
                },
            });

            if (error) {
                console.error("Lỗi sửa nhân viên:", error);
                console.error("Chi tiết:", error.message);
                toast.error(error.message || "Không thể cập nhật tài khoản!");
                return;
            }

            if (data?.error) {
                toast.error(data.error);
                return;
            }

            toast.success("Đã cập nhật tài khoản nhân viên!");

            // Cập nhật ngay danh sách trên giao diện
            setDanhSachNhanVien((ds) =>
                ds.map((nv) =>
                    nv.id === nhanVienCanSua.id
                        ? {
                              ...nv,
                              ten_dang_nhap: tenDangNhapSua.trim().toLowerCase(),
                              ho_ten: hoTenSua.trim(),
                              quyen_ban_thuoc: quyenBanThuocSua,
                              quyen_xem_benh_nhan: quyenXemBenhNhanSua,
                              quyen_them_thuoc: quyenThemThuocSua,
                              quyen_sua_thuoc: quyenSuaThuocSua,
                              quyen_kho_thuoc: quyenKhoThuocSua,
                              quyen_xoa_thuoc: quyenXoaThuocSua,
                              quyen_sua_gia: quyenSuaGiaSua,
                          }
                        : nv,
                ),
            );

            setMatKhauSua("");
            setNhanVienCanSua(null);
        } catch (error) {
            console.error(error);
            toast.error("Có lỗi xảy ra khi cập nhật tài khoản!");
        }
    };
    // Tính tổng tiền
    const tongTien = gioHang.reduce((tong, item) => tong + item.thanhTien, 0);
    // Thanh toán và trừ tồn kho trên Supabase
    const thanhToan = async () => {
        if (gioHang.length === 0) {
            toast.warning("Đơn hàng đang trống!");
            return;
        }

        // Kiểm tra và trừ tồn kho từng thuốc
        for (const item of gioHang) {
            const thuocTrongKho = danhSachThuoc.find(
                (thuoc) => thuoc.id === thuocDangChon?.id || thuoc.ten === item.ten,
            );

            if (!thuocTrongKho) {
                toast.warning(`Không tìm thấy ${item.ten} trong kho!`);
                return;
            }

            if (thuocTrongKho.tonKho < item.soLuong) {
                toast.warning(`${item.ten} không đủ tồn kho! Còn ${thuocTrongKho.tonKho}g`);
                return;
            }

            const tonKhoMoi = thuocTrongKho.tonKho - item.soLuong;

            const { error } = await supabase.from("thuoc").update({ ton_kho: tonKhoMoi }).eq("id", thuocTrongKho.id);

            if (error) {
                toast.error("Lỗi cập nhật kho: " + error.message);
                return;
            }

            // Cập nhật tồn kho trên giao diện
            setDanhSachThuoc((danhSachCu) =>
                danhSachCu.map((thuoc) => (thuoc.id === thuocTrongKho.id ? { ...thuoc, tonKho: tonKhoMoi } : thuoc)),
            );
        }
        // Lưu lịch sử bán hàng
        const { error: loiLuuLichSu } = await supabase.from("lich_su_ban_hang").insert([
            {
                tong_tien: tongTien,
                chi_tiet: gioHang,
            },
        ]);

        if (loiLuuLichSu) {
            toast.error("Lỗi lưu lịch sử bán hàng: " + loiLuuLichSu.message);
            return;
        }
        toast.success(`Thanh toán thành công! Tổng tiền: ${tongTien.toLocaleString("vi-VN")}đ`);

        // Xóa đơn sau khi thanh toán
        setGioHang([]);
    };
    const taiLichSuBanHang = async () => {
        const { data, error } = await supabase
            .from("lich_su_ban_hang")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            toast.error("Lỗi tải lịch sử: " + error.message);
            return;
        }

        setLichSuBanHang(data || []);
    };
    const inHoaDon = (don) => {
        console.log("In hóa đơn:", don);
        toast.info(`Chuẩn bị in hóa đơn #${don.id}`);
    };
    // Thêm thuốc mới vào kho
    // Thêm thuốc mới vào kho và lưu lên Supabase
    const themThuocMoi = async () => {
        if (!tenThuocMoi.trim()) {
            toast.warning("Vui lòng nhập tên thuốc!");
            return;
        }

        if (!giaThuocMoi || Number(giaThuocMoi) <= 0) {
            toast.warning("Vui lòng nhập giá thuốc!");
            return;
        }

        if (tonKhoMoi === "" || Number(tonKhoMoi) < 0) {
            toast.warning("Vui lòng nhập số lượng tồn kho!");
            return;
        }

        const { data, error } = await supabase
            .from("thuoc")
            .insert([
                {
                    ten: tenThuocMoi.trim(),
                    gia: Number(giaThuocMoi),
                    ton_kho: Number(tonKhoMoi),
                },
            ])
            .select();

        if (error) {
            toast.error("Lỗi thêm thuốc: " + error.message);
            return;
        }

        const thuocMoi = {
            id: data[0].id,
            ten: data[0].ten,
            gia: data[0].gia,
            tonKho: data[0].ton_kho,
        };

        setDanhSachThuoc((danhSachCu) => [...danhSachCu, thuocMoi]);

        setTenThuocMoi("");
        setGiaThuocMoi("");
        setTonKhoMoi("");

        toast.success("Đã thêm thuốc và lưu lên server!");
    };
    // =========================
    // SỬA THUỐC
    // =========================

    const batDauSuaThuoc = (thuoc) => {
        setThuocDangSua(thuoc);
        setTenThuocSua(thuoc.ten);
        setGiaThuocSua(thuoc.gia);
        setTonKhoSua(thuoc.tonKho);
    };

    const huySuaThuoc = () => {
        setThuocDangSua(null);
        setTenThuocSua("");
        setGiaThuocSua("");
        setTonKhoSua("");
    };

    const luuSuaThuoc = async () => {
        if (!thuocDangSua) return;

        if (!tenThuocSua.trim()) {
            toast.warning("Vui lòng nhập tên thuốc!");
            return;
        }

        if (!giaThuocSua || Number(giaThuocSua) <= 0) {
            toast.warning("Giá thuốc không hợp lệ!");
            return;
        }

        if (tonKhoSua === "" || Number(tonKhoSua) < 0) {
            toast.warning("Tồn kho không hợp lệ!");
            return;
        }

        const { error } = await supabase
            .from("thuoc")
            .update({
                ten: tenThuocSua.trim(),
                gia: Number(giaThuocSua),
                ton_kho: Number(tonKhoSua),
            })
            .eq("id", thuocDangSua.id);

        if (error) {
            toast.error("Lỗi sửa thuốc: " + error.message);
            return;
        }

        setDanhSachThuoc((danhSachCu) =>
            danhSachCu.map((thuoc) =>
                thuoc.id === thuocDangSua.id
                    ? {
                          ...thuoc,
                          ten: tenThuocSua.trim(),
                          gia: Number(giaThuocSua),
                          tonKho: Number(tonKhoSua),
                      }
                    : thuoc,
            ),
        );

        toast.success("Đã cập nhật thuốc!");
        huySuaThuoc();
    };

    // =========================
    // XÓA THUỐC
    // =========================

    const xoaThuocKho = async () => {
        if (!thuocChoXoa) return;

        const { error } = await supabase.from("thuoc").delete().eq("id", thuocChoXoa.id);

        if (error) {
            toast.error("Lỗi xóa thuốc: " + error.message);
            return;
        }

        setDanhSachThuoc((danhSachCu) => danhSachCu.filter((thuoc) => thuoc.id !== thuocChoXoa.id));

        toast.success(`Đã xóa ${thuocChoXoa.ten}!`);

        setThuocChoXoa(null);
    };
    // =========================
    // TRANG ĐĂNG NHẬP
    // =========================
    if (dangKhoiPhucMatKhau) {
        return (
            <div className="login-page">
                <div className="login-box">
                    <div className="login-icon">🔐</div>

                    <h2>ĐẶT MẬT KHẨU MỚI</h2>

                    <p className="doi-mat-khau-mo-ta">Nhập mật khẩu mới cho tài khoản An Thời Đường</p>

                    <input
                        type="password"
                        placeholder="Mật khẩu mới"
                        value={matKhauMoi}
                        onChange={(e) => setMatKhauMoi(e.target.value)}
                        autoComplete="new-password"
                    />

                    <input
                        type="password"
                        placeholder="Nhập lại mật khẩu mới"
                        value={nhapLaiMatKhau}
                        onChange={(e) => setNhapLaiMatKhau(e.target.value)}
                        autoComplete="new-password"
                    />

                    <button onClick={doiMatKhauMoi}>🔑 Đổi mật khẩu</button>
                </div>
            </div>
        );
    }
    if (!user) {
        return (
            <div>
                <Header />
                <div className="container">
                    <h1>🔐 ĐĂNG NHẬP</h1>

                    <input
                        type="text"
                        placeholder="Tên đăng nhập"
                        value={tenDangNhap}
                        onChange={(e) => setTenDangNhap(e.target.value)}
                        autoComplete="username"
                    />

                    <input
                        type="password"
                        placeholder="Mật khẩu"
                        value={matKhau}
                        onChange={(e) => setMatKhau(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                dangNhap();
                            }
                        }}
                    />

                    <button onClick={dangNhap}>🔑 Đăng nhập</button>
                    <button type="button" className="btn-doi-mat-khau" onClick={guiEmailDoiMatKhau}>
                        Đổi mật khẩu
                    </button>
                </div>
            </div>
        );
    }
    const taiLichSuBenhNhan = async () => {
        const { data, error } = await supabase.from("toa_thuoc").select("*").order("created_at", { ascending: false });

        if (error) {
            toast.error("Lỗi tải lịch sử bệnh nhân: " + error.message);
            return;
        }

        setLichSuBenhNhan(data || []);
    };
    const taiDuLieuBieuDo = async (kieu = "tuan") => {
        const { data, error } = await supabase
            .from("lich_su_ban_hang")
            .select("*")
            .order("created_at", { ascending: true });

        if (error) {
            toast.error("Lỗi tải dữ liệu biểu đồ: " + error.message);
            return;
        }

        const danhSachDon = data || [];
        const homNay = new Date();
        const ketQua = [];

        // ==========================================
        // NGÀY - DOANH THU THEO GIỜ HÔM NAY
        // ==========================================
        if (kieu === "ngay") {
            for (let gio = 0; gio < 24; gio += 2) {
                const tongTien = danhSachDon
                    .filter((don) => {
                        const ngayDon = new Date(don.created_at);

                        return (
                            ngayDon.getDate() === homNay.getDate() &&
                            ngayDon.getMonth() === homNay.getMonth() &&
                            ngayDon.getFullYear() === homNay.getFullYear() &&
                            ngayDon.getHours() >= gio &&
                            ngayDon.getHours() < gio + 2
                        );
                    })
                    .reduce((tong, don) => tong + Number(don.tong_tien || 0), 0);

                ketQua.push({
                    ten: `${gio}h`,
                    doanhThu: tongTien,
                });
            }
        }

        // ==========================================
        // TUẦN - 7 NGÀY GẦN NHẤT
        // ==========================================
        else if (kieu === "tuan") {
            for (let i = 6; i >= 0; i--) {
                const ngay = new Date(homNay);

                ngay.setDate(homNay.getDate() - i);

                const tongTienNgay = danhSachDon
                    .filter((don) => {
                        const ngayDon = new Date(don.created_at);

                        return (
                            ngayDon.getDate() === ngay.getDate() &&
                            ngayDon.getMonth() === ngay.getMonth() &&
                            ngayDon.getFullYear() === ngay.getFullYear()
                        );
                    })
                    .reduce((tong, don) => tong + Number(don.tong_tien || 0), 0);

                ketQua.push({
                    ten: `${ngay.getDate()}/${ngay.getMonth() + 1}`,
                    doanhThu: tongTienNgay,
                });
            }
        }

        // ==========================================
        // THÁNG - TỪNG NGÀY TRONG THÁNG HIỆN TẠI
        // ==========================================
        else if (kieu === "thang") {
            const nam = homNay.getFullYear();
            const thang = homNay.getMonth();

            const soNgayTrongThang = new Date(nam, thang + 1, 0).getDate();

            for (let ngay = 1; ngay <= soNgayTrongThang; ngay++) {
                const tongTienNgay = danhSachDon
                    .filter((don) => {
                        const ngayDon = new Date(don.created_at);

                        return (
                            ngayDon.getDate() === ngay && ngayDon.getMonth() === thang && ngayDon.getFullYear() === nam
                        );
                    })
                    .reduce((tong, don) => tong + Number(don.tong_tien || 0), 0);

                ketQua.push({
                    ten: `${ngay}`,
                    doanhThu: tongTienNgay,
                });
            }
        }

        // ==========================================
        // NĂM - DOANH THU TỪ THÁNG 1 → THÁNG 12
        // ==========================================
        else if (kieu === "nam") {
            const nam = homNay.getFullYear();

            for (let thang = 0; thang < 12; thang++) {
                const tongTienThang = danhSachDon
                    .filter((don) => {
                        const ngayDon = new Date(don.created_at);

                        return ngayDon.getMonth() === thang && ngayDon.getFullYear() === nam;
                    })
                    .reduce((tong, don) => tong + Number(don.tong_tien || 0), 0);

                ketQua.push({
                    ten: `T${thang + 1}`,
                    doanhThu: tongTienThang,
                });
            }
        }

        // ==========================================
        // ĐƯA DỮ LIỆU VÀO BIỂU ĐỒ
        // ==========================================
        setDuLieuBieuDo(ketQua);
    };
    const taiThongKe = async () => {
        try {
            // Lấy lịch sử bán hàng
            const { data: banHang, error: loiBanHang } = await supabase.from("lich_su_ban_hang").select("*");

            if (loiBanHang) {
                toast.error("Lỗi tải doanh thu: " + loiBanHang.message);
                return;
            }

            // Lấy toa thuốc
            const { data: toaThuocData, error: loiToa } = await supabase.from("toa_thuoc").select("*");

            if (loiToa) {
                toast.error("Lỗi tải lượt khám: " + loiToa.message);
                return;
            }

            // Lấy kho thuốc
            const { data: khoThuocData, error: loiKho } = await supabase.from("thuoc").select("*");

            if (loiKho) {
                toast.error("Lỗi tải kho thuốc: " + loiKho.message);
                return;
            }

            const homNay = new Date();

            // Kiểm tra có phải hôm nay không
            const laHomNay = (ngay) => {
                const d = new Date(ngay);

                return (
                    d.getDate() === homNay.getDate() &&
                    d.getMonth() === homNay.getMonth() &&
                    d.getFullYear() === homNay.getFullYear()
                );
            };

            // Kiểm tra có phải tháng này không
            const laThangNay = (ngay) => {
                const d = new Date(ngay);

                return d.getMonth() === homNay.getMonth() && d.getFullYear() === homNay.getFullYear();
            };

            // DOANH THU
            const tongDoanhThu = (banHang || []).reduce((tong, don) => tong + Number(don.tong_tien || 0), 0);

            const doanhThuHomNay = (banHang || [])
                .filter((don) => laHomNay(don.created_at))
                .reduce((tong, don) => tong + Number(don.tong_tien || 0), 0);

            const doanhThuThangNay = (banHang || [])
                .filter((don) => laThangNay(don.created_at))
                .reduce((tong, don) => tong + Number(don.tong_tien || 0), 0);

            // LƯỢT KHÁM
            const tongLuotKham = (toaThuocData || []).length;

            const luotKhamHomNay = (toaThuocData || []).filter((toa) => laHomNay(toa.created_at)).length;

            const luotKhamThangNay = (toaThuocData || []).filter((toa) => laThangNay(toa.created_at)).length;

            // KHO THUỐC
            const tongLoaiThuoc = (khoThuocData || []).length;

            const thuocSapHet = (khoThuocData || []).filter((thuoc) => Number(thuoc.ton_kho || 0) < 500).length;

            setThongKe({
                doanhThuHomNay,
                doanhThuThangNay,
                tongDoanhThu,

                luotKhamHomNay,
                luotKhamThangNay,
                tongLuotKham,

                tongLoaiThuoc,
                thuocSapHet,
            });
        } catch (error) {
            console.error(error);
            toast.error("Có lỗi khi tải thống kê!");
        }
    };
    // =========================
    // TRANG BÁN HÀNG
    // =========================

    if (trang === "thongke") {
        return (
            <>
                <Header />

                <div className="thong-ke-container">
                    <h1>📊 THỐNG KÊ</h1>

                    <div className="thong-ke-layout">
                        {/* CỘT SỐ LIỆU BÊN TRÁI */}
                        <div className="thong-ke-cot-so-lieu">
                            <div className="the-thong-ke">
                                <h3>💰 DOANH THU</h3>

                                <p>
                                    <span>Hôm nay:</span>
                                    <strong>{thongKe.doanhThuHomNay.toLocaleString("vi-VN")}đ</strong>
                                </p>

                                <p>
                                    <span>Tháng này:</span>
                                    <strong>{thongKe.doanhThuThangNay.toLocaleString("vi-VN")}đ</strong>
                                </p>

                                <p>
                                    <span>Tổng:</span>
                                    <strong>{thongKe.tongDoanhThu.toLocaleString("vi-VN")}đ</strong>
                                </p>
                            </div>

                            <div className="the-thong-ke">
                                <h3>👨‍⚕️ KHÁM BỆNH</h3>

                                <p>
                                    <span>Hôm nay:</span>
                                    <strong>{thongKe.luotKhamHomNay}</strong>
                                </p>

                                <p>
                                    <span>Tháng này:</span>
                                    <strong>{thongKe.luotKhamThangNay}</strong>
                                </p>

                                <p>
                                    <span>Tổng lượt khám:</span>
                                    <strong>{thongKe.tongLuotKham}</strong>
                                </p>
                            </div>

                            <div className="the-thong-ke">
                                <h3>📦 KHO THUỐC</h3>

                                <p>
                                    <span>Tổng loại thuốc:</span>
                                    <strong>{thongKe.tongLoaiThuoc}</strong>
                                </p>

                                <p>
                                    <span>Sắp hết:</span>
                                    <strong>{thongKe.thuocSapHet}</strong>
                                </p>
                            </div>
                        </div>

                        {/* BIỂU ĐỒ BÊN PHẢI */}
                        <div className="thong-ke-bieu-do">
                            <div className="thong-ke-bo-loc">
                                <button
                                    className={kieuThongKe === "ngay" ? "active" : ""}
                                    onClick={() => {
                                        setKieuThongKe("ngay");
                                        taiDuLieuBieuDo("ngay");
                                    }}
                                >
                                    Ngày
                                </button>

                                <button
                                    className={kieuThongKe === "tuan" ? "active" : ""}
                                    onClick={() => {
                                        setKieuThongKe("tuan");
                                        taiDuLieuBieuDo("tuan");
                                    }}
                                >
                                    Tuần
                                </button>

                                <button
                                    className={kieuThongKe === "thang" ? "active" : ""}
                                    onClick={() => {
                                        setKieuThongKe("thang");
                                        taiDuLieuBieuDo("thang");
                                    }}
                                >
                                    Tháng
                                </button>

                                <button
                                    className={kieuThongKe === "nam" ? "active" : ""}
                                    onClick={() => {
                                        setKieuThongKe("nam");
                                        taiDuLieuBieuDo("nam");
                                    }}
                                >
                                    Năm
                                </button>
                            </div>

                            <h2>📈 BIỂU ĐỒ DOANH THU</h2>

                            <div className="khung-bieu-do">
                                <ResponsiveContainer width="100%" height={350}>
                                    <LineChart data={duLieuBieuDo}>
                                        <CartesianGrid strokeDasharray="3 3" />

                                        <XAxis dataKey="ten" />

                                        <YAxis />

                                        <Tooltip formatter={(value) => `${Number(value).toLocaleString("vi-VN")}đ`} />

                                        <Line type="monotone" dataKey="doanhThu" strokeWidth={3} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    <button className="nut-quay-lai" onClick={() => setTrang("trangchu")}>
                        ← Quay lại trang chủ
                    </button>
                </div>
            </>
        );
    }

    if (trang === "danhsachnhanvien") {
        return (
            <div>
                <Header />

                <div className="container">
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
                    {nhanVienCanSua && (
                        <div className="popup-sua-nhan-vien">
                            <h2>✏️ Sửa tài khoản nhân viên</h2>

                            <input
                                type="text"
                                placeholder="Tên đăng nhập"
                                value={tenDangNhapSua}
                                onChange={(e) => setTenDangNhapSua(e.target.value)}
                            />

                            <input
                                type="text"
                                placeholder="Họ tên nhân viên"
                                value={hoTenSua}
                                onChange={(e) => setHoTenSua(e.target.value)}
                            />

                            <input
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
            </div>
        );
    }

    // =========================
    // TRANG KHO THUỐC
    // =========================

    // ==========================
    // TRANG LỊCH SỬ BÁN HÀNG
    // ==========================

    if (trang === "lichsu") {
        if (!coQuyen("quyen_ban_thuoc")) {
            setTrang("trangchu");
            return null;
        }
        return (
            <div>
                <Header />
                <button className="nut-quay-lai-nhanh" onClick={() => setTrang("banhang")}>
                    ←
                </button>
                <div className="container">
                    <h1>🧾 LỊCH SỬ BÁN HÀNG</h1>

                    {lichSuBanHang.length === 0 ? (
                        <p>Chưa có lịch sử bán hàng.</p>
                    ) : (
                        lichSuBanHang.map((don) => (
                            <div className="lich-su-item" key={don.id}>
                                <button className="btn-in-nho" onClick={() => inHoaDon(don)} title="In hóa đơn">
                                    🖨️
                                </button>
                                <h3>Hóa đơn #{don.id}</h3>

                                <p>🕒 {new Date(don.created_at).toLocaleString("vi-VN")}</p>

                                {don.chi_tiet?.map((thuoc, index) => (
                                    <div key={index}>
                                        <strong>{thuoc.ten}</strong>
                                        {" — "}
                                        {thuoc.soLuong}g{" — "}
                                        {Number(thuoc.thanhTien).toLocaleString("vi-VN")}đ
                                    </div>
                                ))}

                                <h3>Tổng tiền: {Number(don.tong_tien).toLocaleString("vi-VN")}đ</h3>
                                <hr />
                            </div>
                        ))
                    )}

                    {coQuyen("quyen_ban_thuoc") && <button onClick={() => setTrang("banhang")}>💰 Bán hàng</button>}
                    {coQuyen("quyen_kho_thuoc") && <button onClick={() => setTrang("khothuoc")}>💊 Kho thuốc</button>}
                </div>
            </div>
        );
    }
    const themViThuocVaoToa = () => {
        if (!tenViThuoc.trim() || !soLuongViThuoc) {
            toast.warning("Vui lòng nhập tên vị thuốc và số lượng!");
            return;
        }

        const viThuocMoi = {
            ten: tenViThuoc,
            soLuong: Number(soLuongViThuoc),
        };

        setDanhSachViThuoc([...danhSachViThuoc, viThuocMoi]);

        // Xóa ô nhập sau khi thêm
        setTenViThuoc("");
        setSoLuongViThuoc("");
    };
    // ==========================
    // TRANG TOA THUỐC YHCT
    // ==========================
    const luuToaThuoc = async () => {
        const { error } = await supabase.from("toa_thuoc").insert([
            {
                ...toaThuoc,
                nam_sinh: toaThuoc.nam_sinh ? Number(toaThuoc.nam_sinh) : null,
                so_thang: toaThuoc.so_thang ? Number(toaThuoc.so_thang) : null,
                danh_sach_thuoc: danhSachViThuoc,
            },
        ]);

        if (error) {
            toast.error("Lỗi lưu toa: " + error.message);
            return;
        }

        toast.success("Đã lưu toa thuốc thành công!");
    };

    // =========================
    // TRANG CHỦ
    // =========================

    return (
        <div className="desktop-layout">
            <Sidebar
                trang={trang}
                setTrang={setTrang}
                user={user}
                taiLichSuBenhNhan={taiLichSuBenhNhan}
                taiThongKe={taiThongKe}
                taiDuLieuBieuDo={taiDuLieuBieuDo}
                setKieuThongKe={setKieuThongKe}
                setUser={setUser}
            />

            <div className="desktop-content">
                {trang === "trangchu" && <TrangChu user={user} setTrang={setTrang} />}
                {trang === "banhang" && (
                    <BanHang
                        tuKhoa={tuKhoa}
                        setTuKhoa={setTuKhoa}
                        thuocGoiY={thuocGoiY}
                        thuocDangChon={thuocDangChon}
                        setThuocDangChon={setThuocDangChon}
                        chonThuoc={chonThuoc}
                        soLuong={soLuong}
                        setSoLuong={setSoLuong}
                        soTienMua={soTienMua}
                        setSoTienMua={setSoTienMua}
                        themVaoDon={themVaoDon}
                        resetBanHang={resetBanHang}
                        gioHang={gioHang}
                        xoaThuoc={xoaThuoc}
                        tongTien={tongTien}
                        thanhToan={thanhToan}
                        taiLichSuBanHang={taiLichSuBanHang}
                        setTrang={setTrang}
                    />
                )}
                {trang === "khothuoc" && (
                    <KhoThuoc
                        user={user}
                        setTrang={setTrang}
                        laAdmin={laAdmin}
                        tenThuocMoi={tenThuocMoi}
                        setTenThuocMoi={setTenThuocMoi}
                        giaThuocMoi={giaThuocMoi}
                        setGiaThuocMoi={setGiaThuocMoi}
                        tonKhoMoi={tonKhoMoi}
                        setTonKhoMoi={setTonKhoMoi}
                        themThuocMoi={themThuocMoi}
                        tuKhoaKho={tuKhoaKho}
                        setTuKhoaKho={setTuKhoaKho}
                        danhSachThuocTrongKho={danhSachThuocTrongKho}
                        thuocDangSua={thuocDangSua}
                        setThuocDangSua={setThuocDangSua}
                        tenThuocSua={tenThuocSua}
                        setTenThuocSua={setTenThuocSua}
                        giaThuocSua={giaThuocSua}
                        setGiaThuocSua={setGiaThuocSua}
                        tonKhoSua={tonKhoSua}
                        setTonKhoSua={setTonKhoSua}
                        batDauSuaThuoc={batDauSuaThuoc}
                        luuSuaThuoc={luuSuaThuoc}
                        huySuaThuoc={huySuaThuoc}
                        setThuocChoXoa={setThuocChoXoa}
                        thuocChoXoa={thuocChoXoa}
                        xoaThuocKho={xoaThuocKho}
                    />
                )}
                {trang === "benhnhan" && (
                    <BenhNhan
                        user={user}
                        setTrang={setTrang}
                        lichSuBenhNhan={lichSuBenhNhan}
                        tuKhoaBenhNhan={tuKhoaBenhNhan}
                        setTuKhoaBenhNhan={setTuKhoaBenhNhan}
                        setToaDangXem={setToaDangXem}
                        coQuyen={coQuyen}
                    />
                )}
                {trang === "chitietbenhnhan" && (
                    <ChiTietBenhNhan
                        toaDangXem={toaDangXem}
                        setTrang={setTrang}
                        setToaThuoc={setToaThuoc}
                        setDanhSachViThuoc={setDanhSachViThuoc}
                    />
                )}
                {trang === "taikham" && (
                    <TaiKham
                        toaDangXem={toaDangXem}
                        setToaThuoc={setToaThuoc}
                        setDanhSachViThuoc={setDanhSachViThuoc}
                        setTrang={setTrang}
                    />
                )}
                {trang === "toathuoc" && (
                    <ToaThuoc
                        toaThuoc={toaThuoc}
                        setToaThuoc={setToaThuoc}
                        tenViThuoc={tenViThuoc}
                        setTenViThuoc={setTenViThuoc}
                        soLuongViThuoc={soLuongViThuoc}
                        setSoLuongViThuoc={setSoLuongViThuoc}
                        themViThuocVaoToa={themViThuocVaoToa}
                        danhSachViThuoc={danhSachViThuoc}
                        setDanhSachViThuoc={setDanhSachViThuoc}
                        luuToaThuoc={luuToaThuoc}
                        taiLichSuBenhNhan={taiLichSuBenhNhan}
                        setTrang={setTrang}
                    />
                )}
                {trang === "quanlynhanvien" && (
                    <QuanLyNhanVien setTrang={setTrang} taiDanhSachNhanVien={taiDanhSachNhanVien} />
                )}
            </div>
        </div>
    );
}

export default App;
