import { useState, useEffect } from "react";
import "./App.css";
import { supabase } from "./supabase";
import logo from "./assets/Logo.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NutDangXuat from "./components/NutDangXuat";
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
    if (trang === "toathuoc") {
        return (
            <div>
                <Header />

                <div className="toa-thuoc-container">
                    <div className="toa-thuoc-header">
                        <h1>📄 TOA THUỐC Y HỌC CỔ TRUYỀN</h1>
                    </div>

                    <h3>THÔNG TIN BỆNH NHÂN</h3>

                    <input type="text" placeholder="Họ và tên bệnh nhân" />

                    <div className="toa-hang-ngang">
                        <input type="number" placeholder="Năm sinh" />

                        <select>
                            <option value="">Giới tính</option>
                            <option value="nam">Nam</option>
                            <option value="nu">Nữ</option>
                        </select>
                    </div>

                    <input type="text" placeholder="Số điện thoại" />

                    <input type="text" placeholder="Địa chỉ" />

                    <h3>THÔNG TIN KHÁM BỆNH</h3>

                    <textarea placeholder="Triệu chứng / Lý do đến khám" rows="3" />

                    <textarea placeholder="Tiền sử bệnh" rows="2" />

                    <textarea placeholder="Chẩn đoán" rows="2" />

                    <textarea placeholder="Chẩn đoán Y học cổ truyền / Thể bệnh" rows="2" />

                    <textarea placeholder="Pháp điều trị" rows="2" />

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

                    <textarea placeholder="Cách sắc thuốc / Cách dùng" rows="3" />

                    <textarea placeholder="Lời dặn bệnh nhân" rows="3" />

                    <input type="text" placeholder="Số thang" />

                    <div className="toa-nut-chuc-nang">
                        <button onClick={luuToaThuoc}>💾 Lưu toa</button>

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
                <button>📥 Nhập hàng</button>
                <button>👨‍⚕️ Bệnh nhân</button>
                <button onClick={() => setTrang("toathuoc")}>📄 Toa thuốc</button>
                <button>📊 Thống kê</button>
            </div>
            <NutDangXuat setUser={setUser} />
        </div>
    );
}

export default App;
