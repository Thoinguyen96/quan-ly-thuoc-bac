import "./BanHang.css";
import DocSoTien from "../DocSoTien/DocSoTien";
function BanHang({
    tuKhoa,
    setTuKhoa,
    thuocGoiY,
    thuocDangChon,
    setThuocDangChon,
    chonThuoc,
    soLuong,
    setSoLuong,
    soTienMua,
    setSoTienMua,
    themVaoDon,
    resetBanHang,
    gioHang,
    xoaThuoc,
    tongTien,
    thanhToan,
    taiLichSuBanHang,
    setTrang,
}) {
    const xuLyChonThuoc = (thuoc) => {
        chonThuoc(thuoc);

        // Nếu đã có số gram thì tính lại tiền theo thuốc mới
        if (soLuong && Number(soLuong) > 0) {
            const tienMoi = (thuoc.gia / 1000) * Number(soLuong);
            setSoTienMua(Math.round(tienMoi));
        } else {
            setSoTienMua("");
        }
    };

    return (
        <div className="ban-hang-layout">
            {/* ===================== */}
            {/* CỘT TRÁI */}
            {/* ===================== */}

            <div className="cot-trai nen_trang">
                <button className="btn-reset" onClick={resetBanHang}>
                    ↻
                </button>

                <h1>💰 BÁN HÀNG</h1>

                {/* TÌM THUỐC */}

                <div className="cang_doc">
                    <div style={{ position: "relative" }}>
                        <div className="wrap_tim_ten_thuoc">
                            <input
                                className="input_chuan"
                                type="text"
                                placeholder="🔍 Tìm tên thuốc..."
                                value={tuKhoa}
                                onChange={(e) => {
                                    setTuKhoa(e.target.value);
                                    setThuocDangChon(null);
                                    setSoTienMua("");
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && thuocGoiY.length > 0) {
                                        xuLyChonThuoc(thuocGoiY[0]);
                                    }
                                }}
                            />

                            <span className="nhan_tenthuoc">Tìm tên thuốc</span>
                        </div>

                        {/* GỢI Ý THUỐC */}

                        {tuKhoa && !thuocDangChon && (
                            <div className="goi-y-thuoc">
                                {thuocGoiY.length > 0 ? (
                                    thuocGoiY.map((thuoc) => (
                                        <div key={thuoc.id} className="goi-y-item" onClick={() => xuLyChonThuoc(thuoc)}>
                                            <strong>{thuoc.ten}</strong>
                                            {" — "}
                                            {thuoc.gia.toLocaleString("vi-VN")}
                                            đ/kg
                                        </div>
                                    ))
                                ) : (
                                    <div className="khong-co-thuoc">Không tìm thấy thuốc</div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* THUỐC ĐANG CHỌN */}

                    {thuocDangChon && (
                        <div className="thuoc-dang-chon">
                            <p>
                                Đã chọn: <b>{thuocDangChon.ten}</b>
                                {" — "}
                                {thuocDangChon.gia.toLocaleString("vi-VN")}
                                đ/kg
                            </p>

                            <p>
                                📦 Tồn kho: <b>{thuocDangChon.tonKho}g</b>
                            </p>
                        </div>
                    )}

                    {/* SỐ LƯỢNG */}
                    <div className="wrap_tim_ten_thuoc">
                        <input
                            className="input_chuan"
                            type="text"
                            placeholder="Nhập số lượng (gram) rồi nhấn Enter"
                            value={soLuong ? Number(soLuong).toLocaleString("vi-VN") : ""}
                            onChange={(e) => {
                                const gram = e.target.value.replace(/\D/g, "");

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
                        />
                        <span className="nhan_tenthuoc">Gram</span>
                    </div>

                    {/* SỐ TIỀN */}
                    <div className="wrap_tim_ten_thuoc">
                        <input
                            type="text"
                            className="input_chuan"
                            placeholder="💵 Nhập số tiền khách mua (đ)"
                            value={soTienMua ? Number(soTienMua).toLocaleString("vi-VN") : ""}
                            onChange={(e) => {
                                const tien = e.target.value.replace(/\D/g, "");

                                setSoTienMua(tien);

                                if (thuocDangChon && tien && Number(tien) > 0) {
                                    const gram = (Number(tien) * 1000) / thuocDangChon.gia;

                                    setSoLuong(Math.round(gram * 100) / 100);
                                } else {
                                    setSoLuong("");
                                }
                            }}
                        />
                        <span className="nhan_tenthuoc">Số tiền (vnđ)</span>
                    </div>
                </div>

                <div>
                    <button className="button_banhang" onClick={themVaoDon}>
                        ➕ Thêm vào đơn
                    </button>
                    <button className="button_banhang" onClick={() => setTrang("trangchu")}>
                        ← Quay lại trang chủ
                    </button>
                </div>
            </div>

            {/* ===================== */}
            {/* CỘT PHẢI */}
            {/* ===================== */}

            <div className="cot-phai nen_trang">
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

                                <span>
                                    {item.donGia.toLocaleString("vi-VN")}
                                    đ/kg
                                </span>

                                <strong>{item.thanhTien.toLocaleString("vi-VN")}đ</strong>

                                <button className="btn-xoa-nho" onClick={() => xoaThuoc(item.idDon)}>
                                    🗑️
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <h2 className="tong-tien">Tổng tiền: {tongTien.toLocaleString("vi-VN")}đ</h2>

                <div className="tien-bang-chu">
                    <DocSoTien soTien={tongTien} />
                </div>
                <button className="button_banhang" onClick={thanhToan}>
                    💵 Thanh toán
                </button>

                <button
                    className="button_banhang"
                    onClick={async () => {
                        await taiLichSuBanHang();

                        setTrang("lichsu");
                    }}
                >
                    🧾 Xem lịch sử bán hàng
                </button>
            </div>
        </div>
    );
}

export default BanHang;
