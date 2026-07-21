import { useState, useEffect } from "react";
import "./App.css";
import { supabase } from "./supabase";
import logo from "./assets/Logo.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NutDangXuat from "./components/NutDangXuat";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
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
    const [email, setEmail] = useState("");
    const [matKhau, setMatKhau] = useState("");
    const [user, setUser] = useState(null);

    const [danhSachThuoc, setDanhSachThuoc] = useState([]);
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
    // Dữ liệu ô tìm kiếm
    const [tuKhoa, setTuKhoa] = useState("");
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
    // Đăng nhập tài khoản chủ
    const dangNhap = async () => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: matKhau,
        });

        if (error) {
            toast.error("Đăng nhập thất bại: " + error.message);
            return;
        }

        setUser(data.user);
        toast.success("Đăng nhập thành công!");
    };
    // Lọc thuốc theo từ khóa
    const thuocGoiY = danhSachThuoc.filter((thuoc) => boDau(thuoc.ten).includes(boDau(tuKhoa)));

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
    // TRANG ĐĂNG NHẬP
    // =========================

    if (!user) {
        return (
            <div>
                <Header />
                <div className="container">
                    <h1>🔐 ĐĂNG NHẬP</h1>

                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />

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

    if (trang === "banhang") {
        return (
            <div>
                <Header />
                <div className="ban-hang-layout">
                    {/* ===================== */}
                    {/* CỘT TRÁI */}
                    {/* ===================== */}
                    <div className="cot-trai">
                        <button className="btn-reset" onClick={resetBanHang}>
                            ↻
                        </button>
                        <h1>💰 BÁN HÀNG</h1>

                        {/* Ô TÌM THUỐC */}
                        <div style={{ position: "relative" }}>
                            <input
                                type="text"
                                placeholder="🔍 Tìm tên thuốc..."
                                value={tuKhoa}
                                onChange={(e) => {
                                    setTuKhoa(e.target.value);
                                    setThuocDangChon(null);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && thuocGoiY.length > 0) {
                                        chonThuoc(thuocGoiY[0]);
                                    }
                                }}
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    fontSize: "18px",
                                    boxSizing: "border-box",
                                }}
                            />

                            {/* DANH SÁCH GỢI Ý */}
                            {tuKhoa && !thuocDangChon && (
                                <div
                                    style={{
                                        border: "1px solid #ccc",
                                        background: "white",
                                        position: "absolute",
                                        width: "100%",
                                        zIndex: 10,
                                        boxSizing: "border-box",
                                    }}
                                >
                                    {thuocGoiY.length > 0 ? (
                                        thuocGoiY.map((thuoc) => (
                                            <div
                                                key={thuoc.id}
                                                onClick={() => chonThuoc(thuoc)}
                                                style={{
                                                    padding: "12px",
                                                    cursor: "pointer",
                                                    borderBottom: "1px solid #eee",
                                                    textAlign: "left",
                                                }}
                                            >
                                                <strong>{thuoc.ten}</strong>
                                                {" — "}
                                                {thuoc.gia.toLocaleString("vi-VN")}
                                                đ/kg
                                            </div>
                                        ))
                                    ) : (
                                        <div
                                            style={{
                                                padding: "12px",
                                            }}
                                        >
                                            Không tìm thấy thuốc
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <br />

                        {/* THUỐC ĐANG CHỌN */}

                        {thuocDangChon && (
                            <div>
                                <p>
                                    Đã chọn: <b>{thuocDangChon.ten}</b> — {thuocDangChon.gia.toLocaleString("vi-VN")}
                                    đ/kg
                                </p>

                                <p>
                                    📦 Tồn kho: <b>{thuocDangChon.tonKho}g</b>
                                </p>
                            </div>
                        )}

                        {/* NHẬP SỐ LƯỢNG */}
                        <input
                            type="number"
                            placeholder="Nhập số lượng (gram) rồi nhấn Enter"
                            value={soLuong}
                            onChange={(e) => {
                                const gram = e.target.value;
                                setSoLuong(gram);

                                if (thuocDangChon && gram && Number(gram) > 0) {
                                    const tien = (thuocDangChon.gia / 1000) * Number(gram);
                                    setSoTienMua(Math.round(tien));
                                } else {
                                    setSoTienMua("");
                                }
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    themVaoDon();
                                }
                            }}
                            style={{
                                width: "100%",
                                padding: "12px",
                                fontSize: "18px",
                                boxSizing: "border-box",
                            }}
                        />
                        <input
                            type="text"
                            className="input-so-tien"
                            placeholder="💵 Nhập số tiền khách mua (đ)"
                            value={soTienMua ? Number(soTienMua).toLocaleString("vi-VN") : ""}
                            onChange={(e) => {
                                // Xóa dấu chấm để lấy số thật
                                const tien = e.target.value.replace(/\D/g, "");

                                setSoTienMua(tien);

                                if (thuocDangChon && tien && Number(tien) > 0) {
                                    const gram = (Number(tien) * 1000) / thuocDangChon.gia;

                                    // Làm tròn tối đa 2 số thập phân
                                    setSoLuong(Math.round(gram * 100) / 100);
                                } else {
                                    setSoLuong("");
                                }
                            }}
                        />

                        <br />
                        <br />

                        <button onClick={themVaoDon}>➕ Thêm vào đơn</button>

                        <button onClick={() => setTrang("trangchu")}>← Quay lại trang chủ</button>
                    </div>

                    {/* ===================== */}
                    {/* CỘT PHẢI */}
                    {/* ===================== */}
                    <div className="cot-phai">
                        <h2>🧾 DANH SÁCH THUỐC</h2>

                        {gioHang.length === 0 ? (
                            <p>Chưa có thuốc nào trong đơn.</p>
                        ) : (
                            <div className="bang-thuoc">
                                <div className="dong-thuoc tieu-de-bang">
                                    <span>Tên thuốc</span>
                                    <span>Số lượng</span>
                                    <span>Đơn giá</span>
                                    <span>Thành tiền</span>
                                    <span></span>
                                </div>

                                {gioHang.map((item) => (
                                    <div key={item.idDon} className="dong-thuoc">
                                        <strong>{item.ten}</strong>

                                        <span>{item.soLuong}g</span>

                                        <span>{item.donGia.toLocaleString("vi-VN")}đ/kg</span>

                                        <strong>{item.thanhTien.toLocaleString("vi-VN")}đ</strong>

                                        <button className="btn-xoa-nho" onClick={() => xoaThuoc(item.idDon)}>
                                            🗑️
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <h2 className="tong-tien">Tổng tiền: {tongTien.toLocaleString("vi-VN")}đ</h2>

                        <button onClick={thanhToan}>💵 Thanh toán</button>
                        <button
                            onClick={async () => {
                                await taiLichSuBanHang();
                                setTrang("lichsu");
                            }}
                        >
                            🧾 Xem lịch sử bán hàng
                        </button>
                    </div>
                </div>{" "}
            </div>
        );
    }
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
    // =========================
    // TRANG KHO THUỐC
    // =========================

    if (trang === "khothuoc") {
        return (
            <div>
                <Header />
                <div className="container">
                    <h1>📦 KHO THUỐC</h1>
                    <h2>➕ Thêm thuốc mới</h2>

                    <input
                        type="text"
                        placeholder="Tên thuốc"
                        value={tenThuocMoi}
                        onChange={(e) => setTenThuocMoi(e.target.value)}
                    />

                    <input
                        type="number"
                        placeholder="Giá bán (đ/kg)"
                        value={giaThuocMoi}
                        onChange={(e) => setGiaThuocMoi(e.target.value)}
                    />

                    <input
                        type="number"
                        placeholder="Tồn kho (gram)"
                        value={tonKhoMoi}
                        onChange={(e) => setTonKhoMoi(e.target.value)}
                    />

                    <button onClick={themThuocMoi}>➕ Thêm thuốc vào kho</button>

                    <hr />

                    <h2>Danh sách thuốc trong kho</h2>

                    <div className="bang-kho">
                        <div className="dong-kho tieu-de-kho">
                            <span>Tên thuốc</span>
                            <span>Giá/kg</span>
                            <span>Tồn kho</span>
                        </div>

                        {danhSachThuoc.map((thuoc) => (
                            <div key={thuoc.id} className="dong-kho">
                                <strong>{thuoc.ten}</strong>

                                <span>{thuoc.gia.toLocaleString("vi-VN")}đ</span>

                                <span>{thuoc.tonKho.toLocaleString("vi-VN")}g</span>
                            </div>
                        ))}
                    </div>

                    <button onClick={() => setTrang("trangchu")}>← Quay lại trang chủ</button>
                </div>
            </div>
        );
    }
    // ==========================
    // TRANG LỊCH SỬ BÁN HÀNG
    // ==========================

    if (trang === "lichsu") {
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

                    <button onClick={() => setTrang("banhang")}>← Quay lại bán hàng</button>
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
    if (trang === "chitietbenhnhan" && toaDangXem) {
        return (
            <div>
                <Header />

                <div className="chi-tiet-benh-nhan">
                    <div className="chi-tiet-header">
                        <h1 className="tieu-de-xem">📋 CHI TIẾT LẦN KHÁM</h1>

                        <h1 className="tieu-de-in">TOA THUỐC Y HỌC CỔ TRUYỀN</h1>

                        <button className="nut-quay-lai-lich-su" onClick={() => setTrang("lichsubenhnhan")}>
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
                        <button onClick={() => setTrang("lichsubenhnhan")}>← Quay lại lịch sử</button>
                    </div>
                </div>
            </div>
        );
    }
    if (trang === "lichsubenhnhan") {
        const danhSachLoc = lichSuBenhNhan.filter((benhNhan) => {
            const tuKhoa = tuKhoaBenhNhan.toLowerCase().trim();

            return (
                (benhNhan.ho_ten || "").toLowerCase().includes(tuKhoa) ||
                (benhNhan.so_dien_thoai || "").includes(tuKhoa)
            );
        });

        return (
            <div>
                <Header />

                <div className="lich-su-benh-nhan-container">
                    <div className="lich-su-benh-nhan-header">
                        <h1>📋 LỊCH SỬ BỆNH NHÂN</h1>

                        <button className="nut-ve-toa-thuoc" onClick={() => setTrang("toathuoc")}>
                            ← Quay lại
                        </button>
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
    if (trang === "toathuoc") {
        return (
            <div>
                <Header />

                <div className="toa-thuoc-container">
                    <div className="toa-thuoc-header">
                        <h1>📄 TOA THUỐC Y HỌC CỔ TRUYỀN</h1>
                    </div>

                    <h3>THÔNG TIN BỆNH NHÂN</h3>

                    <input
                        type="text"
                        placeholder="Họ và tên bệnh nhân"
                        value={toaThuoc.ho_ten}
                        onChange={(e) =>
                            setToaThuoc({
                                ...toaThuoc,
                                ho_ten: e.target.value,
                            })
                        }
                    />

                    <div className="toa-hang-ngang">
                        <input
                            type="number"
                            placeholder="Năm sinh"
                            value={toaThuoc.nam_sinh}
                            onChange={(e) =>
                                setToaThuoc({
                                    ...toaThuoc,
                                    nam_sinh: e.target.value,
                                })
                            }
                        />

                        <select
                            value={toaThuoc.gioi_tinh}
                            onChange={(e) =>
                                setToaThuoc({
                                    ...toaThuoc,
                                    gioi_tinh: e.target.value,
                                })
                            }
                        >
                            <option value="">Giới tính</option>
                            <option value="nam">Nam</option>
                            <option value="nu">Nữ</option>
                        </select>
                    </div>

                    <input
                        type="text"
                        placeholder="Số điện thoại"
                        value={toaThuoc.so_dien_thoai}
                        onChange={(e) =>
                            setToaThuoc({
                                ...toaThuoc,
                                so_dien_thoai: e.target.value,
                            })
                        }
                    />

                    <input
                        type="text"
                        placeholder="Địa chỉ"
                        value={toaThuoc.dia_chi}
                        onChange={(e) =>
                            setToaThuoc({
                                ...toaThuoc,
                                dia_chi: e.target.value,
                            })
                        }
                    />

                    <h3>THÔNG TIN KHÁM BỆNH</h3>

                    <textarea
                        placeholder="Triệu chứng / Lý do đến khám"
                        rows="3"
                        value={toaThuoc.trieu_chung}
                        onChange={(e) =>
                            setToaThuoc({
                                ...toaThuoc,
                                trieu_chung: e.target.value,
                            })
                        }
                    />

                    <textarea
                        placeholder="Tiền sử bệnh"
                        rows="2"
                        value={toaThuoc.tien_su_benh}
                        onChange={(e) =>
                            setToaThuoc({
                                ...toaThuoc,
                                tien_su_benh: e.target.value,
                            })
                        }
                    />

                    <textarea
                        placeholder="Chẩn đoán"
                        rows="2"
                        value={toaThuoc.chan_doan}
                        onChange={(e) =>
                            setToaThuoc({
                                ...toaThuoc,
                                chan_doan: e.target.value,
                            })
                        }
                    />

                    <textarea
                        placeholder="Chẩn đoán Y học cổ truyền / Thể bệnh"
                        rows="2"
                        value={toaThuoc.chan_doan_yhct}
                        onChange={(e) =>
                            setToaThuoc({
                                ...toaThuoc,
                                chan_doan_yhct: e.target.value,
                            })
                        }
                    />

                    <textarea
                        placeholder="Pháp điều trị"
                        rows="2"
                        value={toaThuoc.phap_dieu_tri}
                        onChange={(e) =>
                            setToaThuoc({
                                ...toaThuoc,
                                phap_dieu_tri: e.target.value,
                            })
                        }
                    />
                    <h3>ĐƠN THUỐC</h3>

                    <div className="toa-hang-ngang">
                        <input
                            type="text"
                            placeholder="Tên vị thuốc"
                            value={tenViThuoc}
                            onChange={(e) => setTenViThuoc(e.target.value)}
                        />

                        <input
                            type="number"
                            placeholder="Số lượng (g)"
                            value={soLuongViThuoc}
                            onChange={(e) => setSoLuongViThuoc(e.target.value)}
                        />
                    </div>
                    <button onClick={themViThuocVaoToa}>➕ Thêm vị thuốc</button>

                    <div className="danh-sach-toa">
                        {danhSachViThuoc.length === 0 ? (
                            <p>Chưa có vị thuốc nào trong toa.</p>
                        ) : (
                            danhSachViThuoc.map((thuoc, index) => (
                                <div className="toa-thuoc-item" key={index}>
                                    <span>
                                        {index + 1}. <strong>{thuoc.ten}</strong> — {thuoc.soLuong}g
                                    </span>

                                    <button
                                        onClick={() =>
                                            setDanhSachViThuoc(danhSachViThuoc.filter((_, i) => i !== index))
                                        }
                                    >
                                        ❌
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    <h3>CÁCH DÙNG VÀ LỜI DẶN</h3>

                    <textarea
                        placeholder="Cách sắc thuốc / Cách dùng"
                        rows="3"
                        value={toaThuoc.cach_dung}
                        onChange={(e) =>
                            setToaThuoc({
                                ...toaThuoc,
                                cach_dung: e.target.value,
                            })
                        }
                    />

                    <textarea
                        placeholder="Lời dặn bệnh nhân"
                        rows="3"
                        value={toaThuoc.loi_dan}
                        onChange={(e) =>
                            setToaThuoc({
                                ...toaThuoc,
                                loi_dan: e.target.value,
                            })
                        }
                    />

                    <input
                        type="number"
                        placeholder="Số thang"
                        value={toaThuoc.so_thang}
                        onChange={(e) =>
                            setToaThuoc({
                                ...toaThuoc,
                                so_thang: e.target.value,
                            })
                        }
                    />

                    <div className="toa-nut-chuc-nang">
                        <button onClick={luuToaThuoc}>💾 Lưu toa</button>
                        <button
                            onClick={async () => {
                                await taiLichSuBenhNhan();
                                setTrang("lichsubenhnhan");
                            }}
                        >
                            📋 Lịch sử bệnh nhân
                        </button>
                        <button>🖨️ In toa thuốc</button>

                        <button onClick={() => setTrang("trangchu")}>← Quay lại trang chủ</button>
                    </div>
                </div>
            </div>
        );
    }
    // =========================
    // TRANG CHỦ
    // =========================

    return (
        <div>
            <Header />;
            <button className="btn-phieu-cham-cuu" onClick={() => setTrang("phieuchamcuu")}>
                🖨️ Phiếu châm cứu
            </button>
            <div className="container">
                <h1>🏥 QUẢN LÝ THUỐC BẮC</h1>

                <button onClick={() => setTrang("banhang")}>💰 Bán hàng</button>

                <button onClick={() => setTrang("khothuoc")}>📦 Kho thuốc</button>
                <button
                    onClick={async () => {
                        await taiLichSuBenhNhan();
                        setTrang("lichsubenhnhan");
                    }}
                >
                    👨‍⚕️ Bệnh nhân
                </button>
                <button onClick={() => setTrang("toathuoc")}>📄 Toa thuốc</button>
                <button
                    onClick={async () => {
                        await taiThongKe();
                        await taiDuLieuBieuDo("tuan");

                        setKieuThongKe("tuan");
                        setTrang("thongke");
                    }}
                >
                    📊 Thống kê
                </button>
            </div>
            <NutDangXuat setUser={setUser} />
        </div>
    );
}

export default App;
